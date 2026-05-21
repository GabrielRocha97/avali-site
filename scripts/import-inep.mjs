/**
 * Importador Censo Escolar INEP 2025 → Supabase
 * Uso: node scripts/import-inep.mjs <caminho-do-csv>
 * Ex:  node scripts/import-inep.mjs "C:\Users\amaro\Downloads\inep_2025\microdados_censo_escolar_2025\dados\Tabela_Escola_2025.csv"
 */

import fs from 'fs';
import readline from 'readline';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sqxpsvxtztmxexqzngqs.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_Tu52D6Y3u-h-ONMC6zpLXw_kHh2sBv4';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Coordenada central do Brasil como fallback genérico
const BRAZIL_CENTER = [-15.78, -47.93];

function mapType(tp) {
  const t = parseInt(tp);
  if (t === 1) return 'federal';
  if (t === 2) return 'estadual';
  if (t === 3) return 'municipal';
  return 'particular';
}

function mapStages(get) {
  const stages = new Set();
  if (get('IN_COMUM_CRECHE') === '1' || get('IN_COMUM_PRE') === '1') stages.add('infantil');
  if (get('IN_COMUM_FUND_AI') === '1' || get('IN_COMUM_FUND_AF') === '1') stages.add('fundamental');
  if (get('IN_COMUM_MEDIO_MEDIO') === '1' || get('IN_COMUM_MEDIO_INTEGRADO') === '1') stages.add('medio');
  return stages.size ? [...stages] : ['fundamental'];
}

function slugify(text, code) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    + '-' + code;
}

function normalizeName(name) {
  // Converte de maiúsculas para Title Case
  return name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('Uso: node scripts/import-inep.mjs <caminho-do-csv>');
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(csvPath, { encoding: 'latin1' }),
    crlfDelay: Infinity,
  });

  let headers = [];
  let lineCount = 0;
  let processed = 0;
  let skipped = 0;
  const batch = [];

  for await (const line of rl) {
    const row = line.split(';').map(v => v.replace(/"/g, '').trim());

    if (lineCount === 0) {
      headers = row;
      lineCount++;
      continue;
    }
    lineCount++;

    const get = (col) => {
      const idx = headers.indexOf(col);
      return idx >= 0 ? (row[idx] || '') : '';
    };

    // Filtro: apenas escolas ativas (nível Brasil)
    if (get('TP_SITUACAO_FUNCIONAMENTO') !== '1') { skipped++; continue; }
    const city = get('NO_MUNICIPIO').toUpperCase().trim();

    const inepCode  = get('CO_ENTIDADE');
    const rawName   = get('NO_ENTIDADE');
    const name      = normalizeName(rawName);
    const address   = `${get('DS_ENDERECO')} ${get('NU_ENDERECO')}`.trim();
    const neighborhood = normalizeName(get('NO_BAIRRO') || '');
    const zipCode   = get('CO_CEP').padStart(8, '0');
    const type      = mapType(get('TP_DEPENDENCIA'));
    const stages    = mapStages(get);
    const phone     = get('NU_DDD') && get('NU_TELEFONE')
                        ? `(${get('NU_DDD')}) ${get('NU_TELEFONE')}` : '';

    // Latitude/Longitude: INEP 2025 já fornece (vírgula decimal → ponto)
    const latRaw = get('LATITUDE').replace(',', '.');
    const lngRaw = get('LONGITUDE').replace(',', '.');
    const fallback = BRAZIL_CENTER;
    const lat = parseFloat(latRaw) || fallback[0];
    const lng = parseFloat(lngRaw) || fallback[1];

    // Detectar possível escola autismo-friendly
    const nameLower = rawName.toLowerCase();
    const isAutismFriendly =
      nameLower.includes('aee') || nameLower.includes('especial') ||
      nameLower.includes('inclusiv') || nameLower.includes('apae');

    const cityNice = normalizeName(city);
    const slug = slugify(rawName, inepCode);

    batch.push({
      inep_code: inepCode,
      name,
      slug,
      type,
      stages,
      address,
      city: cityNice,
      state: get('SG_UF') || '',
      neighborhood,
      zip_code: zipCode,
      lat,
      lng,
      phone,
      rating: 0,
      review_count: 0,
      avg_price: 0,
      is_verified: false,
      is_autism_friendly: isAutismFriendly,
      is_claimed: false,
      categories: [],
      highlights: [],
      description: '',
    });

    processed++;
    process.stdout.write(`\r📥 ${processed} escolas (${cityNice})                    `);

    // Inserir em lotes de 100
    if (batch.length >= 100) {
      const { error } = await supabase.from('schools').upsert(batch, { onConflict: 'inep_code' });
      if (error) console.error('\n❌ Erro no lote:', error.message);
      batch.length = 0;
    }
  }

  // Lote final
  if (batch.length > 0) {
    const { error } = await supabase.from('schools').upsert(batch, { onConflict: 'inep_code' });
    if (error) console.error('\n❌ Erro no lote final:', error.message);
  }

  console.log(`\n\n✅ Concluído!`);
  console.log(`   ${processed} escolas importadas (Brasil)`);
  console.log(`   ${skipped} escolas inativas ignoradas`);
  console.log(`   Total de linhas processadas: ${lineCount}`);
}

main().catch(console.error);

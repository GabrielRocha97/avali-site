/**
 * Importador Censo Escolar INEP 2025 → Supabase
 * Uso: node scripts/import-inep.mjs <caminho-do-csv>
 * Ex:  node scripts/import-inep.mjs "C:\Users\amaro\Downloads\inep_2025\microdados_censo_escolar_2025\dados\Tabela_Escola_2025.csv"
 */

import fs from 'fs';
import readline from 'readline';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sqxpsvxtztmxexqzngqs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Tu52D6Y3u-h-ONMC6zpLXw_kHh2sBv4';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Municípios do Vale do Paraíba SP
const VALE_CIDADES = new Set([
  'SÃO JOSÉ DOS CAMPOS','TAUBATÉ','JACAREÍ','CAÇAPAVA',
  'PINDAMONHANGABA','GUARATINGUETÁ','LORENA','CRUZEIRO',
  'APARECIDA','TREMEMBÉ','ROSEIRA','POTIM','CUNHA',
  'CACHOEIRA PAULISTA','PIQUETE','BANANAL','QUELUZ',
  'LAVRINHAS','CANAS','SILVEIRAS','ARAPEÍ',
  'SÃO JOSÉ DO BARREIRO','REDENÇÃO DA SERRA','NATIVIDADE DA SERRA',
  'SANTA BRANCA','PARAIBUNA','JAMBEIRO','MONTEIRO LOBATO',
  'SÃO BENTO DO SAPUCAÍ','CAMPOS DO JORDÃO','SANTO ANTÔNIO DO PINHAL',
  'SÃO LUÍS DO PARAITINGA','LAGOINHA',
]);

// Coordenadas centrais como fallback
const CITY_CENTERS = {
  'SÃO JOSÉ DOS CAMPOS': [-23.1896, -45.8841],
  'TAUBATÉ':             [-23.0268, -45.5554],
  'JACAREÍ':             [-23.2987, -45.9655],
  'CAÇAPAVA':            [-23.1019, -45.7075],
  'PINDAMONHANGABA':     [-22.9239, -45.4614],
  'GUARATINGUETÁ':       [-22.8164, -45.1939],
  'LORENA':              [-22.7274, -45.1226],
  'CRUZEIRO':            [-22.5771, -44.9627],
  'APARECIDA':           [-22.8492, -45.2311],
  'TREMEMBÉ':            [-22.9598, -45.5497],
  'CAMPOS DO JORDÃO':    [-22.7390, -45.5910],
  'CACHOEIRA PAULISTA':  [-22.6792, -45.0075],
  'CUNHA':               [-23.0742, -44.9581],
};

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

    // Filtros: apenas SP, Vale do Paraíba, escolas ativas
    if (get('SG_UF') !== 'SP') continue;
    const city = get('NO_MUNICIPIO').toUpperCase().trim();
    if (!VALE_CIDADES.has(city)) continue;
    if (get('TP_SITUACAO_FUNCIONAMENTO') !== '1') { skipped++; continue; }

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
    const fallback = CITY_CENTERS[city] || [-23.18, -45.88];
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
      state: 'SP',
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
  console.log(`   ${processed} escolas importadas do Vale do Paraíba`);
  console.log(`   ${skipped} escolas inativas ignoradas`);
  console.log(`   Total de linhas processadas: ${lineCount}`);
}

main().catch(console.error);

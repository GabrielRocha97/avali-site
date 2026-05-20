/**
 * Importador de escolas do INEP para o Supabase — Vale do Paraíba SP
 *
 * Como usar:
 * 1. Baixe o Censo Escolar em: https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/censo-escolar
 * 2. Extraia o arquivo CSV (ex: microdados_ed_basica_2023.csv)
 * 3. Execute: node scripts/import-inep.mjs <caminho-do-csv>
 *
 * Requer no .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import fs from 'fs';
import readline from 'readline';
import { createClient } from '@supabase/supabase-js';

// ─── Configuração ────────────────────────────────────────────
const SUPABASE_URL = 'https://sqxpsvxtztmxexqzngqs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Tu52D6Y3u-h-ONMC6zpLXw_kHh2sBv4';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Municípios do Vale do Paraíba SP (nome exato como no INEP)
const VALE_CIDADES = new Set([
  'São José dos Campos', 'Taubaté', 'Jacareí', 'Caçapava',
  'Pindamonhangaba', 'Guaratinguetá', 'Lorena', 'Cruzeiro',
  'Aparecida', 'Tremembé', 'Roseira', 'Potim', 'Cunha',
  'Cachoeira Paulista', 'Piquete', 'Bananal', 'Queluz',
  'Lavrinhas', 'Canas', 'Silveiras', 'Arapeí',
  'São José do Barreiro', 'Redenção da Serra', 'Natividade da Serra',
  'Santa Branca', 'Paraibuna', 'Jambeiro', 'Monteiro Lobato',
  'São Bento do Sapucaí', 'Campos do Jordão', 'Santo Antônio do Pinhal',
  'São Luís do Paraitinga', 'Lagoinha',
]);

// Coordenadas centrais das cidades (fallback quando geocoding falhar)
const CITY_CENTERS = {
  'São José dos Campos': { lat: -23.1896, lng: -45.8841 },
  'Taubaté':             { lat: -23.0268, lng: -45.5554 },
  'Jacareí':             { lat: -23.2987, lng: -45.9655 },
  'Caçapava':            { lat: -23.1019, lng: -45.7075 },
  'Pindamonhangaba':     { lat: -22.9239, lng: -45.4614 },
  'Guaratinguetá':       { lat: -22.8164, lng: -45.1939 },
  'Lorena':              { lat: -22.7274, lng: -45.1226 },
  'Cruzeiro':            { lat: -22.5771, lng: -44.9627 },
  'Aparecida':           { lat: -22.8492, lng: -45.2311 },
  'Tremembé':            { lat: -22.9598, lng: -45.5497 },
  'Campos do Jordão':    { lat: -22.7390, lng: -45.5910 },
  'Cachoeira Paulista':  { lat: -22.6792, lng: -45.0075 },
  'Cunha':               { lat: -23.0742, lng: -44.9581 },
};

// Mapeamento tipo INEP → tipo Avali
function mapType(tp) {
  const t = parseInt(tp);
  if (t === 1) return 'federal';
  if (t === 2) return 'estadual';
  if (t === 3) return 'municipal';
  return 'particular';
}

// Etapas de ensino ofertadas
function mapStages(row, headers) {
  const stages = [];
  const get = (col) => row[headers.indexOf(col)] || '0';
  if (get('IN_EDUCACAO_INFANTIL') === '1') stages.push('infantil');
  if (get('IN_ENSINO_FUNDAMENTAL') === '1') stages.push('fundamental');
  if (get('IN_ENSINO_MEDIO') === '1' || get('IN_ENSINO_MEDIO_TECNICO') === '1') stages.push('medio');
  return stages.length ? stages : ['fundamental'];
}

// Geocoding via Nominatim (1 req/s)
async function geocode(address, city, state) {
  try {
    const q = encodeURIComponent(`${address}, ${city}, ${state}, Brasil`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
      { headers: { 'User-Agent': 'Avali/1.0 (avali.com.br)' } }
    );
    const data = await res.json();
    if (data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {}
  return CITY_CENTERS[city] || { lat: -23.18, lng: -45.88 };
}

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Importação principal ─────────────────────────────────────
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
  let count = 0;
  let imported = 0;
  const batch = [];

  for await (const line of rl) {
    const row = line.split(';').map(v => v.replace(/"/g, '').trim());

    if (count === 0) {
      headers = row;
      count++;
      continue;
    }

    const get = (col) => row[headers.indexOf(col)] || '';

    // Filtrar por estado SP e cidades do Vale
    if (get('SG_UF') !== 'SP') continue;
    const city = get('NO_MUNICIPIO');
    if (!VALE_CIDADES.has(city)) continue;

    // Apenas escolas ativas
    if (get('TP_SITUACAO_FUNCIONAMENTO') !== '1') continue;

    const inepCode = get('CO_ENTIDADE');
    const name = get('NO_ENTIDADE');
    const address = `${get('DS_ENDERECO')} ${get('NU_ENDERECO')}`.trim();
    const neighborhood = get('NO_BAIRRO') || '';
    const zipCode = get('CO_CEP').padStart(8, '0');
    const type = mapType(get('TP_DEPENDENCIA'));
    const stages = mapStages(row, headers);
    const isAutismFriendly = name.toLowerCase().includes('aee') ||
                              name.toLowerCase().includes('especial') ||
                              name.toLowerCase().includes('inclusiv');

    // Geocoding com rate limit de 1/s
    const coords = await geocode(address, city, 'SP');
    await sleep(1100);

    const slug = `${slugify(name)}-${inepCode}`;

    batch.push({
      inep_code: inepCode,
      name,
      slug,
      type,
      stages,
      address,
      city,
      state: 'SP',
      neighborhood,
      zip_code: zipCode,
      lat: coords.lat,
      lng: coords.lng,
      rating: 0,
      review_count: 0,
      avg_price: 0,
      is_verified: false,
      is_autism_friendly: isAutismFriendly,
      is_claimed: false,
      categories: [],
      highlights: [],
    });

    imported++;
    process.stdout.write(`\r📥 ${imported} escolas processadas (${city})`);

    // Inserir em lotes de 50
    if (batch.length >= 50) {
      const { error } = await supabase.from('schools').upsert(batch, { onConflict: 'inep_code' });
      if (error) console.error('\nErro ao inserir lote:', error.message);
      batch.length = 0;
    }
  }

  // Inserir restantes
  if (batch.length > 0) {
    const { error } = await supabase.from('schools').upsert(batch, { onConflict: 'inep_code' });
    if (error) console.error('\nErro ao inserir lote final:', error.message);
  }

  console.log(`\n\n✅ Importação concluída: ${imported} escolas do Vale do Paraíba`);
}

main().catch(console.error);

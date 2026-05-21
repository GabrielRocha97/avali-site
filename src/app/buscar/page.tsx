'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Search, SlidersHorizontal, Map, List, X, LocateFixed, Loader2, ArrowUpDown, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SchoolCard from '@/components/SchoolCard';
import { haversineDistance, formatDistance } from '@/lib/geo';
import type { School } from '@/lib/types';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const TYPES = [
  { value: '', label: 'Todos os tipos' },
  { value: 'particular', label: 'Particular' },
  { value: 'publica', label: 'Pública' },
  { value: 'estadual', label: 'Estadual' },
  { value: 'municipal', label: 'Municipal' },
  { value: 'federal', label: 'Federal' },
  { value: 'bilingue', label: 'Bilíngue' },
];

const STAGES = [
  { value: '', label: 'Todas as etapas' },
  { value: 'infantil', label: 'Educação Infantil' },
  { value: 'fundamental', label: 'Ensino Fundamental' },
  { value: 'medio', label: 'Ensino Médio' },
];

type SortBy = 'rating' | 'price_asc' | 'price_desc' | 'distance';
type GeoState = 'idle' | 'loading' | 'granted' | 'denied';
type CityResult = { city: string; state: string; lat: number; lng: number };

export default function BuscarPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'map' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    sortBy: 'rating' as SortBy,
    stage: '',
    minRating: 0,
    maxPrice: 0,
    autismFriendly: false,
  });
  const [geoState, setGeoState] = useState<GeoState>('idle');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.55, -46.63]);
  const [mapZoom, setMapZoom] = useState(5);
  const cityJustSelected = useRef(false);

  // Schools fetch — server search when query ≥ 2 chars, otherwise bbox or sample
  useEffect(() => {
    let cancelled = false;

    if (query && query.length >= 2) {
      setSearching(true);
      const timer = setTimeout(() => {
        fetch(`/api/schools?q=${encodeURIComponent(query)}`)
          .then(r => r.json())
          .then(data => {
            if (!cancelled && Array.isArray(data)) {
              setSchools(data);
              setLoadingSchools(false);
              setSearching(false);
            }
          })
          .catch(() => { if (!cancelled) { setLoadingSchools(false); setSearching(false); } });
      }, 500);
      return () => { cancelled = true; clearTimeout(timer); setSearching(false); };
    }

    setSearching(false);
    const url = userLocation
      ? `/api/schools?lat=${userLocation.lat}&lng=${userLocation.lng}`
      : '/api/schools';
    fetch(url)
      .then(r => r.json())
      .then(data => { if (!cancelled) { setSchools(Array.isArray(data) ? data : []); setLoadingSchools(false); } })
      .catch(() => { if (!cancelled) setLoadingSchools(false); });
    return () => { cancelled = true; };
  }, [userLocation, query]);

  // City autocomplete suggestions
  useEffect(() => {
    if (cityJustSelected.current) { cityJustSelected.current = false; return; }
    if (!query || query.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    const timer = setTimeout(() => {
      fetch(`/api/cities?q=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setSuggestions(data);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        })
        .catch(() => {});
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Auto-request location on page load
  useEffect(() => {
    if (!navigator.geolocation) { setGeoState('denied'); return; }
    setGeoState('loading');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        setMapZoom(12);
        setGeoState('granted');
        setFilters(f => ({ ...f, sortBy: 'distance' }));
        setView('map');
      },
      () => setGeoState('denied'),
      { timeout: 10000, maximumAge: 300000 },
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function requestLocation() {
    if (!navigator.geolocation) { setGeoState('denied'); return; }
    setGeoState('loading');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        setMapZoom(12);
        setGeoState('granted');
        setFilters(f => ({ ...f, sortBy: 'distance' }));
        setView('map');
      },
      () => setGeoState('denied'),
      { timeout: 10000, maximumAge: 60000 }
    );
  }

  function selectCity(s: CityResult) {
    cityJustSelected.current = true;
    setQuery(s.city);
    setMapCenter([s.lat, s.lng]);
    setMapZoom(12);
    setShowSuggestions(false);
    setSuggestions([]);
    setView('map');
  }

  function clearQuery() {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  }

  const schoolsWithDistance = useMemo(() => {
    return schools.map(s => ({
      ...s,
      distanceKm: userLocation
        ? haversineDistance(userLocation.lat, userLocation.lng, s.lat, s.lng)
        : null,
    }));
  }, [schools, userLocation]);

  const filtered = useMemo(() => {
    let result = schoolsWithDistance.filter(s => {
      if (filters.city && !s.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.type && s.type !== filters.type) return false;
      if (filters.stage && !s.stages.includes(filters.stage as School['stages'][number])) return false;
      if (filters.minRating && s.rating < filters.minRating) return false;
      if (filters.maxPrice && s.avgPrice > filters.maxPrice) return false;
      if (filters.autismFriendly && !s.isAutismFriendly) return false;
      return true;
    });

    if (filters.sortBy === 'distance' && userLocation) {
      result = [...result].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
    } else if (filters.sortBy === 'price_asc') {
      result = [...result].sort((a, b) => (a.avgPrice || 999999) - (b.avgPrice || 999999));
    } else if (filters.sortBy === 'price_desc') {
      result = [...result].sort((a, b) => b.avgPrice - a.avgPrice);
    } else {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [filters, schoolsWithDistance, userLocation]);

  const sortLabel: Record<SortBy, string> = {
    rating: 'Melhor nota',
    price_asc: 'Mensalidade crescente',
    price_desc: 'Mensalidade decrescente',
    distance: 'Mais próximas',
  };

  if (loadingSchools) return (
    <>
      <Header />
      <div className="pt-16 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-coral mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Carregando escolas...</p>
        </div>
      </div>
    </>
  );

  const activeFilterCount = [
    filters.city,
    filters.stage,
    filters.minRating > 0,
    filters.maxPrice > 0,
    filters.autismFriendly,
  ].filter(Boolean).length;

  return (
    <>
      <Header />
      <div className="pt-16 min-h-screen bg-cream">

        {/* Top search bar */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto flex gap-3 flex-wrap">

            {/* Search input with autocomplete */}
            <div className="relative flex-1 min-w-0">
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus-within:ring-2 focus-within:ring-coral/30 focus-within:border-coral">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onKeyDown={e => { if (e.key === 'Escape') setShowSuggestions(false); }}
                  placeholder="Buscar por cidade ou escola..."
                  className="flex-1 outline-none text-sm text-navy placeholder-gray-400 bg-transparent"
                />
                {query && (
                  <button onClick={clearQuery}>
                    <X size={16} className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* City suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-[1000] overflow-hidden">
                  <p className="px-4 pt-2.5 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cidades encontradas</p>
                  {suggestions.map(s => (
                    <button
                      key={`${s.city}-${s.state}`}
                      onMouseDown={() => selectCity(s)}
                      className="w-full px-4 py-3 text-left hover:bg-cream-card flex items-center gap-3 border-t border-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center shrink-0">
                        <MapPin size={14} className="text-coral" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm">{s.city}</p>
                        <p className="text-xs text-gray-400">{s.state} · Ver escolas no mapa</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={requestLocation}
              disabled={geoState === 'loading'}
              title={geoState === 'denied' ? 'Localização negada pelo navegador' : 'Usar minha localização'}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all
                ${geoState === 'granted' ? 'bg-navy text-white border-navy' :
                  geoState === 'denied' ? 'border-red-200 text-red-400 cursor-not-allowed' :
                  'border-gray-200 text-navy hover:bg-cream-card'}`}>
              {geoState === 'loading'
                ? <Loader2 size={16} className="animate-spin" />
                : <LocateFixed size={16} />}
              <span className="hidden sm:inline">
                {geoState === 'granted' ? 'Perto de mim' : geoState === 'denied' ? 'Negada' : 'Perto de mim'}
              </span>
            </button>

            <div className="hidden sm:flex border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setView('list')}
                className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5 transition-all
                  ${view === 'list' ? 'bg-navy text-white' : 'text-navy hover:bg-cream-card'}`}>
                <List size={16} /> Lista
              </button>
              <button onClick={() => setView('map')}
                className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5 transition-all
                  ${view === 'map' ? 'bg-navy text-white' : 'text-navy hover:bg-cream-card'}`}>
                <Map size={16} /> Mapa
              </button>
            </div>
          </div>

          {/* Quick filter bar — always visible */}
          <div className="max-w-7xl mx-auto mt-3 flex gap-2 flex-wrap items-center">

            {/* Cidade */}
            <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-coral/30 focus-within:border-coral flex-1 min-w-[140px] max-w-xs">
              <span className="text-xs text-gray-400 font-semibold shrink-0">Cidade</span>
              <input
                value={filters.city}
                onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
                placeholder="ex: São Paulo"
                className="flex-1 outline-none text-sm text-navy placeholder-gray-400 bg-transparent min-w-0"
              />
              {filters.city && (
                <button onClick={() => setFilters(f => ({ ...f, city: '' }))}>
                  <X size={13} className="text-gray-400" />
                </button>
              )}
            </div>

            {/* Escola (tipo) */}
            <select
              value={filters.type}
              onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
              className={`input text-sm py-2 pr-8 ${filters.type ? 'border-coral text-coral font-semibold' : ''}`}
            >
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.value ? t.label : 'Tipo de escola'}</option>)}
            </select>

            {/* Ordenar por */}
            <div className={`flex items-center gap-1.5 border rounded-xl px-3 py-2 bg-white text-sm font-semibold transition-all
              ${filters.sortBy !== 'rating' ? 'border-coral text-coral' : 'border-gray-200 text-navy'}`}>
              <ArrowUpDown size={14} className="shrink-0" />
              <select
                value={filters.sortBy}
                onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value as SortBy }))}
                className="outline-none bg-transparent cursor-pointer font-semibold text-sm appearance-none"
              >
                <option value="rating">Melhor nota</option>
                <option value="price_asc">Mensalidade ↑ crescente</option>
                <option value="price_desc">Mensalidade ↓ decrescente</option>
                {userLocation && <option value="distance">Mais próximas</option>}
              </select>
            </div>

            {/* Mais filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all
                ${showFilters ? 'bg-navy text-white border-navy' : 'border-gray-200 text-navy hover:bg-cream-card'}`}>
              <SlidersHorizontal size={15} />
              <span>Filtros</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-coral text-white text-[10px] font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Advanced filters panel */}
          {showFilters && (
            <div className="max-w-7xl mx-auto mt-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1.5">Etapa</p>
                <select value={filters.stage} onChange={e => setFilters(f => ({ ...f, stage: e.target.value }))}
                  className="input text-sm w-full">
                  {STAGES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1.5">Nota mínima</p>
                <select value={filters.minRating} onChange={e => setFilters(f => ({ ...f, minRating: Number(e.target.value) }))}
                  className="input text-sm w-full">
                  <option value={0}>Qualquer nota</option>
                  <option value={3}>3.0+ estrelas</option>
                  <option value={4}>4.0+ estrelas</option>
                  <option value={4.5}>4.5+ estrelas</option>
                </select>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1.5">Mensalidade máx.</p>
                <select value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
                  className="input text-sm w-full">
                  <option value={0}>Qualquer valor</option>
                  <option value={1000}>Até R$ 1.000</option>
                  <option value={2000}>Até R$ 2.000</option>
                  <option value={3500}>Até R$ 3.500</option>
                  <option value={6000}>Até R$ 6.000</option>
                </select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm font-semibold text-navy cursor-pointer">
                  <input type="checkbox" checked={filters.autismFriendly}
                    onChange={e => setFilters(f => ({ ...f, autismFriendly: e.target.checked }))}
                    className="accent-coral w-4 h-4" />
                  Autismo-Friendly
                </label>
              </div>
              <div className="flex items-end pb-1">
                <button
                  onClick={() => setFilters({ city: '', type: '', sortBy: 'rating', stage: '', minRating: 0, maxPrice: 0, autismFriendly: false })}
                  className="text-xs text-coral font-bold hover:underline">
                  Limpar filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Geo banner */}
        {geoState === 'idle' && (
          <div className="bg-navy/5 border-b border-navy/10 px-4 py-2.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <p className="text-xs text-navy/70">
                <LocateFixed size={12} className="inline mr-1" />
                Ative sua localização para ver escolas próximas a você.
              </p>
              <button onClick={requestLocation} className="text-xs text-coral font-bold hover:underline shrink-0">
                Ativar agora →
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              {searching
                ? <><Loader2 size={14} className="animate-spin text-coral" /> Buscando escolas...</>
                : <>
                    <strong className="text-navy">{filtered.length}</strong> escola{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
                    {query && <> para <strong className="text-navy">"{query}"</strong></>}
                    {filters.city && !query && <> em <strong className="text-navy">{filters.city}</strong></>}
                  </>
              }
            </p>
            <p className="text-xs text-gray-400 font-semibold flex items-center gap-1">
              <ArrowUpDown size={11} /> {sortLabel[filters.sortBy]}
            </p>
          </div>

          {view === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(school => (
                <SchoolCard
                  key={school.id}
                  school={school}
                  distance={school.distanceKm !== null ? formatDistance(school.distanceKm) : undefined}
                />
              ))}
              {filtered.length === 0 && !searching && (
                <div className="col-span-3 text-center py-16 text-gray-400">
                  <Search size={40} className="mx-auto mb-4 opacity-30" />
                  <p className="font-semibold">Nenhuma escola encontrada</p>
                  <p className="text-sm mt-1">Tente outros filtros ou termos de busca</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:h-[calc(100vh-300px)]">
              <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-card h-64 sm:h-80 lg:h-full">
                <MapView
                  schools={filtered}
                  center={mapCenter}
                  zoom={mapZoom}
                  userLocation={userLocation}
                />
              </div>
              <div className="lg:overflow-y-auto space-y-4 pr-1">
                {filtered.map(school => (
                  <SchoolCard
                    key={school.id}
                    school={school}
                    compact
                    distance={school.distanceKm !== null ? formatDistance(school.distanceKm) : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

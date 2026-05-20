'use client';
import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Search, SlidersHorizontal, Map, List, X, LocateFixed, Loader2 } from 'lucide-react';
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
  { value: 'bilingue', label: 'Bilíngue' },
];

const STAGES = [
  { value: '', label: 'Todas as etapas' },
  { value: 'infantil', label: 'Educação Infantil' },
  { value: 'fundamental', label: 'Ensino Fundamental' },
  { value: 'medio', label: 'Ensino Médio' },
];

type GeoState = 'idle' | 'loading' | 'granted' | 'denied';

export default function BuscarPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'map' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '', stage: '', minRating: 0, maxPrice: 0, autismFriendly: false, sortByDistance: false,
  });
  const [geoState, setGeoState] = useState<GeoState>('idle');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetch('/api/schools')
      .then(r => r.json())
      .then(data => { setSchools(Array.isArray(data) ? data : []); setLoadingSchools(false); })
      .catch(() => setLoadingSchools(false));
  }, []);

  function requestLocation() {
    if (!navigator.geolocation) {
      setGeoState('denied');
      return;
    }
    setGeoState('loading');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoState('granted');
        setFilters(f => ({ ...f, sortByDistance: true }));
        setView('map');
      },
      () => setGeoState('denied'),
      { timeout: 10000, maximumAge: 60000 }
    );
  }

  const schoolsWithDistance = useMemo(() => {
    return schools.map(s => ({
      ...s,
      distanceKm: userLocation
        ? haversineDistance(userLocation.lat, userLocation.lng, s.lat, s.lng)
        : null,
    }));
  }, [userLocation]);

  const filtered = useMemo(() => {
    let result = schoolsWithDistance.filter(s => {
      if (query && !s.name.toLowerCase().includes(query.toLowerCase()) &&
          !s.city.toLowerCase().includes(query.toLowerCase()) &&
          !s.neighborhood.toLowerCase().includes(query.toLowerCase())) return false;
      if (filters.type && s.type !== filters.type) return false;
      if (filters.stage && !s.stages.includes(filters.stage as School['stages'][number])) return false;
      if (filters.minRating && s.rating < filters.minRating) return false;
      if (filters.maxPrice && s.avgPrice > filters.maxPrice) return false;
      if (filters.autismFriendly && !s.isAutismFriendly) return false;
      return true;
    });

    if (filters.sortByDistance && userLocation) {
      result = [...result].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
    }

    return result;
  }, [query, filters, schoolsWithDistance, userLocation]);

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

  const mapCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [-23.55, -46.63];

  return (
    <>
      <Header />
      <div className="pt-16 min-h-screen bg-cream">

        {/* Search bar */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto flex gap-3 flex-wrap">
            <div className="flex-1 min-w-0 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus-within:ring-2 focus-within:ring-coral/30 focus-within:border-coral">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Buscar por escola, cidade ou bairro..."
                className="flex-1 outline-none text-sm text-navy placeholder-gray-400 bg-transparent" />
              {query && <button onClick={() => setQuery('')}><X size={16} className="text-gray-400" /></button>}
            </div>

            {/* Geolocation button */}
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
                {geoState === 'granted' ? 'Perto de mim' : geoState === 'denied' ? 'Localização negada' : 'Perto de mim'}
              </span>
            </button>

            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all
                ${showFilters ? 'bg-navy text-white border-navy' : 'border-gray-200 text-navy hover:bg-cream-card'}`}>
              <SlidersHorizontal size={16} /> Filtros
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

          {/* Filters panel */}
          {showFilters && (
            <div className="max-w-7xl mx-auto mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
                className="input text-sm">
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <select value={filters.stage} onChange={e => setFilters(f => ({ ...f, stage: e.target.value }))}
                className="input text-sm">
                {STAGES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <select value={filters.minRating} onChange={e => setFilters(f => ({ ...f, minRating: Number(e.target.value) }))}
                className="input text-sm">
                <option value={0}>Qualquer nota</option>
                <option value={3}>3.0+ estrelas</option>
                <option value={4}>4.0+ estrelas</option>
                <option value={4.5}>4.5+ estrelas</option>
              </select>
              <select value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
                className="input text-sm">
                <option value={0}>Qualquer preço</option>
                <option value={1000}>Até R$ 1.000</option>
                <option value={2000}>Até R$ 2.000</option>
                <option value={3500}>Até R$ 3.500</option>
                <option value={6000}>Até R$ 6.000</option>
              </select>
              <label className="flex items-center gap-2 text-sm font-semibold text-navy cursor-pointer">
                <input type="checkbox" checked={filters.autismFriendly}
                  onChange={e => setFilters(f => ({ ...f, autismFriendly: e.target.checked }))}
                  className="accent-coral w-4 h-4" />
                Autismo-Friendly
              </label>
              {userLocation && (
                <label className="flex items-center gap-2 text-sm font-semibold text-navy cursor-pointer">
                  <input type="checkbox" checked={filters.sortByDistance}
                    onChange={e => setFilters(f => ({ ...f, sortByDistance: e.target.checked }))}
                    className="accent-coral w-4 h-4" />
                  Por distância
                </label>
              )}
            </div>
          )}
        </div>

        {/* Geo banner */}
        {geoState === 'idle' && (
          <div className="bg-navy/5 border-b border-navy/10 px-4 py-2.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <p className="text-xs text-navy/70">
                <LocateFixed size={12} className="inline mr-1" />
                Ative sua localização para ver escolas próximas a você, ordenadas por distância.
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
            <p className="text-sm text-gray-500">
              <strong className="text-navy">{filtered.length}</strong> escola{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
              {query && <> para <strong className="text-navy">"{query}"</strong></>}
            </p>
            {geoState === 'granted' && (
              <p className="text-xs text-coral font-semibold flex items-center gap-1">
                <LocateFixed size={12} /> Ordenadas por distância
              </p>
            )}
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
              {filtered.length === 0 && (
                <div className="col-span-3 text-center py-16 text-gray-400">
                  <Search size={40} className="mx-auto mb-4 opacity-30" />
                  <p className="font-semibold">Nenhuma escola encontrada</p>
                  <p className="text-sm mt-1">Tente outros filtros ou termos de busca</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[calc(100vh-240px)]">
              <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-card" style={{ minHeight: 400 }}>
                <MapView
                  schools={filtered}
                  center={mapCenter}
                  zoom={userLocation ? 12 : 10}
                  userLocation={userLocation}
                />
              </div>
              <div className="overflow-y-auto space-y-4 pr-1">
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

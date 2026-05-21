'use client';
import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  schoolId: string;
  schoolName: string;
  initialSaved: boolean;
  isLoggedIn: boolean;
}

export default function SaveButton({ schoolId, schoolName, initialSaved, isLoggedIn }: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    if (!isLoggedIn) { router.push('/login'); return; }
    setLoading(true);
    await fetch('/api/favorites', {
      method: saved ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolId, schoolName }),
    });
    setSaved(s => !s);
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60
        ${saved
          ? 'bg-red-400 text-white border border-red-300'
          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
        }`}>
      {loading
        ? <Loader2 size={16} className="animate-spin" />
        : <Heart size={16} className={saved ? 'fill-white' : ''} />}
      {saved ? 'Salvo' : 'Salvar'}
    </button>
  );
}

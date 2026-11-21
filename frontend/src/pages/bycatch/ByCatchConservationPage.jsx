import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Database, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  BookOpen
} from 'lucide-react';
import { getConservationProfile } from '../../api/client';

export default function ByCatchConservationPage() {
  const [scientificName, setScientificName] = useState("Selaroides leptolepis");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const presetSpecies = [
    { label: "Selar Kuning", scientific: "Selaroides leptolepis" },
    { label: "Kembung Perempuan", scientific: "Rastrelliger brachysoma" },
    { label: "Kuniran", scientific: "Upeneus sulphureus" }
  ];

  const fetchProfile = async (species) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getConservationProfile(species);
      setProfile(data);
    } catch (err) {
      setError(err.message || "Gagal memuat profil konservasi.");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile("Selaroides leptolepis");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (scientificName.trim()) {
      fetchProfile(scientificName.trim());
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-[#0E6E7E] border border-teal-200 font-mono">
            Status Konservasi & Regulasi ETP
          </span>
          <span className="text-xs text-slate-500">Kepatuhan IUCN, CITES & KKP RI</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0B1220] tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-[#0E6E7E]" />
          <span>Status Konservasi & <span className="font-serif-italic font-normal">Regulasi Perlindungan.</span></span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Penyaringan status konservasi berbasis basis data resmi otoritatif untuk mendukung kepatuhan regulasi perikanan berkelanjutan.
        </p>
      </div>

      {/* Search & Presets Bar */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={scientificName}
              onChange={(e) => setScientificName(e.target.value)}
              placeholder="Masukkan nama ilmiah (misal: Selaroides leptolepis)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-xs text-[#0B1220] focus:outline-none focus:border-[#0E6E7E] font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#0E6E7E] hover:bg-[#0b5865] text-white rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            {loading ? "Memeriksa..." : "Periksa Status"}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
          <span className="text-slate-500 text-[11px] font-medium">Spesies Target MVP:</span>
          {presetSpecies.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setScientificName(s.scientific);
                fetchProfile(s.scientific);
              }}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] cursor-pointer transition-colors"
            >
              {s.label} ({s.scientific})
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Details */}
      {profile && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Taxonomy Header Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#0E6E7E] font-semibold">Taksonomi Tervalidasi</span>
                <h2 className="text-xl font-bold text-[#0B1220] italic mt-0.5">
                  {profile.scientific_name}
                </h2>
                <div className="text-xs text-slate-500 mt-1">
                  Famili: <strong className="text-slate-800">{profile.family}</strong> | Ordo: <strong className="text-slate-800">{profile.order}</strong>
                </div>
              </div>

              <div className="flex gap-2 text-xs font-mono">
                {profile.worms_aphia_id && (
                  <span className="bg-slate-50 px-3 py-1 rounded-full border border-slate-200 text-slate-700">
                    WoRMS ID: {profile.worms_aphia_id}
                  </span>
                )}
                {profile.fishbase_speccode && (
                  <span className="bg-slate-50 px-3 py-1 rounded-full border border-slate-200 text-slate-700">
                    FishBase: #{profile.fishbase_speccode}
                  </span>
                )}
              </div>
            </div>

            {/* 3 Conservation Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
              
              {/* 1. IUCN Red List */}
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">1. IUCN Red List</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white text-[#0E6E7E] font-mono border border-slate-200">v4</span>
                </div>
                <div className="text-lg font-bold text-emerald-700">
                  {profile.iucn?.iucn_status || "Not Evaluated"}
                </div>
                <div className="text-[11px] text-slate-500 space-y-0.5 pt-2 border-t border-slate-200">
                  <div>Tahun Asesmen: <span className="text-slate-700">{profile.iucn?.assessment_year || "-"}</span></div>
                  <div>Tren Populasi: <span className="text-slate-700">{profile.iucn?.population_trend || "-"}</span></div>
                  <div>Sumber: <span className="text-slate-700">{profile.iucn?.source || "IUCN Red List Snapshot"}</span></div>
                </div>
              </div>

              {/* 2. CITES Species+ */}
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">2. Appendiks CITES</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white text-[#0E6E7E] font-mono border border-slate-200">Species+</span>
                </div>
                <div className="text-lg font-bold text-slate-800 uppercase">
                  {profile.cites?.cites_appendix || "Not Listed"}
                </div>
                <div className="text-[11px] text-slate-500 space-y-0.5 pt-2 border-t border-slate-200">
                  <div>Verifikasi: <span className="text-emerald-700 font-medium">Snapshot Resmi Terverifikasi</span></div>
                  <div>Status Perdagangan: <span className="text-slate-700">{profile.cites?.cites_appendix === 'not_listed' ? 'Tidak Dibatasi Appendiks' : 'Dibatasi CITES'}</span></div>
                  <div>Basis Data: <span className="text-slate-700">{profile.cites?.source || "CITES Snapshot"}</span></div>
                </div>
              </div>

              {/* 3. Regulasi Nasional KKP */}
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">3. Regulasi KKP RI</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white text-[#0E6E7E] font-mono border border-slate-200">JDIH</span>
                </div>
                <div className="text-lg font-bold text-slate-800">
                  {profile.national_protection?.national_protection_status === 'not_listed_in_checked_regulations' 
                    ? "Tidak Dilindungi" 
                    : "Dilindungi Nasional"}
                </div>
                <div className="text-[11px] text-slate-500 space-y-0.5 pt-2 border-t border-slate-200">
                  <div>Status Hukum: <span className="text-slate-700">{profile.national_protection?.national_protection_status || "Non-Protected"}</span></div>
                  <div>Regulasi Diperiksa: <span className="text-slate-700">Kepmen KP No. 1/2021 & Permen KP 36/2023</span></div>
                  <div>Otoritas: <span className="text-slate-700">Kementerian Kelautan & Perikanan RI</span></div>
                </div>
              </div>

            </div>

            {/* Legal Disclaimer */}
            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2.5 leading-relaxed">
              <Info className="w-4 h-4 text-[#0E6E7E] shrink-0 mt-0.5" />
              <span>{profile.legal_disclaimer}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

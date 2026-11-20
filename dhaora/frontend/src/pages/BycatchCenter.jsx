import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Scale, 
  Fish, 
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { getBycatchSpecies, getBycatchGears, evaluateCatch, getBycatchMetrics } from '../api/client';

export default function BycatchCenter() {
  const [speciesList, setSpeciesList] = useState([]);
  const [gears, setGears] = useState([]);
  const [metrics, setMetrics] = useState(null);

  // Form state for Catch Audit
  const [selectedGear, setSelectedGear] = useState('Jaring Insang (Gillnet)');
  const [weights, setWeights] = useState({
    'kembung_perempuan': 60,
    'selar_kuning': 35,
    'kuniran': 15,
  });

  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [sp, g, m] = await Promise.all([
          getBycatchSpecies(),
          getBycatchGears(),
          getBycatchMetrics()
        ]);
        if (sp && sp.species) setSpeciesList(sp.species);
        if (g && g.gears) setGears(g.gears);
        if (m) setMetrics(m);
      } catch (err) {
        console.error('Error loading bycatch data:', err);
      }
    }
    loadData();
  }, []);

  const handleWeightChange = (key, val) => {
    setWeights((prev) => ({
      ...prev,
      [key]: parseFloat(val) || 0
    }));
  };

  const handleRunAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        vessel_name: "KM Nelayan Mandiri Karangantu (< 10 GT)",
        fishing_gear: selectedGear,
        species_breakdown: weights
      };
      const res = await evaluateCatch(payload);
      setAuditResult(res);
    } catch (err) {
      setError(err.message || 'Gagal mengevaluasi kepatuhan tangkapan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0d1629] via-[#101b33] to-[#0d1629] border border-[#1e293b] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Konservasi & Selektivitas
            </span>
            <span className="text-xs text-slate-400">Permen-KP 36/2023 & IUCN Red List</span>
          </div>
          <h2 className="text-xl font-bold text-white">ByCatch AI — Audit & Perlindungan Spesies</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Modul pengawas selektivitas alat tangkap armada skala kecil PPN Karangantu, pemisahan tangkapan utama vs sampingan (*bycatch*), serta skrining perlindungan taksonomi IUCN Red List & CITES.
          </p>
        </div>

        {/* Aggregate Stats */}
        {metrics && (
          <div className="bg-[#080d1a] border border-[#1e293b] rounded-xl p-3 text-xs min-w-[240px] space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Indeks Keberlanjutan:</span>
              <span className="text-emerald-400 font-bold">{metrics.sustainability_index}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Rerata Rasio Bycatch:</span>
              <span className="text-cyan-300 font-mono font-bold">{metrics.mean_bycatch_ratio_percent}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Trip Tahunan Termonitor:</span>
              <span className="text-slate-200 font-mono">{metrics.annual_artisanal_trips.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Audit Simulator (Left) + Regulations & Reference (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Audit Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="border-b border-[#1e293b] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Simulator Audit Trip Pendaratan Nelayan</h3>
                <p className="text-[11px] text-slate-400">Simulasi komposisi hasil tangkap per alat penangkapan ikan (API)</p>
              </div>
              <Scale className="w-5 h-5 text-amber-400" />
            </div>

            {/* Gear Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Pilih Alat Penangkapan Ikan (API):
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Jaring Insang (Gillnet)', desc: 'Target: Pelagis kecil (Kembung, Selar)' },
                  { name: 'Bagan Perahu (Lift Net)', desc: 'Target: Teri & pelagis kecil fototaksis' },
                  { name: 'Cantrang / Arad', desc: 'Target: Demersal dasar (Kuniran, Biji nangka)' },
                  { name: 'Pancing Ulur (Handline)', desc: 'Target: Pelagis besar & karang' },
                ].map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedGear(g.name)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      selectedGear === g.name
                        ? 'border-amber-500 bg-amber-950/40 text-amber-200 shadow-sm'
                        : 'border-[#1e293b] bg-[#0c1424] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-slate-200">{g.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Inputs */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Input Estimasi Berat Hasil Tangkapan (kg):
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-[#090f1d] border border-[#1e293b] p-3 rounded-xl">
                  <span className="text-[11px] text-cyan-300 font-semibold block mb-1">
                    Kembung perempuan (VU):
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={weights['kembung_perempuan']}
                    onChange={(e) => handleWeightChange('kembung_perempuan', e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Scombridae</span>
                </div>

                <div className="bg-[#090f1d] border border-[#1e293b] p-3 rounded-xl">
                  <span className="text-[11px] text-amber-300 font-semibold block mb-1">
                    Selar kuning (LC):
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={weights['selar_kuning']}
                    onChange={(e) => handleWeightChange('selar_kuning', e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Carangidae</span>
                </div>

                <div className="bg-[#090f1d] border border-[#1e293b] p-3 rounded-xl">
                  <span className="text-[11px] text-orange-300 font-semibold block mb-1">
                    Kuniran (LC):
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={weights['kuniran']}
                    onChange={(e) => handleWeightChange('kuniran', e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-orange-500"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Mullidae</span>
                </div>
              </div>
            </div>

            {/* Run Audit Button */}
            <button
              onClick={handleRunAudit}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>{loading ? 'Mengevaluasi Kepatuhan...' : 'Evaluasi Kepatuhan & Bycatch'}</span>
            </button>
          </div>

          {/* Audit Result Display */}
          {auditResult && (
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Hasil Audit Kepatuhan Regulasi</h4>
                  <p className="text-[11px] text-slate-400">ID: {auditResult.audit_id}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  auditResult.compliance_status === 'MEMENUHI_STANDAR'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {auditResult.compliance_status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Target vs ByCatch Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">
                    Tangkapan Target: <strong className="text-emerald-400">{auditResult.target_percentage}%</strong>
                  </span>
                  <span className="text-slate-300">
                    Bycatch: <strong className="text-amber-400">{auditResult.bycatch_percentage}%</strong>
                  </span>
                </div>
                <div className="w-full h-3 bg-[#1e293b] rounded-full overflow-hidden flex">
                  <div 
                    className="bg-emerald-500 h-full" 
                    style={{ width: `${auditResult.target_percentage}%` }} 
                  />
                  <div 
                    className="bg-amber-500 h-full" 
                    style={{ width: `${auditResult.bycatch_percentage}%` }} 
                  />
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-3.5 rounded-xl bg-[#090f1d] border border-[#1e293b] text-xs space-y-1.5">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-cyan-400" /> Rekomendasi Operasional:
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {auditResult.recommendation}
                </p>
              </div>

              {/* Alerts */}
              {auditResult.alerts && auditResult.alerts.length > 0 && (
                <div className="space-y-1">
                  {auditResult.alerts.map((al, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{al}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Species Conservation Registry & Legal Framework (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* IUCN Red List Species Reference */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Katalog Konservasi Spesies</h3>
                <p className="text-[11px] text-slate-400">Status IUCN Red List & Morfologi Diagnostik</p>
              </div>
              <Fish className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="space-y-3">
              {speciesList.map((sp, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#090f1d] border border-[#1e293b] text-xs space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-100">{sp.common_name}</div>
                      <div className="text-[11px] text-cyan-400 italic">{sp.scientific_name}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      sp.conservation_status_iucn.includes('VU')
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {sp.conservation_status_iucn}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Ciri Diagnostik:</strong> {sp.target_features}
                  </p>
                  <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-[#1e293b]/50">
                    <span>Famili: {sp.family}</span>
                    <span>Habitat: {sp.habitat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Framework Summary */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2 border-b border-[#1e293b] pb-3">
              <FileText className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Dasar Hukum Regulasi Perikanan</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#090f1d] border border-[#1e293b]">
                <div className="font-semibold text-slate-200">Permen-KP No. 36 Tahun 2023</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pengaturan jalur penangkapan ikan (Jalur IA, IB, II, III) dan spesifikasi alat tangkap yang diizinkan di Teluk Banten.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#090f1d] border border-[#1e293b]">
                <div className="font-semibold text-slate-200">Kepmen-KP No. 1/KEPMEN-KP/2021</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Penetapan daftar jenis biota laut yang dilindungi penuh dan terbatas di perairan Indonesia.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#090f1d] border border-[#1e293b]">
                <div className="font-semibold text-slate-200">Kepmen-KP No. 19/KEPMEN-KP/2022</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Estimasi potensi sumber daya ikan dan jumlah tangkapan yang diperbolehkan (JTB) di WPPNRI 712.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

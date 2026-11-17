import React, { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { evaluateCatchRole } from '../../api/client';

export default function ByCatchRoleTesterPage() {
  const [detectedSpecies, setDetectedSpecies] = useState("kuniran");
  const [targetSpecies, setTargetSpecies] = useState("selar_kuning");
  const [catchHandling, setCatchHandling] = useState("retained");
  const [gearInfo, setGearInfo] = useState("Jaring Insang / Gillnet");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleEvaluate = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const data = await evaluateCatchRole({
        detected_species_name: detectedSpecies,
        target_species: targetSpecies,
        catch_handling: catchHandling,
        gear_info: gearInfo
      });
      setResult(data);
    } catch (err) {
      setError(err.message || "Gagal mengevaluasi aturan peran tangkapan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-400" />
          <span>Mesin Aturan Peran Tangkapan FAO (Rule Engine Tester)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Pengujian terisolasi logika klasifikasi peran operasional perikanan: membedakan Target Catch, Incidental Bycatch, dan Discarded Catch tanpa inferensi citra.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleEvaluate} className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200">
              Parameter Evaluasi Operasional
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Nama Spesies yang Terdeteksi
              </label>
              <input
                type="text"
                value={detectedSpecies}
                onChange={(e) => setDetectedSpecies(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                placeholder="Contoh: kuniran, selar_kuning, kembung"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Spesies Target Trip
              </label>
              <input
                type="text"
                value={targetSpecies}
                onChange={(e) => setTargetSpecies(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                placeholder="Contoh: selar_kuning; kembung_perempuan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Penanganan Tangkapan di Kapal (Catch Handling)
              </label>
              <select
                value={catchHandling}
                onChange={(e) => setCatchHandling(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="retained">Disimpan di palka untuk jual/konsumsi (retained)</option>
                <option value="discarded">Dibuang kembali ke laut (discarded)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Alat Tangkap yang Digunakan
              </label>
              <input
                type="text"
                value={gearInfo}
                onChange={(e) => setGearInfo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
            >
              <span>Evaluasi Aturan FAO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Presets */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-2 text-xs text-slate-400">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Skenario Pengujian Cepat:</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setDetectedSpecies("selar_kuning");
                  setTargetSpecies("selar_kuning; kembung");
                  setCatchHandling("retained");
                }}
                className="text-left px-2.5 py-1.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800/80 cursor-pointer"
              >
                Skenario 1: Spesies Cocok Target (Rule 1 → Target)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDetectedSpecies("kuniran");
                  setTargetSpecies("selar_kuning");
                  setCatchHandling("retained");
                }}
                className="text-left px-2.5 py-1.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800/80 cursor-pointer"
              >
                Skenario 2: Non-Target Disimpan (Rule 2 → Incidental Retained)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDetectedSpecies("kuniran");
                  setTargetSpecies("selar_kuning");
                  setCatchHandling("discarded");
                }}
                className="text-left px-2.5 py-1.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800/80 cursor-pointer"
              >
                Skenario 3: Non-Target Dibuang (Rule 3 → Discarded Bycatch)
              </button>
            </div>
          </div>
        </div>

        {/* Output & FAO Architecture (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Output Card */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200">
              Hasil Evaluasi Aturan
            </h2>

            {result ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Peran Tangkapan (FAO Catch Role)</div>
                    <div className="text-xl font-extrabold text-white mt-0.5 capitalize">
                      {result.catch_role.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                    result.is_target 
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-amber-950 text-amber-400 border border-amber-800"
                  }`}>
                    {result.rule_id}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                  <div className="text-slate-400">Bukti / Alasan Keputusan (Evidence):</div>
                  <div className="text-slate-200 font-medium leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    {result.evidence}
                  </div>
                  <div className="flex gap-4 pt-2 font-mono text-[11px]">
                    <span className={result.is_target ? "text-emerald-400" : "text-slate-500"}>
                      is_target: {String(result.is_target)}
                    </span>
                    <span className={result.is_bycatch ? "text-amber-400" : "text-slate-500"}>
                      is_bycatch: {String(result.is_bycatch)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Klik "Evaluasi Aturan FAO" untuk melihat hasil inferensi aturan.
              </div>
            )}
          </div>

          {/* FAO Principles Reference */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3 text-xs text-slate-300">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Prinsip Ilmiah Klasifikasi ByCatch (FAO Technical Guidelines)</span>
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Sesuai pedoman FAO Fisheries and Aquaculture Technical Guidelines No. 1, <strong>suatu spesies tidak dapat diklasifikasikan sebagai 'tangkapan sampingan' secara intrinsik murni dari citra visualnya</strong>. Status bycatch selalu bergantung pada konteks operasional: apa yang menjadi sasaran trip nelayan, alat tangkap yang digunakan, serta perlakuan terhadap hasil tangkapan (apakah disimpan untuk dikonsumsi/dijual atau dibuang ke laut).
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

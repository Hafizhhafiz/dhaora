import React, { useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  BookOpen, 
  ExternalLink, 
  Layers, 
  Tag, 
  FileCode, 
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export default function DatasetPage() {
  const [activeTab, setActiveTab] = useState('species'); // 'species' | 'audit' | 'protocol'

  const publicDatasets = [
    {
      name: 'FishBase Curated Repository',
      url: 'https://fishbase.se/',
      speciesAvailability: 'Tersedia spesimen R. brachysoma, S. leptolepis, dan U. sulphureus.',
      annotation: 'Foto spesimen lateral ilmiah, metadata geolokasi & taksonomi.',
      suitability: 'Sangat cocok untuk citra referensi murni dan ekstraksi sprite komposit.',
      license: 'CC-BY / CC-BY-NC (Attribution)',
      status: 'Clean Reference Dataset'
    },
    {
      name: 'Fishes of Australia / CSIRO & NMNH',
      url: 'https://fishesofaustralia.net.au/',
      speciesAvailability: 'Voucher spesimen museum (USNM / CSIRO ANFC) untuk U. sulphureus dan S. leptolepis.',
      annotation: 'Foto spesimen resolusi tinggi lateral dengan background putih/hitam studio.',
      suitability: 'Standar emas validasi diagnostik taksonomi pasca-Uiblein et al. (2025).',
      license: 'CC BY / CC BY-NC-SA',
      status: 'Museum Voucher Benchmark'
    },
    {
      name: 'GBIF (Global Biodiversity)',
      url: 'https://www.gbif.org/',
      speciesAvailability: 'Observasi biodiversitas Indo-Pasifik dengan koordinat geospasial.',
      annotation: 'Metadata ilmiah terverifikasi, kurasi lisensi & cropping manual.',
      suitability: 'Pemeriksaan distribusi geografis bioregion Paparan Sunda / Teluk Banten.',
      license: 'CC0 / CC-BY / CC-BY-NC',
      status: 'Taxonomic Reference'
    },
    {
      name: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/',
      speciesAvailability: 'Tersedia foto pasar ikan dan spesimen bebas royalti.',
      annotation: 'Foto mentah (unannotated).',
      suitability: 'Cocok untuk referensi pelengkap dan latar belakang komposit.',
      license: 'Creative Commons / Public Domain',
      status: 'Complementary'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Database className="w-5 h-5 text-cyan-400" /> Dataset Pipeline & Taxonomic Benchmark
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Standar kurasi data, validasi taksonomi 3 spesies target MVP, dan protokol pencegahan data leakage untuk model FishGuard AI.
          </p>
        </div>
        <div className="text-xs px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-mono">
          YOLO Format: <code className="text-white">&lt;class_id&gt; &lt;x_c&gt; &lt;y_c&gt; &lt;w&gt; &lt;h&gt;</code>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('species')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'species'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Target Spesies (3 Kelas MVP)</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Audit Repositori Citra Publik</span>
        </button>

        <button
          onClick={() => setActiveTab('protocol')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'protocol'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Protokol Data & Integritas Ilmiah</span>
        </button>
      </div>

      {/* Tab 1: Target Species Taxonomy (3 locked classes) */}
      {activeTab === 'species' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
          {/* Class 0 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-800/40 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Target Spesies 01
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">
                Class ID: 0
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Kembung Perempuan (<em className="text-cyan-300">Rastrelliger brachysoma</em>)
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li><strong>Famili:</strong> Scombridae</li>
              <li><strong>Ciri Diagnostik:</strong> Tubuh lebih tebal & membulat (deep-bodied) dibanding <em>R. kanagurta</em>, moncong tumpul membulat.</li>
              <li><strong>Habitat Teluk Banten:</strong> Pelagis neritik pantai, komoditas utama pendaratan PPN Karangantu.</li>
              <li><strong>Status Data:</strong> 10 citra referensi bersih terkurasi untuk sintesis.</li>
            </ul>
          </div>

          {/* Class 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-800/40 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Target Spesies 02
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-semibold">
                Class ID: 1
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Ikan Selar Kuning (<em className="text-amber-300">Selaroides leptolepis</em>)
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li><strong>Famili:</strong> Carangidae</li>
              <li><strong>Ciri Diagnostik:</strong> Pita emas lebar membujur dari tepi atas mata ke pangkal ekor, bintik hitam operkulum jelas.</li>
              <li><strong>Habitat Teluk Banten:</strong> Demersal / pelagis perairan pantai berlumpur, target jaring insang & pukat kantong.</li>
              <li><strong>Status Data:</strong> 10 citra referensi bersih terkurasi untuk sintesis.</li>
            </ul>
          </div>

          {/* Class 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-orange-800/40 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Target Spesies 03
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950 border border-orange-800 text-orange-300 font-semibold">
                Class ID: 2
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Ikan Kuniran (<em className="text-orange-300">Upeneus sulphureus</em>)
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li><strong>Famili:</strong> Mullidae</li>
              <li><strong>Ciri Diagnostik:</strong> Sepasang sungut dagu putih, sirip ekor polos tanpa garis melintang gelap, 2 garis kuning longitudinal (Uiblein et al., 2025).</li>
              <li><strong>Habitat Teluk Banten:</strong> Demersal dasar lunak/berpasir, sering tertangkap jaring arad / cantrang Karangantu.</li>
              <li><strong>Status Data:</strong> 10 citra referensi bersih terkurasi untuk sintesis.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Public Dataset Audit Table */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" /> Hasil Audit Repositori Citra Publik
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Evaluasi kesesuaian domain tangkapan perikanan, lisensi akademik, dan integritas taksonomi sebelum digunakan dalam pipeline sintesis.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="border-b border-slate-800 text-slate-300 font-semibold bg-slate-950">
                <tr>
                  <th className="py-3 px-4">Dataset</th>
                  <th className="py-3 px-4">Ketersediaan Spesies</th>
                  <th className="py-3 px-4">Format Anotasi</th>
                  <th className="py-3 px-4">Lisensi</th>
                  <th className="py-3 px-4">Kesesuaian Domain</th>
                  <th className="py-3 px-4 text-right">Tautan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {publicDatasets.map((ds, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">{ds.name}</td>
                    <td className="py-3 px-4 text-slate-200">{ds.speciesAvailability}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] text-cyan-300 bg-slate-950 px-2 py-1 rounded border border-slate-700/80 block">
                        {ds.annotation}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{ds.license}</td>
                    <td className="py-3 px-4 text-slate-300">{ds.suitability}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <a 
                        href={ds.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-semibold"
                      >
                        Buka <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Best Practices to Prevent Data Leakage */}
      {activeTab === 'protocol' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Protokol Pemisahan Data & Pencegahan Data Leakage
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Aturan ketat integritas sains untuk mencegah overfitting dan evaluasi yang tidak realistis pada data uji.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-300">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-cyan-400 block text-sm">1. Group-Split by Specimen ID</span>
              <p className="text-slate-300 leading-relaxed">
                Foto dari satu individu spesimen yang sama dari berbagai sudut atau klaster koleksi dikunci dalam split yang sama (Train ATAU Val, bukan keduanya) untuk mencegah kebocoran informasi.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 block text-sm">2. Background Substrate Independence</span>
              <p className="text-slate-300 leading-relaxed">
                Pemisahan tekstur latar belakang (meja stainless, talenan kayu, keranjang biru, es batu) memastikan model mempelajari ciri morfologis ikan, bukan menghafal tekstur alas.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 block text-sm">3. Standar Anotasi & Evaluasi Terbuka</span>
              <p className="text-slate-300 leading-relaxed">
                Label koordinat dinormalisasi 0.0 - 1.0. Metrik performa mengacu pada standar resmi YOLO (mAP@50, mAP@50-95, dan Mean Absolute Error cacah individu).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

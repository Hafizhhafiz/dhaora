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
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0E6E7E] text-xs font-medium mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Dataset & Benchmark Taksonomi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1220] tracking-tight">
            Standar Kurasi & <span className="font-serif-italic font-normal">Taksonomi Terkunci.</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Standar kurasi data, validasi taksonomi 3 spesies target MVP, dan protokol pencegahan data leakage untuk model FishGuard AI.
          </p>
        </div>
        <div className="text-xs px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-mono">
          YOLO Format: <code className="text-[#0B1220] font-bold">&lt;class_id&gt; &lt;x_c&gt; &lt;y_c&gt; &lt;w&gt; &lt;h&gt;</code>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('species')}
          className={`pb-3 px-4 text-xs font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'species'
              ? 'border-[#0E6E7E] text-[#0E6E7E]'
              : 'border-transparent text-slate-500 hover:text-[#0B1220]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Target Spesies (3 Kelas MVP)</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-xs font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'border-[#0E6E7E] text-[#0E6E7E]'
              : 'border-transparent text-slate-500 hover:text-[#0B1220]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Audit Repositori Citra Publik</span>
        </button>

        <button
          onClick={() => setActiveTab('protocol')}
          className={`pb-3 px-4 text-xs font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'protocol'
              ? 'border-[#0E6E7E] text-[#0E6E7E]'
              : 'border-transparent text-slate-500 hover:text-[#0B1220]'
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
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0E6E7E] uppercase tracking-wider">
                Target Spesies 01
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[#0E6E7E] font-semibold">
                Class ID: 0
              </span>
            </div>
            <h3 className="text-base font-bold text-[#0B1220]">
              Kembung Perempuan (<em>Rastrelliger brachysoma</em>)
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li><strong>Famili:</strong> Scombridae</li>
              <li><strong>Ciri Diagnostik:</strong> Tubuh lebih tebal & membulat (deep-bodied) dibanding <em>R. kanagurta</em>, moncong tumpul membulat.</li>
              <li><strong>Habitat Teluk Banten:</strong> Pelagis neritik pantai, komoditas utama pendaratan PPN Karangantu.</li>
              <li><strong>Status Data:</strong> 10 citra referensi bersih terkurasi untuk sintesis.</li>
            </ul>
          </div>

          {/* Class 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Target Spesies 02
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
                Class ID: 1
              </span>
            </div>
            <h3 className="text-base font-bold text-[#0B1220]">
              Ikan Selar Kuning (<em>Selaroides leptolepis</em>)
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li><strong>Famili:</strong> Carangidae</li>
              <li><strong>Ciri Diagnostik:</strong> Pita emas lebar membujur dari tepi atas mata ke pangkal ekor, bintik hitam operkulum jelas.</li>
              <li><strong>Habitat Teluk Banten:</strong> Demersal / pelagis perairan pantai berlumpur, target jaring insang & pukat kantong.</li>
              <li><strong>Status Data:</strong> 10 citra referensi bersih terkurasi untuk sintesis.</li>
            </ul>
          </div>

          {/* Class 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                Target Spesies 03
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 font-semibold">
                Class ID: 2
              </span>
            </div>
            <h3 className="text-base font-bold text-[#0B1220]">
              Ikan Kuniran (<em>Upeneus sulphureus</em>)
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
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
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-[#0B1220] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0E6E7E]" /> Hasil Audit Repositori Citra Publik
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Evaluasi kesesuaian domain tangkapan perikanan, lisensi akademik, dan integritas taksonomi sebelum digunakan dalam pipeline sintesis.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="border-b border-slate-200 text-[#0B1220] font-semibold bg-slate-50">
                <tr>
                  <th className="py-3.5 px-4">Dataset</th>
                  <th className="py-3.5 px-4">Ketersediaan Spesies</th>
                  <th className="py-3.5 px-4">Format Anotasi</th>
                  <th className="py-3.5 px-4">Lisensi</th>
                  <th className="py-3.5 px-4">Kesesuaian Domain</th>
                  <th className="py-3.5 px-4 text-right">Tautan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {publicDatasets.map((ds, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-[#0B1220] whitespace-nowrap">{ds.name}</td>
                    <td className="py-3 px-4 text-slate-600">{ds.speciesAvailability}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 block">
                        {ds.annotation}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{ds.license}</td>
                    <td className="py-3 px-4 text-slate-600">{ds.suitability}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <a 
                        href={ds.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[#0E6E7E] hover:underline inline-flex items-center gap-1 font-medium"
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
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-[#0B1220] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> Protokol Pemisahan Data & Pencegahan Data Leakage
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Aturan ketat integritas sains untuk mencegah overfitting dan evaluasi yang tidak realistis pada data uji.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-600">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0B1220] block text-sm">1. Group-Split by Specimen ID</span>
              <p className="leading-relaxed">
                Foto dari satu individu spesimen yang sama dari berbagai sudut atau klaster koleksi dikunci dalam split yang sama (Train ATAU Val, bukan keduanya) untuk mencegah kebocoran informasi.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0B1220] block text-sm">2. Background Substrate Independence</span>
              <p className="leading-relaxed">
                Pemisahan tekstur latar belakang (meja stainless, talenan kayu, keranjang biru, es batu) memastikan model mempelajari ciri morfologis ikan, bukan menghafal tekstur alas.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0B1220] block text-sm">3. Standar Anotasi & Evaluasi Terbuka</span>
              <p className="leading-relaxed">
                Label koordinat dinormalisasi 0.0 - 1.0. Metrik performa mengacu pada standar resmi YOLO (mAP@50, mAP@50-95, dan Mean Absolute Error cacah individu).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 02_collection_inspection.js — CatchForecast AI (ASIK Vol. VI) — Teluk Banten — v0.3
// v0.3: AOI dari Imports `aoi` didukung; mask laut tidak di-clip; jumlah sel valid; QA diagnostik; probe OLCI.
// STATUS: hanya dicek sintaks (node --check). v0.3 BELUM dijalankan di GEE.
// ============================================================================
// BLOK BERSAMA — IDENTIK di ketiga skrip (01, 02, 03). Skrip dibuat mandiri
// (tanpa require) supaya aman dijalankan pemula. Kalau mengubah parameter,
// ubah di ketiga skrip dengan nilai yang sama.
// ============================================================================
var CFG = {
  // --- Wilayah studi: DARI PENGGUNA (bounding box). Belum melalui persetujuan AOI. ---
  aoiBox: [105.90, -6.15, 106.35, -5.85],   // [lonMin, latMin, lonMax, latMax], EPSG:4326
  // PPN Karangantu: 06°02' LS, 106°09' BT (DARI PENGGUNA) -> desimal: -(6+2/60), 106+9/60
  ppn: {name: 'PPN Karangantu', lon: 106.15, lat: -6.0333},

  // --- Dataset ---
  // SST: PENGGANTI MUR. MUR 'JPL/MURSST41/DAILY' TERBUKTI tidak ada di EE (run pengguna 2026-11-18).
  // JAXA GCOM-C L3 SST V3 (ID, band, skala dari katalog EE): DN -> °C = DN*0.0012 - 10;
  // DN valid 0..65531 (65532..65535 invalid); sel 4638.3 m. SST_QA_flag BELUM dipakai (keputusan Phase 5).
  // Catatan ATBD: kemungkinan bias negatif pada suhu tinggi & kontaminasi dekat daratan.
  sst:   {id: 'JAXA/GCOM-C/L3/OCEAN/SST/V3', band: 'SST_AVE',
          scale: 0.0012, offset: -10, validMaxDN: 65531,
          qaBand: 'SST_QA_flag',
          // Arti nilai SST_QA_flag BELUM dibaca dari spesifikasi L3. Biarkan null (tidak menyaring)
          // sampai histogram dari Skrip 02 dibandingkan dengan dokumentasi. Contoh bila sudah jelas: [0, 1].
          qaAllowed: null,
          nominalM: 4638, cellKm: 4.64},   // skala nyata dicetak Skrip 02
  // Chl-a: ID terverifikasi di katalog EE (band 'chlor_a', 4638.3 m, 1997-01-01..2026-09-30).
  // ID 'COPERNICUS/OCEAN_COLOR/GLOBAL/4KM/V6' + band 'CHL' dari pengguna TIDAK ditemukan.
  chl:   {id: 'COPERNICUS/MARINE/SATELLITE_OCEAN_COLOR/V6', band: 'chlor_a', nominalM: 4638},
  bathy: {id: 'NOAA/NGDC/ETOPO1', band: 'bedrock', nominalM: 1855},   // 1 arc-menit (katalog)
  gswId: 'JRC/GSW1_4/GlobalSurfaceWater',                            // 30 m, s.d. 2021

  // --- Waktu (filterDate: tanggal akhir TIDAK ikut) ---
  start: '2024-01-01',
  end:   '2026-11-18',
  // Bulan puncak pendaratan = Agustus (klaim pengguna dari data PIPP KKP 2026; tidak diverifikasi di sini)
  peak:  {month: 8, year: 2026},

  // --- Filter suhu valid tropis ---
  tempMinC: 25,
  tempMaxC: 34,

  // --- Mask laut (heuristik, HARUS dicek visual) ---
  mask: {
    occurrenceMin: 50,      // % waktu GSW mendeteksi air agar dianggap air
    openingRadiusM: 60,     // buka-tutup morfologi: memutus kanal sempit tambak
    minPatchPixels: 256,    // buang badan air terisolasi < 256 px 30 m (~0.23 km2)
    minWaterFraction: 0.5,  // sel SST/Chl/batimetri dipakai bila >=50% isinya air laut
    manualExclude: null     // opsional: FeatureCollection poligon tambak yang harus dibuang
  },

  // --- Ekspor (Skrip 03) ---
  exportFolder: 'CatchForecast_TelukBanten',
  exportScaleM: 1000,
  exportCrs: 'EPSG:4326'
};

// AOI: bila ada variabel Imports bernama `aoi` (Geometry/Feature/FeatureCollection), itu yang dipakai.
// Jika tidak, dipakai bbox CFG.aoiBox. Polygon HARUS dari sumber yang disetujui (lihat protokol AOI).
function normalizeAoi(x) {
  if (x instanceof ee.FeatureCollection) return x.geometry();
  if (x instanceof ee.Feature) return x.geometry();
  return x;   // dianggap ee.Geometry
}
var AOI_FROM_IMPORT = (typeof aoi !== 'undefined' && aoi !== null);
var AOI = AOI_FROM_IMPORT ? normalizeAoi(aoi) : ee.Geometry.Rectangle(CFG.aoiBox, 'EPSG:4326', false);
var PPN = ee.Geometry.Point([CFG.ppn.lon, CFG.ppn.lat]);

// Mask air laut 30 m dari JRC GSW. CATATAN: tambak = air di mata GSW, jadi tidak
// otomatis terbuang. Heuristik di bawah hanya membuang kanal sempit & badan air kecil.
function buildSea() {
  var gsw = ee.Image(CFG.gswId);
  var proj30 = gsw.select('occurrence').projection();
  var raw = gsw.select('occurrence').unmask(0).gte(CFG.mask.occurrenceMin)
               .reproject(proj30).rename('sea');
  var k = {radius: CFG.mask.openingRadiusM, units: 'meters', kernelType: 'circle'};
  var opened = raw.focalMin(k).focalMax(k);
  var big = opened.selfMask()
                  .connectedPixelCount(CFG.mask.minPatchPixels, true)
                  .gte(CFG.mask.minPatchPixels).unmask(0);
  var sea = opened.and(big);
  if (CFG.mask.manualExclude) {
    var ex = ee.Image(0).paint(ee.FeatureCollection(CFG.mask.manualExclude), 1);
    sea = sea.and(ex.not());
  }
  return {
    raw: raw.selfMask(),          // TIDAK di-clip: sel tepi AOI tetap punya fraksi air yang utuh
    sea: sea.rename('sea')
  };
}
var SEAOBJ = buildSea();
var SEA30 = SEAOBJ.sea;

// Fraksi air laut (0..1) per sel dataset kasar. proj = proyeksi dataset, cellM = ukuran sel (m).
function waterFraction(proj, cellM) {
  var ratio = Math.ceil(Math.pow(cellM / 30, 2) * 1.3);
  return SEA30.unmask(0).reproject(ee.Image(CFG.gswId).select('occurrence').projection())
              .reduceResolution({reducer: ee.Reducer.mean(), maxPixels: ratio})
              .reproject({crs: proj}).rename('frac');
}

// Cek kewajaran SST memakai KOMPOSIT bulan puncak (bukan satu citra yang bisa saja tertutup awan).
// (Nama 'probeUnit' dipertahankan; argumen callback tidak dipakai.)
function probeUnit(cb) {
  var s = ee.Date.fromYMD(CFG.peak.year, CFG.peak.month, 1);
  var all = ee.ImageCollection(CFG.sst.id).filterBounds(AOI);
  var col = all.filterDate(s, s.advance(1, 'month')).select([CFG.sst.band, CFG.sst.qaBand]);
  var proj = ee.Image(all.sort('system:time_start', false).first()).select(CFG.sst.band).projection();
  var toC = makeToC(false);
  var raw = col.map(function (i) {
    var b = ee.Image(i).select(CFG.sst.band);
    return b.updateMask(b.lte(CFG.sst.validMaxDN));
  }).median().reproject(proj);
  var conv = col.map(toC).median().reproject(proj);
  function mean(img) {
    return img.reduceRegion({reducer: ee.Reducer.mean(), geometry: AOI, maxPixels: 1e8}).get(CFG.sst.band);
  }
  ee.Dictionary({
    citraDiBulanPeriksa: col.size(),
    rataDN_valid: mean(raw),
    rataC_setelahKonversi: mean(conv)
  }).evaluate(function (r, err) {
    if (err) { print('❌ Gagal membaca SST (aset tidak ada / bulan tanpa citra / tanpa piksel valid): ' + err); return; }
    print('Cek SST (GCOM-C), komposit bulan ' + CFG.peak.year + '-' + CFG.peak.month + ':', r);
    if (r.rataC_setelahKonversi === null) {
      print('⚠️ Komposit bulan itu tidak punya piksel valid di AOI. Skrip lanjut; hasil bisa kosong.');
    } else if (r.rataC_setelahKonversi < CFG.tempMinC || r.rataC_setelahKonversi > CFG.tempMaxC) {
      print('⚠️ Rata-rata °C di luar rentang tropis ' + CFG.tempMinC + '-' + CFG.tempMaxC + ': cek skala/offset.');
    }
    cb(false);
  });
}

// DN GCOM-C -> °C. Buang DN invalid (>validMaxDN), (opsional) saring QA, lalu rentang suhu tropis.
function makeToC(_unused) {
  return function (img) {
    img = ee.Image(img);
    var dn = img.select(CFG.sst.band);
    var c = dn.updateMask(dn.lte(CFG.sst.validMaxDN)).multiply(CFG.sst.scale).add(CFG.sst.offset);
    if (CFG.sst.qaAllowed && CFG.sst.qaAllowed.length) {
      var q = img.select(CFG.sst.qaBand);
      var ok = ee.Image(0);
      CFG.sst.qaAllowed.forEach(function (v) { ok = ok.or(q.eq(v)); });
      c = c.updateMask(ok);
    }
    c = c.updateMask(c.gte(CFG.tempMinC).and(c.lte(CFG.tempMaxC)));
    return ee.Image(c.copyProperties(img, ['system:time_start']));
  };
}
// ================== AKHIR BLOK BERSAMA ==================

// ============================================================================
// SKRIP 02 — Inspeksi koleksi SST (GCOM-C V3) & Chl-a + grafik SST bulanan
// YANG DILIHAT SAAT "RUN": hasil muncul BERTAHAP di Console (async), grafik paling akhir.
// Jika muncul teks merah "asset not found" untuk SST: cek ID GCOM-C
// -> salin pesan lengkapnya ke Claude. Jangan lanjut ke Skrip 03 sebelum SST OK.
// Hitungan = JUMLAH CITRA, bukan jumlah piksel valid.
// ============================================================================
Map.centerObject(AOI, 10);
print('Skrip 02 dimulai. Periode ' + CFG.start + ' s.d. <' + CFG.end + ' (akhir tidak ikut).');

// Musim: konvensi umum Indonesia (tim perlu mengonfirmasi pembagian ini).
var SEASONS = {
  'Barat (Des-Feb)': [12, 1, 2],
  'Peralihan I (Mar-Mei)': [3, 4, 5],
  'Timur (Jun-Agu)': [6, 7, 8],
  'Peralihan II (Sep-Nov)': [9, 10, 11]
};
var YEARS = [2024, 2025, 2026];

function tagMY(col) {
  return col.map(function (img) {
    var d = ee.Date(img.get('system:time_start'));
    return img.set({m: d.get('month'), y: d.get('year')});
  });
}
function monthsFilter(arr) {
  return ee.Filter.or.apply(null, arr.map(function (m) { return ee.Filter.eq('m', m); }));
}

function inspect(label, d) {
  var col = ee.ImageCollection(d.id);
  var win = tagMY(col.filterDate(CFG.start, CFG.end).filterBounds(AOI));
  var oldest = ee.Image(col.sort('system:time_start').first());
  var newest = ee.Image(col.sort('system:time_start', false).first());
  var seasonCounts = {};
  Object.keys(SEASONS).forEach(function (k) { seasonCounts[k] = win.filter(monthsFilter(SEASONS[k])).size(); });
  var peakByYear = {};
  YEARS.forEach(function (y) {
    peakByYear['bulan' + CFG.peak.month + '_' + y] =
      win.filter(ee.Filter.and(ee.Filter.eq('m', CFG.peak.month), ee.Filter.eq('y', y))).size();
  });
  var proj = newest.select(0).projection();
  ee.Dictionary({
    id: d.id,
    totalDataset: col.size(),
    totalDalamPeriode: win.size(),
    tanggalPertama: ee.Date(oldest.get('system:time_start')).format('YYYY-MM-dd'),
    tanggalTerakhir: ee.Date(newest.get('system:time_start')).format('YYYY-MM-dd'),
    bandCitraTertua: oldest.bandNames(),
    bandCitraTerbaru: newest.bandNames(),
    bandWajibAda: newest.bandNames().contains(d.band),
    skalaNominal_m: proj.nominalScale(),
    crs: proj.crs(),
    perBulan_1_12: ee.List.sequence(1, 12).map(function (m) { return win.filter(ee.Filter.eq('m', m)).size(); }),
    perMusim: ee.Dictionary(seasonCounts),
    bulanPuncakPerTahun: ee.Dictionary(peakByYear)
  }).evaluate(function (r, err) {
    if (err) {
      print('❌ ' + label + ' GAGAL: ' + err +
            ' | Kemungkinan: ID aset salah/tidak ada, tidak punya akses, atau koleksi kosong.');
      return;
    }
    print('📦 ' + label, r);
    var flags = [];
    if (!r.bandWajibAda) flags.push('band wajib "' + d.band + '" TIDAK ada di citra terbaru');
    var dev = Math.abs(r.skalaNominal_m - d.nominalM) / d.nominalM;
    if (dev > 0.15) flags.push('skala nominal ' + r.skalaNominal_m.toFixed(0) + ' m menyimpang >15% dari ' + d.nominalM + ' m (klaim/katalog)');
    if (r.totalDalamPeriode === 0) flags.push('0 citra pada periode & AOI');
    YEARS.forEach(function (y) {
      if (r.bulanPuncakPerTahun['bulan' + CFG.peak.month + '_' + y] === 0)
        flags.push('0 citra bulan ' + CFG.peak.month + ' tahun ' + y + ' (mungkin di luar cakupan dataset)');
    });
    print((flags.length ? '⚠️ CHECK ' : '✅ OK ') + label + (flags.length ? ': ' + flags.join(' | ') : ''));
  });
}

inspect('SST (GCOM-C V3) — pengganti MUR', CFG.sst);
inspect('Chl-a (OC-CCI V6) — ID terverifikasi', CFG.chl);

// Probe cakupan Chl-a di teluk pada bulan puncak (sel 4.6 km vs bay kecil).
(function chlProbe() {
  var col = ee.ImageCollection(CFG.chl.id).filterBounds(AOI).select(CFG.chl.band);
  var s = ee.Date.fromYMD(CFG.peak.year, CFG.peak.month, 1);
  var sub = col.filterDate(s, s.advance(1, 'month'));
  var proj = ee.Image(col.sort('system:time_start', false).first()).select(0).projection();
  var med = sub.median().reproject(proj);
  var frac = waterFraction(proj, CFG.chl.nominalM);
  var cnt = ee.Reducer.count().unweighted();
  ee.Dictionary({
    citraDiBulanPuncak: sub.size(),
    selChlValidDiAOI: med.reduceRegion({reducer: cnt, geometry: AOI, maxPixels: 1e8}).get(CFG.chl.band),
    selMenyentuhAOI: ee.Image.constant(1).reproject(proj).reduceRegion({reducer: cnt, geometry: AOI, maxPixels: 1e8}).get('constant'),
    selDenganAirLaut_ge_ambang: frac.gte(CFG.mask.minWaterFraction).selfMask().reduceRegion({reducer: cnt, geometry: AOI, maxPixels: 1e8}).get('frac')
  }).evaluate(function (r, err) {
    print(err ? '❌ Probe Chl gagal: ' + err : '🟢 Probe Chl-a bulan puncak (berapa sel 4.6 km yang benar-benar terisi di teluk)', err ? '' : r);
  });
})();

// Probe Chl-a OLCI 300 m (kandidat lebih halus; ID dari katalog EE, belum pernah diuji di skrip ini).
(function olciProbe() {
  var id = 'COPERNICUS/MARINE/OC_GLO_BGC/PLANKTON_OLCI_300M';
  var col = ee.ImageCollection(id).filterBounds(AOI);
  var newest = ee.Image(col.sort('system:time_start', false).first());
  var oldest = ee.Image(col.sort('system:time_start').first());
  var bn = newest.bandNames();
  var band = ee.String(ee.Algorithms.If(bn.contains('CHL'), 'CHL', bn.get(0)));
  var one = newest.select([band]);
  var proj = one.projection();
  var cnt = ee.Reducer.count().unweighted();
  ee.Dictionary({
    id: id,
    totalCitra: col.size(),
    tanggalPertama: ee.Date(oldest.get('system:time_start')).format('YYYY-MM-dd'),
    tanggalTerakhir: ee.Date(newest.get('system:time_start')).format('YYYY-MM-dd'),
    bandCitraTerbaru: bn,
    bandDipakaiUntukProbe: band,
    skalaNominal_m: proj.nominalScale(),
    selValidCitraTerbaruDiAOI: one.reduceRegion({reducer: cnt, geometry: AOI, maxPixels: 1e9, tileScale: 4}).get(band),
    selMenyentuhAOI: ee.Image.constant(1).reproject(proj).reduceRegion({reducer: cnt, geometry: AOI, maxPixels: 1e9, tileScale: 4}).get('constant'),
    selAirDominan: waterFraction(proj, 618).gte(CFG.mask.minWaterFraction).selfMask()
                     .reduceRegion({reducer: cnt, geometry: AOI, maxPixels: 1e9, tileScale: 4}).get('frac')
  }).evaluate(function (r, err) {
    print(err ? '❌ Probe OLCI 300 m gagal (ID/akses/periode?): ' + err : '🟢 Probe Chl-a OLCI 300 m (bulanan; hanya citra terbaru)', err ? '' : r);
  });
})();

// Distribusi nilai SST_QA_flag di sel air-dominan, bulan puncak. Arti tiap nilai BELUM dibaca dari
// spesifikasi GCOM-C L3 -> ini hanya diagnostik; jangan menyaring sebelum dokumentasinya dibaca.
(function qaHist() {
  var s = ee.Date.fromYMD(CFG.peak.year, CFG.peak.month, 1);
  var sub = ee.ImageCollection(CFG.sst.id).filterBounds(AOI)
              .filterDate(s, s.advance(1, 'month')).select(CFG.sst.qaBand);
  var proj = ee.Image(sub.first()).projection();
  var cells = waterFraction(proj, CFG.sst.nominalM).gte(CFG.mask.minWaterFraction);
  var fc = sub.map(function (img) {
    var h = ee.Image(img).select(CFG.sst.qaBand).updateMask(cells).reduceRegion({
      reducer: ee.Reducer.frequencyHistogram(), geometry: AOI, scale: CFG.sst.nominalM, maxPixels: 1e8});
    return ee.Feature(null, h);
  });
  fc.aggregate_array(CFG.sst.qaBand).evaluate(function (list, err) {
    if (err) { print('❌ Histogram QA gagal: ' + err); return; }
    var tot = {};
    (list || []).forEach(function (d) {
      if (!d) return;
      Object.keys(d).forEach(function (k) { tot[k] = (tot[k] || 0) + d[k]; });
    });
    print('🔎 Histogram SST_QA_flag (nilai: jumlah sel-citra, bulan puncak). Arti nilai: BELUM dibaca dari spesifikasi.', tot);
  });
})();

// Grafik & tabel SST bulanan di sel air-dominan, LENGKAP dengan jumlah sel valid per bulan.
probeUnit(function () {
  var base = ee.ImageCollection(CFG.sst.id).filterDate(CFG.start, CFG.end).filterBounds(AOI)
               .select([CFG.sst.band, CFG.sst.qaBand]);
  var proj = ee.Image(base.first()).select(CFG.sst.band).projection();
  var cells = waterFraction(proj, CFG.sst.nominalM).gte(CFG.mask.minWaterFraction);
  var toC = makeToC(false);
  var cnt = ee.Reducer.count().unweighted();
  // citra tertopeng penuh: menjamin hasil mean() selalu punya band walau bulan tanpa citra
  var dummy = ee.ImageCollection([ee.Image.constant(0).updateMask(0).rename(CFG.sst.band)]);
  var s0 = new Date(CFG.start), e0 = new Date(CFG.end);
  var nMonths = (e0.getUTCFullYear() - s0.getUTCFullYear()) * 12 + (e0.getUTCMonth() - s0.getUTCMonth()) + 1;
  var fc = ee.FeatureCollection(ee.List.sequence(0, nMonths - 1).map(function (i) {
    var s = ee.Date(CFG.start).advance(i, 'month');
    var sub = base.filterDate(s, s.advance(1, 'month'));
    var m = ee.Image(sub.map(toC).merge(dummy).mean()).updateMask(cells).reproject(proj).rename('sst_c');
    return ee.Feature(null, {
      month: s.format('YYYY-MM'),
      n_images: sub.size(),
      n_valid_cells: m.reduceRegion({reducer: cnt, geometry: AOI, maxPixels: 1e8}).get('sst_c'),
      sst_mean_c: m.reduceRegion({reducer: ee.Reducer.mean(), geometry: AOI, maxPixels: 1e8}).get('sst_c')
    });
  }));
  print(ui.Chart.feature.byFeature(fc, 'month', ['sst_mean_c']).setChartType('LineChart').setOptions({
    title: 'Rata-rata SST bulanan, sel air-dominan di AOI (°C) — bulan terakhir parsial',
    vAxis: {title: '°C'}, hAxis: {title: 'Bulan', slantedText: true}, lineWidth: 2, pointSize: 4, legend: {position: 'none'}
  }));
  print(ui.Chart.feature.byFeature(fc, 'month', ['n_valid_cells']).setChartType('ColumnChart').setOptions({
    title: 'Jumlah sel 4,6 km yang valid per bulan (komposit rata-rata; makin sedikit = grafik SST makin tidak andal)',
    vAxis: {title: 'sel'}, hAxis: {title: 'Bulan', slantedText: true}, legend: {position: 'none'}
  }));
  fc.aggregate_array('n_valid_cells').evaluate(function (v, err) {
    if (err || !v) { print('❌ Ringkasan sel valid gagal: ' + err); return; }
    var x = v.filter(function (q) { return q !== null; }).sort(function (a, b) { return a - b; });
    print('Sel valid per bulan: min ' + x[0] + ', median ' + x[Math.floor(x.length / 2)] + ', maks ' + x[x.length - 1] +
          ' (dari ' + v.length + ' bulan; ' + (v.length - x.length) + ' bulan tanpa sel valid).');
  });
});

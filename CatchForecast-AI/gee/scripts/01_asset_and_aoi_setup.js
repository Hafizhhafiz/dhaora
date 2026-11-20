// 01_asset_and_aoi_setup.js — CatchForecast AI (ASIK Vol. VI) — Teluk Banten — v0.3
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
// SKRIP 01 — Setup AOI, titik PPN, mask air laut, diagnostik spasial
// YANG DILIHAT SAAT "RUN":
//  - Peta: kotak kuning (AOI pengguna), titik merah PPN, area biru = air laut
//    hasil mask, area merah = air yang DIBUANG (kanal/tambak kecil).
//  - Console: luas AOI, luas air laut, apakah titik PPN jatuh di piksel laut.
//  - Hasil muncul bertahap (async). Tunggu 10-60 detik.
// PERHATIAN: tambak besar yang terhubung ke laut BISA tetap lolos. Periksa visual
// (mode satelit) dan gambar poligon pengecualian bila perlu.
// ============================================================================
Map.setOptions('SATELLITE');
Map.centerObject(AOI, 10);

var outline = ee.Image().byte().paint({
  featureCollection: ee.FeatureCollection([ee.Feature(AOI)]), color: 1, width: 2});
var removed = SEAOBJ.raw.updateMask(SEA30.not().unmask(1)).selfMask().clip(AOI);
Map.addLayer(removed, {palette: ['#ff3030']}, 'Air yang DIBUANG (kanal/tambak kecil)', true, 0.7);
Map.addLayer(SEA30.selfMask().clip(AOI), {palette: ['#00bfff']}, 'Air laut (mask akhir)', true, 0.6);
Map.addLayer(outline, {palette: ['#ffff00']}, 'AOI aktif');
Map.addLayer(PPN, {color: 'red'}, CFG.ppn.name);

print('Skrip 01 dimulai. AOI aktif: ' + (AOI_FROM_IMPORT ? 'polygon dari Imports `aoi`' : 'bbox pengguna (CFG.aoiBox)') +
      ' — belum disetujui lewat protokol AOI. Hasil di bawah:');

var pxKm2 = ee.Image.pixelArea().divide(1e6);
function sumArea(img) {
  return pxKm2.updateMask(img).reduceRegion({reducer: ee.Reducer.sum(), geometry: AOI,
    scale: 30, maxPixels: 1e9, tileScale: 4}).get('area');
}
ee.Dictionary({
  aoiAreaKm2: AOI.area(1).divide(1e6),
  aoiBounds: AOI.bounds().coordinates().get(0),
  seaAreaKm2: sumArea(SEA30),
  rawWaterKm2: sumArea(SEAOBJ.raw),
  ppnPoint: PPN.coordinates(),
  ppnOnSeaMask: SEA30.unmask(0).reduceRegion({reducer: ee.Reducer.first(), geometry: PPN, scale: 30}).get('sea')
}).evaluate(function (r, err) {
  if (err) { print('❌ Error diagnostik: ' + err); return; }
  print('📐 Diagnostik spasial', r);
  var pct = (100 * r.seaAreaKm2 / r.aoiAreaKm2).toFixed(1);
  print('Air laut = ' + r.seaAreaKm2.toFixed(1) + ' km2 dari ' + r.aoiAreaKm2.toFixed(1) +
        ' km2 AOI (' + pct + '%). Sisanya daratan/dibuang.');
  if (r.ppnOnSeaMask === 0 || r.ppnOnSeaMask === null) {
    print('ℹ️ Titik PPN tidak berada di piksel laut (wajar: pelabuhan di pantai). ' +
          'Jangan memakai titik itu sebagai sampel SST; ambil sel laut terdekat.');
  }
  print('⚠️ Mask ini heuristik (GSW s.d. 2021). Cek visual: bila ada tambak masih biru, ' +
        'gambar poligon di Imports lalu set CFG.mask.manualExclude.');
});

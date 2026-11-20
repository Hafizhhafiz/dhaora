// 03_environmental_preview.js — CatchForecast AI (ASIK Vol. VI) — Teluk Banten — v0.3
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
// SKRIP 03 — Pratinjau lingkungan: SST Agustus (median), front termal, batimetri
//            + panel interaktif, legenda, inspektur klik, ekspor (DIJAGA/guarded)
// YANG DILIHAT SAAT "RUN":
//  1. Console mencetak deteksi satuan SST & statistik (bertahap/async).
//  2. Panel kiri + peta muncul setelah statistik selesai (10-60 detik).
//  3. Klik titik di peta: koordinat, SST, gradien, kedalaman, slope tampil di panel.
//  4. EKSPOR TIDAK jalan otomatis. Ubah DO_EXPORT di bawah jadi true, Run lagi,
//     lalu buka tab "Tasks" (kanan atas) dan klik RUN pada tiap tugas.
// KETERBATASAN (jujur): ETOPO1 = sel 1855 m; teluk dangkal & kecil -> hanya puluhan
// sel, dekat pantai kurang andal. Jangan dipakai memisahkan habitat pelagis vs
// demersal tanpa batimetri beresolusi lebih tinggi (BELUM dipilih/diverifikasi).
// Front termal dihitung dari SST GCOM-C 4.6 km: di teluk ±45x30 km itu hanya ±10x7 sel, jadi SANGAT kasar & hanya indikatif.
// ============================================================================
var DO_EXPORT = {sst: false, front: false, depth: false, slope: false, monthlyTable: false};
var CONTOUR_STEP_M = 5;   // lebar zona kedalaman (m)

Map.setOptions('SATELLITE');
Map.centerObject(AOI, 10);
print('Skrip 03 dimulai. Memeriksa SST bulan ' + CFG.peak.month + '/' + CFG.peak.year + '...');

probeUnit(function (isKelvin) {
  var toC = makeToC(isKelvin);
  var base = ee.ImageCollection(CFG.sst.id).filterBounds(AOI).select([CFG.sst.band, CFG.sst.qaBand]);
  var s = ee.Date.fromYMD(CFG.peak.year, CFG.peak.month, 1);
  var peakCol = base.filterDate(s, s.advance(1, 'month'));
  peakCol.size().evaluate(function (n, err) {
    if (err || !n) {
      print('❌ Tidak ada citra SST bulan puncak (' + CFG.peak.month + '/' + CFG.peak.year + '): ' + (err || '0 citra') +
            '. Ubah CFG.peak.year/month atau cek cakupan dataset di Skrip 02.');
      return;
    }
    print('Citra SST di bulan puncak: ' + n);
    build(base, peakCol, toC);
  });
});

function build(base, peakCol, toC) {
  // ---------- SST ----------
  var proj = ee.Image(base.first()).select(0).projection();
  var cells = waterFraction(proj, CFG.sst.nominalM).gte(CFG.mask.minWaterFraction);
  // reproject: agar kernel bekerja pada grid asli (komposit tanpa ini dihitung pada skala layar)
  var sstC = peakCol.map(toC).median().reproject(proj);
  var sst = sstC.updateMask(cells).rename('sst_c');

  // Jumlah sel yang benar-benar terisi (median bulan puncak).
  var cntR = ee.Reducer.count().unweighted();
  ee.Dictionary({
    selSstValidDiAOI: sst.reduceRegion({reducer: cntR, geometry: AOI, maxPixels: 1e8}).get('sst_c'),
    selAirDominanDiAOI: cells.selfMask().reduceRegion({reducer: cntR, geometry: AOI, maxPixels: 1e8}).get('frac')
  }).evaluate(function (r, err) {
    print(err ? '❌ Hitung sel gagal: ' + err : 'Jumlah sel SST 4,6 km (median ' + CFG.peak.month + '/' + CFG.peak.year + ')', err ? '' : r);
  });

  // ---------- Front termal: Sobel 3x3 -> gradien (°C/km) ----------
  var kx = ee.Kernel.fixed(3, 3, [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]);
  var ky = ee.Kernel.fixed(3, 3, [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]);
  var gx = sstC.convolve(kx), gy = sstC.convolve(ky);
  var nbrOk = sstC.mask().focalMin({radius: 1, units: 'pixels', kernelType: 'square'}); // buang tepi pantai/gap
  var front = gx.pow(2).add(gy.pow(2)).sqrt().divide(8 * CFG.sst.cellKm)
                .updateMask(nbrOk).updateMask(cells).rename('front_c_per_km');

  // ---------- Batimetri & slope (ETOPO1) ----------
  var etopo = ee.Image(CFG.bathy.id).select(CFG.bathy.band);
  var eProj = etopo.projection();
  var eCells = waterFraction(eProj, CFG.bathy.nominalM).gte(CFG.mask.minWaterFraction);
  var oceanNbr = etopo.lt(0).focalMin({radius: 1, units: 'pixels', kernelType: 'square'});
  var depth = etopo.multiply(-1).updateMask(etopo.lt(0)).updateMask(eCells).rename('depth_m');
  var slope = ee.Terrain.slope(etopo).updateMask(depth.mask()).updateMask(oceanNbr).rename('slope_deg');
  var zones = depth.divide(CONTOUR_STEP_M).ceil().multiply(CONTOUR_STEP_M).rename('zona_m');

  // ---------- Statistik untuk rentang visualisasi ----------
  var stack = ee.Image.cat([sst, front, depth]);
  stack.reduceRegion({
    reducer: ee.Reducer.percentile([2, 50, 90, 98]), geometry: AOI, scale: 1000,
    maxPixels: 1e8, bestEffort: true
  }).evaluate(function (st, err) {
    if (err || !st) { print('❌ Statistik gagal: ' + err); return; }
    print('Statistik (persentil, skala 1 km)', st);
    var v = function (k, d) { return (st[k] === null || st[k] === undefined) ? d : st[k]; };
    var sstMin = v('sst_c_p2', CFG.tempMinC), sstMax = v('sst_c_p98', CFG.tempMaxC);
    if (sstMax - sstMin < 0.2) { sstMin -= 0.5; sstMax += 0.5; }
    var frMax = v('front_c_per_km_p98', 0.1) || 0.1;
    var dMax = v('depth_m_p98', 20) || 20;
    present(sst, front, depth, slope, zones, {sst: [sstMin, sstMax], front: [0, frMax], depth: [0, dMax]},
            toC, cells, base);
  });
}

function present(sst, front, depth, slope, zones, rng, toC, cells, base) {
  var PAL = {
    sst: ['#2c7bb6', '#abd9e9', '#ffffbf', '#fdae61', '#d7191c'],
    front: ['#000004', '#51127c', '#b73779', '#fc8961', '#fcfdbf'],
    depth: ['#c6dbef', '#6baed6', '#2171b5', '#08306b']
  };
  var title = 'SST median ' + CFG.peak.month + '/' + CFG.peak.year + ' (°C)';
  var defs = [
    {name: title, img: sst, vis: {min: rng.sst[0], max: rng.sst[1], palette: PAL.sst}, leg: ['sst', 'SST (°C)']},
    {name: 'Front termal (°C/km)', img: front, vis: {min: rng.front[0], max: rng.front[1], palette: PAL.front}, leg: ['front', 'Gradien SST (°C/km)']},
    {name: 'Kedalaman ETOPO1 (m)', img: depth, vis: {min: rng.depth[0], max: rng.depth[1], palette: PAL.depth}, leg: ['depth', 'Kedalaman (m)']},
    {name: 'Zona kedalaman ' + CONTOUR_STEP_M + ' m', img: zones, vis: {min: CONTOUR_STEP_M, max: Math.max(rng.depth[1], CONTOUR_STEP_M * 2), palette: PAL.depth}, leg: ['depth', 'Zona kedalaman (m)']},
    {name: 'Slope dasar laut (°)', img: slope, vis: {min: 0, max: 1, palette: ['#ffffff', '#fdae61', '#d7191c']}, leg: null}
  ];

  var panel = ui.Panel({style: {width: '340px', padding: '8px'}});
  ui.root.insert(0, panel);
  panel.add(ui.Label('CatchForecast AI — Teluk Banten', {fontWeight: 'bold', fontSize: '16px'}));
  panel.add(ui.Label('Pratinjau lingkungan (bukan prediksi). AOI aktif: lihat Console Skrip 01 (bbox pengguna atau polygon Imports).', {fontSize: '11px', color: '#666'}));

  defs.forEach(function (d, i) {
    Map.layers().add(ui.Map.Layer({eeObject: d.img, visParams: d.vis, name: d.name, shown: i === 0}));
  });
  Map.addLayer(ee.Image().byte().paint({featureCollection: ee.FeatureCollection([ee.Feature(AOI)]), color: 1, width: 2}),
               {palette: ['#ffff00']}, 'AOI');
  Map.addLayer(PPN, {color: 'red'}, CFG.ppn.name);

  var legendBox = ui.Panel();
  function colorBar(key, text) {
    var lo = rng[key][0], hi = rng[key][1];
    var bar = ui.Thumbnail({
      image: ee.Image.pixelLonLat().select(0),
      params: {bbox: [0, 0, 1, 0.1], dimensions: '300x14', format: 'png', min: 0, max: 1, palette: PAL[key]},
      style: {stretch: 'horizontal', margin: '0 8px', maxHeight: '24px'}
    });
    return ui.Panel([
      ui.Label(text, {fontWeight: 'bold', margin: '6px 8px 0 8px'}), bar,
      ui.Panel([ui.Label(lo.toFixed(2), {margin: '0 8px'}),
                ui.Label(((lo + hi) / 2).toFixed(2), {margin: '0 8px', textAlign: 'center', stretch: 'horizontal'}),
                ui.Label(hi.toFixed(2), {margin: '0 8px'})], ui.Panel.Layout.flow('horizontal'))
    ]);
  }
  function showLayer(name) {
    defs.forEach(function (d, i) { Map.layers().get(i).setShown(d.name === name); });
    legendBox.clear();
    defs.forEach(function (d) {
      if (d.name === name) {
        legendBox.add(d.leg ? colorBar(d.leg[0], d.leg[1]) : ui.Label('Slope: 0–1° (rentang tetap; teluk dangkal).'));
      }
    });
  }
  var selector = ui.Select({
    items: defs.map(function (d) { return d.name; }), value: defs[0].name, onChange: showLayer,
    style: {stretch: 'horizontal'}
  });
  panel.add(ui.Label('Pilih layer:', {margin: '8px 0 0 0'}));
  panel.add(selector);
  panel.add(legendBox);
  showLayer(defs[0].name);

  // ---------- Inspektur klik ----------
  panel.add(ui.Label('Klik titik di peta:', {fontWeight: 'bold', margin: '12px 0 0 0'}));
  var out = ui.Label('(belum ada klik)');
  panel.add(out);
  var stackAll = ee.Image.cat([sst, front, depth, slope]);
  var marker = null;
  Map.style().set('cursor', 'crosshair');
  Map.onClick(function (c) {
    out.setValue('Mengambil nilai di (' + c.lon.toFixed(4) + ', ' + c.lat.toFixed(4) + ')...');
    var pt = ee.Geometry.Point([c.lon, c.lat]);
    if (marker) Map.layers().remove(marker);
    marker = ui.Map.Layer({eeObject: pt, visParams: {color: 'cyan'}, name: 'Titik klik'});
    Map.layers().add(marker);
    stackAll.reduceRegion({reducer: ee.Reducer.first(), geometry: pt, scale: 1000}).evaluate(function (r, err) {
      if (err) { out.setValue('❌ ' + err); return; }
      var f = function (x, u, n) { return (x === null || x === undefined) ? 'tidak ada data' : x.toFixed(n) + u; };
      out.setValue('Koordinat: ' + c.lon.toFixed(5) + ', ' + c.lat.toFixed(5) +
        '\nSST: ' + f(r.sst_c, ' °C', 2) +
        '\nGradien SST: ' + f(r.front_c_per_km, ' °C/km', 3) +
        '\nKedalaman (ETOPO1, kasar): ' + f(r.depth_m, ' m', 1) +
        '\nSlope: ' + f(r.slope_deg, ' °', 3) +
        '\n("tidak ada data" = daratan / di luar mask / di luar rentang suhu)');
    });
  });

  // ---------- EKSPOR (dijaga) ----------
  // Cara pakai: ubah flag DO_EXPORT di bagian atas jadi true -> Run -> tab Tasks -> RUN.
  // Catatan: SST asli 4.6 km di-resample ke 1000 m (tidak menambah informasi); ETOPO1 1855 m di-upsample ke 1000 m
  // (tidak menambah informasi). Pertimbangkan skala asli bila untuk analisis.
  function img2drive(img, name) {
    Export.image.toDrive({
      image: img.toFloat(), description: name, folder: CFG.exportFolder, fileNamePrefix: name,
      region: AOI, scale: CFG.exportScaleM, crs: CFG.exportCrs, maxPixels: 1e9, fileFormat: 'GeoTIFF'
    });
  }
  var tag = CFG.peak.year + '_' + (CFG.peak.month < 10 ? '0' : '') + CFG.peak.month;
  if (DO_EXPORT.sst)   img2drive(sst,   'SST_median_' + tag);
  if (DO_EXPORT.front) img2drive(front, 'ThermalFront_' + tag);
  if (DO_EXPORT.depth) img2drive(depth, 'Depth_ETOPO1');
  if (DO_EXPORT.slope) img2drive(slope, 'Slope_ETOPO1');
  if (DO_EXPORT.monthlyTable) {
    var s0 = new Date(CFG.start), e0 = new Date(CFG.end);
    var nMonths = (e0.getUTCFullYear() - s0.getUTCFullYear()) * 12 + (e0.getUTCMonth() - s0.getUTCMonth()) + 1;
    var fc = ee.FeatureCollection(ee.List.sequence(0, nMonths - 1).map(function (i) {
      var st = ee.Date(CFG.start).advance(i, 'month');
      var sub = base.filterDate(st, st.advance(1, 'month'));
      var m = sub.map(toC).mean().updateMask(cells).rename('sst_c');
      var mean = m.reduceRegion({reducer: ee.Reducer.mean(), geometry: AOI, scale: 1000, maxPixels: 1e8}).get('sst_c');
      return ee.Feature(null, {month: st.format('YYYY-MM'), n_images: sub.size(), sst_mean_c: mean});
    }));
    Export.table.toDrive({collection: fc, description: 'SST_monthly_TelukBanten', folder: CFG.exportFolder,
                          fileNamePrefix: 'SST_monthly_TelukBanten', fileFormat: 'CSV'});
  }
  if (DO_EXPORT.sst || DO_EXPORT.front || DO_EXPORT.depth || DO_EXPORT.slope || DO_EXPORT.monthlyTable) {
    print('📤 Tugas ekspor dibuat. Buka tab Tasks dan klik RUN. Folder Drive: ' + CFG.exportFolder);
  } else {
    print('ℹ️ Ekspor nonaktif (DO_EXPORT semua false).');
  }
  print('✅ Panel & layer siap. Klik peta untuk inspeksi.');
}

/**
 * DHAORA / ASIK VOL VI — Unified Number & Locale Formatting
 * Standardized on Indonesian locale (id-ID):
 * - Ribuan: titik (.)
 * - Desimal: koma (,)
 * Applies to UI presentation only; raw API data remains untouched.
 */

const ID_LOCALE = 'id-ID';

/**
 * Format a number with Indonesian grouping and optional fixed decimals.
 * @param {number|string|null|undefined} value 
 * @param {number} [decimals] 
 * @returns {string} e.g. "26.009,73" or "77.045"
 */
export function formatNumber(value, decimals = null) {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0';
  }
  const num = Number(value);
  const options = {};
  if (decimals !== null && decimals >= 0) {
    options.minimumFractionDigits = decimals;
    options.maximumFractionDigits = decimals;
  }
  return new Intl.NumberFormat(ID_LOCALE, options).format(num);
}

/**
 * Format percentage with Indonesian decimal comma.
 * @param {number|string} value e.g. 42.48 or 0.4248 (if isRatio=true)
 * @param {number} [decimals=2]
 * @param {boolean} [isRatio=false]
 * @returns {string} e.g. "42,48%"
 */
export function formatPercent(value, decimals = 2, isRatio = false) {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0%';
  }
  const num = isRatio ? Number(value) * 100 : Number(value);
  return `${formatNumber(num, decimals)}%`;
}

/**
 * Format precision metrics such as R² or confidence scores.
 * @param {number|string} value e.g. 0.9995
 * @param {number} [decimals=4]
 * @returns {string} e.g. "0,9995"
 */
export function formatPrecision(value, decimals = 4) {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0';
  }
  return formatNumber(value, decimals);
}

/**
 * Format weight in kilograms.
 * @param {number|string} kg 
 * @param {number} [decimals=1] 
 * @returns {string} e.g. "26.009,7 kg"
 */
export function formatWeight(kg, decimals = 1) {
  return `${formatNumber(kg, decimals)} kg`;
}

/**
 * Format spatial density in kg/km².
 * @param {number|string} val 
 * @param {number} [decimals=2] 
 * @returns {string} e.g. "32,59 kg/km²"
 */
export function formatDensity(val, decimals = 2) {
  return `${formatNumber(val, decimals)} kg/km²`;
}

/**
 * Format timestamp into user-friendly Indonesian date-time string.
 * @param {string|Date} dateStr 
 * @returns {string} e.g. "20 Nov 2026, 20.43 WIB"
 */
export function formatDateTimeId(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    const day = d.getDate();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}.${minutes} WIB`;
  } catch (e) {
    return String(dateStr);
  }
}

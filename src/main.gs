// Backend code

/**
 * Handler for HTTP GET
 *
 * @return {String}
 */
const doGet = () => {
  return HtmlService.createTemplateFromFile('page').evaluate();
};

/**
 * Save measure
 *
 * @param {Object} data Object to save
 * @throws InvalidMeasureError
 */
const saveMeasure = (data) => {
  Logger.log(data);

  if (isValidMeasure(data)) {
    storeMeasure(data);
  } else {
    throw new InvalidMeasureError('Invalid measure fields');
  }
};

/**
 * Check fields before saving
 *
 * @param {Object} data Object to test
 * @return {Boolean}
 */
const isValidMeasure = (data) => {
  // Minimal fields
  let fields = data && data.date
      && (data.ph || data.kh || data.gh || data.tds || data.temp || data.co2);
  if (!fields) {
    return false;
  }

  // Values
  if (!isDate(data.date)) {
    return false;
  }
  if (data.ph && !isBetween(data.ph, 0, 14)) {
    return false;
  }
  if (data.kh && !isBetween(data.kh, 0, 30)) {
    return false;
  }
  if (data.gh && !isBetween(data.gh, 0, 30)) {
    return false;
  }
  if (data.tds && !isBetween(data.tds, 0, 500)) {
    return false;
  }
  if (data.temp && !isBetween(data.temp, 0, 200)) {
    return false;
  }
  if (data.co2 && !isBetween(data.co2, 0, 100)) {
    return false;
  }
  // Passed!
  return true;
};

/**
 * Check value is number
 *
 * @param {Object} value Value to test
 * @return {Boolean}
 */
const isNumber = (value) => {
  return !isNaN(value);
};

/**
 * Check number is between min and max
 *
 * @param {Object} value Value to test
 * @param {Number} min Min boundary
 * @param {Number }max Max boundary
 * @return {Boolean}
 */
const isBetween = (value, min, max) => {
  return isNumber(value) && value >= min && value <= max;
};

/**
 * Check date 'yyyy-mm-dd'
 *
 * @param {Date} value Value to test
 * @return {Boolean}
 */
const isDate = (value) => {
  return isNumber(Date.parse(value));
};

/**
 * Store measure on Google Spreadsheet used by the Dashboard
 *
 * @param {Object} data Measure data
 */
const storeMeasure = (data) => {
  // Replace by valid spreadSheet URL
  let spreadSheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/CHANGE_IT/edit');
  let rowData = [
    formatDate(data.date, '/'),
    formatNumber(data.ph, ','),
    formatNumber(data.kh, ','),
    formatNumber(data.gh, ','),
    data.co2,
    data.tds,
    formatNumber(data.temp, ',')];

  spreadSheet.getSheets()[0].appendRow(rowData);
};

/**
 * Change date format as desired
 *
 * @param {Date} date Value
 * @param {String} separator Date separator
 * @return {String}
 */
const formatDate = (date, separator) => {
  return date.toString()
      .split('-')
      .reverse()
      .join(separator);
};

/**
 * Change number format as desired
 *
 * @param {Number} number Value
 * @param {String} decimal Decimal replacer
 * @return {String}
 */
const formatNumber = (number, decimal) => {
  return number.toString().replace('.', decimal);
};

/**
 * Invalid measure error
 *
 * @param {String} message Error message
 */
function InvalidMeasureError(message) {
  Logger.error(message);
  this.message = message;
}

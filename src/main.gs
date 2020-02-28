// Backend code

/**
 * Handler for HTTP GET
 */
function doGet() {
  return HtmlService.createTemplateFromFile('page').evaluate();
}

/**
 * Save measure
 */
function saveMeasure(data) {
  console.log(data);

  if(isValidMeasure(data))
    storeMeasure(data);
  else
    throw new InvalidMeasureError('Invalid measure fields');
}

/**
 * Check fields before saving
 */
function isValidMeasure(data) {
  // Minimal fields
  var fields = data && data.date && (data.ph || data.kh || data.gh || data.tds || data.temp || data.co2);
  if(!fields)
    return false;

  // Values
  if(!isDate(data.date))
    return false;
  if(data.ph && !isBetween(data.ph, 0, 14))
    return false;
  if(data.kh && !isBetween(data.kh, 0, 30))
    return false;
  if(data.gh && !isBetween(data.gh, 0, 30))
    return false;
  if(data.tds && !isBetween(data.tds, 0, 500))
    return false;
  if(data.temp && !isBetween(data.temp, 0, 200))
    return false;
  if(data.co2 && !isBetween(data.co2, 0, 100))
    return false;

  // Passed!
  return true;
}

/**
 * Check number is between min and max
 */
function isBetween(value, min, max) {
  return !isNaN(value) && value >= min && value <= max;
}

/**
 * Check date 'yyyy-mm-dd'
 */
function isDate(value) {
  return !isNaN(Date.parse(value));
}

/**
 * Store measure on Google Spreadsheet used by the Dashboard
 */
function storeMeasure(data) {
  // Replace by valid spreadSheet URL
  var spreadSheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/INVALID/edit');
  var rowData = [data.date, data.ph,  data.kh, data.gh, data.tds, data.temp, data.co2];

  spreadSheet.getSheets()[0].appendRow(rowData);
}

/**
 * Invalid measure error
 */
function InvalidMeasureError(message) {
  console.error(message);
  this.message = message;
}
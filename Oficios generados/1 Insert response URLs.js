/**
 * INSERT RESPONSE URLS
 * @update 2024-02-11 12:31:36
 * 
 * @function insertResponseUrls
 * 
 * Recupera la URL de las respuestas que se envían a un formulario
 * y las inserta en las filas correspondientes de una sheet.
 * Para que se ejecute automáticamente al recibir una respuesta,
 * es necesario crear un trigger
 * 
 * @param {string} form_id Id of the editable form (not the published one)
 * @param {string} sheet_name Name of the sheet where the URLs will be inserted
 * @param {number} headers_row Index (1 based) of the row which contains the headers (default is 1)
 * @param {string} timestamp_header Header of the column that contains the responses timestamp (default is "response_TIMESTAMP")
 * @param {string} url_header Header of the column where the URLs will be inserted (default is "response_URL")
 * 
*/

function insertResponseUrls(form_id, sheet_name = 'Response', headers_row = 1, timestamp_header = "response_TIMESTAMP", url_header = "response_URL") {

  let form = FormApp.openById(form_id);
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
  let headers = sheet.getRange(headers_row, 1, 1, sheet.getLastColumn()).getValues();

  let col_number_TIMESTAMP = headers[0].indexOf(timestamp_header) + 1; // headers[0] es un array
  let col_number_URL = headers[0].indexOf(url_header) + 1; // headers[0] es un array

  let row_number_START = headers_row + 1; // Se asume que los datos están a continuación de headers_row
  let row_number_LAST = sheet.getRange(row_number_START, col_number_TIMESTAMP).getDataRegion().getLastRow();

  let data = sheet.getRange(row_number_START, col_number_TIMESTAMP, row_number_LAST - 1).getValues();

  let responses = form.getResponses();
  let timestamps = [], urls = [], result_urls = [];

  for (let i = 0; i < responses.length; i++) {
    timestamps.push(responses[i].getTimestamp().setMilliseconds(0));
    urls.push(responses[i].getEditResponseUrl());
  }

  for (let j = 0; j < data.length; j++) {
    result_urls.push([data[j][0] ? urls[timestamps.indexOf(data[j][0].setMilliseconds(0))] : '']);
  }

  let resultsRange = sheet.getRange(row_number_START, col_number_URL, result_urls.length);
  resultsRange.setValues(result_urls);

  Logger.log('Se insertaron ' + result_urls.length + ' URLs recuperadas en el rango ' + resultsRange.getA1Notation());

}

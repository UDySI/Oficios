function insertResponseLinks() {

  let form_id = '1hXj4z4IeXHCzlxLXyGXYgqUilH9exVJ22dYMvcapJjc';
  let sheet_name = 'Response';
  let rangeFrom = "A1" // Dónde empieza el rango de datos
  let timestamp_column = 2; // Dónde están las timestamps
  let url_column = 3; // En qué columna de sheet se van a poner los links

  let form = FormApp.openById(form_id);
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);

  let lastRow = sheet.getRange(rangeFrom).getDataRegion().getLastRow();
  let data = sheet.getRange(2, timestamp_column, lastRow - 1).getValues();
  let responses = form.getResponses();
  let timestamps = [], urls = [], result_urls = [];

  for (let i = 0; i < responses.length; i++) {
    timestamps.push(responses[i].getTimestamp().setMilliseconds(0));
    urls.push(responses[i].getEditResponseUrl());
  }
  
  for (let j = 0; j < data.length; j++) {
    result_urls.push([data[j][0] ? urls[timestamps.indexOf(data[j][0].setMilliseconds(0))] : '']);
  }

  let resultsRange = sheet.getRange(2, url_column, result_urls.length);
  resultsRange.setValues(result_urls);

  Logger.log('Se insertaron ' + result_urls.length + ' URLs recuperadas en el rango ' + resultsRange.getA1Notation());

}

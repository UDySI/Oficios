function saveFileId(row_number, file_id) {

  /* Se pasó a After form submit

  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('File');
  let col_number = 2;

  // Si ya existía un borrador, eliminar el archivo
  let file_id_ANTERIOR = sheet.getRange(row_number, col_number).getValue();
  if (file_id_ANTERIOR != '') {
    let file_ANTERIOR = DriveApp.getFileById(file_id_ANTERIOR);
    file_ANTERIOR.setTrashed(true);
  }

  sheet.getRange(row_number, col_number).setValue(file_id);

  Logger.log('Se insertó la ID \'' + file_id + '\' (fila ' + row_number + ', columna ' + col_number + ')');
  */

}

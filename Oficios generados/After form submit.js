function afterFormSubmit(event) {

  // 2023-03-08 TEMPORAL (se supone que el sistema no permite que se regenere el oficio)
  // Para poder hacer pruebas en lo que se lanza el sistema,
  // esta función recupera los links para que esto sea posible
  insertResponseLinks();

  let row_number_UPDATED = event.range.getRow();

  // Generar borrador, establecer accesos y combinar información
  let borrador = generarBorrador(row_number_UPDATED);

  // Sheet que almacena la información de los archivos generados
  let sheet_FILES = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('File');
  let col_number_FILE_ID = 2; // Columna donde va la id del archivo

  // Si ya existía un borrador, eliminar el archivo
  let file_id_ANTERIOR = sheet_FILES.getRange(row_number_UPDATED, col_number_FILE_ID).getValue();
  if (file_id_ANTERIOR != '') {
    let file_ANTERIOR = DriveApp.getFileById(file_id_ANTERIOR);
    file_ANTERIOR.setTrashed(true);
  }

  // Insertar la información del archivo generado
  let fileInfo = [borrador.getId(), borrador.getName()];
  sheet_FILES.getRange(row_number_UPDATED, col_number_FILE_ID, 1, fileInfo.length).setValues([fileInfo]);
  Logger.log(sheet_FILES.getRange(row_number_UPDATED, col_number_FILE_ID, 1, fileInfo.length).getValues());

  // Enviar notificación
  enviarNotificacion(row_number_UPDATED);

}


function listUsersEmail(users) {
  let emails_array = [];
  for (let user in users) {
    let email = users[user].getEmail();
    emails_array.push(email);
  }
  return emails_array.join('\n');
}


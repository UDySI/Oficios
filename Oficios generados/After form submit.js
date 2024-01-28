function afterFormSubmit(event) {

  // Configuración
  let form_id = '1hXj4z4IeXHCzlxLXyGXYgqUilH9exVJ22dYMvcapJjc'; // ID de la vista de edición del formulario
  let sheet_name_RESPONSE = 'Response';  // Nombre de la sheet que recibe las respuestas al formulario
  let sheet_name_FILES = 'File';  // Nombre de la sheet que almacena la información de los archivos generados
  let row_number_HEADERS = 1;  // Índice de la fila de File que contiene los encabezados de la tabla
  let header_FILE_ID = 'file_ID'; // Header de la columna de File donde se inserta la id del archivo

  // La lista producida por insertResponseLinks es para uso exclusivo del administrador
  insertResponseLinks(form_id, sheet_name_RESPONSE);

  // La fila editada = consecutivo - 1
  let row_number_UPDATED = event.range.getRow();
  Logger.log('row_number_UPDATED: ' + row_number_UPDATED);

  // Generar borrador, establecer accesos e insertar valores en la plantilla
  let borrador = generarBorrador(row_number_UPDATED);

  // Obtener el número de la columna donde se insertan las ids
  let sheet_FILES = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name_FILES);
  let headers = sheet_FILES.getRange(row_number_HEADERS, 1, 1, sheet_FILES.getLastColumn()).getValues();
  let col_number_FILE_ID = headers[0].indexOf(header_FILE_ID) + 1; // headers[0] es un array

  // Si ya existía un borrador, eliminar el archivo
  let file_id_ANTERIOR = sheet_FILES.getRange(row_number_UPDATED, col_number_FILE_ID).getValue();
  if (file_id_ANTERIOR != '') {
    let file_ANTERIOR = DriveApp.getFileById(file_id_ANTERIOR);
    file_ANTERIOR.setTrashed(true);
    Logger.log('Se eliminó el borrador anterior \'' + file_ANTERIOR.getName() + '\' en ' + file_ANTERIOR.getUrl());
  }

  // Insertar la información del archivo generado
  let fileInfo = [borrador.getId(), borrador.getName()];
  sheet_FILES.getRange(row_number_UPDATED, col_number_FILE_ID, 1, fileInfo.length).setValues([fileInfo]);
  Logger.log(sheet_FILES.getRange(row_number_UPDATED, col_number_FILE_ID, 1, fileInfo.length).getValues());

  // Enviar notificación
  enviarNotificacion(row_number_UPDATED);
}

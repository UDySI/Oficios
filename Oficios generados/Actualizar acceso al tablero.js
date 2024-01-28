function updateAccess() {

  /***
   * Cuando se envía una respuesta al formulario 'Crear un oficio',
   * retira los permisos de acceso existentes al tablero Oficios
   * y los vuelve a agregar de acuerdo con la lista 'Accesos',
   * formada por los redactores y remitentes de los oficios actuales
  */

  let file_id_TABLERO = '1RNqhY8CRYJMM21EPaYm7N1ArxG3o0ht7Mbym4w5Wra8'; // tablero Oficios
  let sheet_name_ACCESOS = 'Accesos'; // Sheet de Oficios generados donde se almacenan los redactores y remitentes
  let header_EDITORS = 'Edit (remitentes y redactores)'; // Nombre de la columna que contiene los emails de remitentes y redactores

  // Acceder a las propiedades del tablero Oficios para recuperar sus editores
  let tablero = SpreadsheetApp.openById(file_id_TABLERO);
  let owner = tablero.getOwner().getEmail();

  let array_CURRENT_EDITORS = tablero.getEditors().sort();
  Logger.log('tablero Oficios tiene ' + array_CURRENT_EDITORS.length + ' editores: ' + array_CURRENT_EDITORS);

  // Eliminar los permisos de acceso existentes
  for (i = 0; i < array_CURRENT_EDITORS.length; i++) {
    let editor = array_CURRENT_EDITORS[i];
    if (editor == owner) {
      Logger.log('El propietario (' + owner + ' no puede ser removido por éste método');
    } else {
      tablero.removeEditor(editor); // El propietario no puede ser removido por este método
      Logger.log('Se eliminó a ' + editor + ' de editores');
    }
  }

  // Acceder a Oficios generados
  let current_spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet_ACCESS = current_spreadsheet.getSheetByName(sheet_name_ACCESOS);
  // Obtener el número de la columna donde empiezan los datos (se asume que headers está en la fila 1)
  let headers = sheet_ACCESS.getRange(1, 1, 1, sheet_ACCESS.getLastColumn()).getValues();
  let col_number_EDITORS = headers[0].indexOf(header_EDITORS) + 1; // headers[0] es un array

  let editors_NEW = sheet_ACCESS.getRange(2, col_number_EDITORS, sheet_ACCESS.getRange('A1').getDataRegion().getLastRow() - 1).getValues();

  Logger.log('Agregando ' + editors_NEW.length + ' editores')
  tablero.addEditors(editors_NEW);
  // If any of the users were already on the list of viewers, this method promotes them out of the list of viewers

  Logger.log('tablero Oficios tiene ' + tablero.getEditors().length + ' editores: ' + tablero.getEditors().sort());

};

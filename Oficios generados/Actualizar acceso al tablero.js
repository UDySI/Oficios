function updateAccess() {

  /*
    Cuando se envía una respuesta al formulario 'Crear un oficio',
    retira los permisos de acceso existentes al tablero Oficios
    y los vuelve a agregar de acuerdo con la lista 'Accesos',
    formada por los redactores y remitentes de los oficios actuales
  */

  file_id_TABLERO = '1RNqhY8CRYJMM21EPaYm7N1ArxG3o0ht7Mbym4w5Wra8'; // tablero Oficios

  let tablero = SpreadsheetApp.openById('1RNqhY8CRYJMM21EPaYm7N1ArxG3o0ht7Mbym4w5Wra8')
  let data_file = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log(tablero.getName() + '\n' + data_file.getName());

  let editors_REMOVE = tablero.getEditors().sort();
  Logger.log(editors_REMOVE);

  for (i = 0; i < editors_REMOVE.length; i++) {
    let editor = editors_REMOVE[i];
    tablero.removeEditor(editor); // El propietario no puede ser removido por este método
    Logger.log('Se eliminó a ' + editors_REMOVE[i] + ' de editors');
  }

  let access_data = data_file.getSheetByName("Accesos");
  let editors_ADD = access_data.getRange(2, 1, // La columna 1 contiene los emails de remitentes y redactores
    access_data.getRange("A1").getDataRegion().getLastRow() - 1).getValues();
  Logger.log(editors_ADD);

  tablero.addEditors(editors_ADD);
  // If any of the users were already on the list of viewers, this method promotes them out of the list of viewers

  Logger.log("Current editors: " + tablero.getEditors().sort());

};

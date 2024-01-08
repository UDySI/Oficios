function generarBorrador(row_number) {

  let sheet_name_BORRADOR = 'Generar borrador';
  let folder_id_BORRADORES = '1we2Er3k-ljjrVjogYiFwS10WoWSo0PJF';
  let file_id_TEMPLATE = '1D_4hmLNHUiJeHK4LgwnPZCBI5TYgWma6fVsyLjFsWnE';
  let correo_JEFATURA = 'erwinlimon@gmail.com'; // Se le enviará notificación

  // Recupera los nombres de los encabezados
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name_BORRADOR);
  let header_row = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
  let headers = header_row[0];
  Logger.log(headers);

  // Recupera los valores del consecutivo en cuestión
  let data = sheet.getRange(row_number, 1, 1, sheet.getLastColumn()).getValues();
  Logger.log(data);

  // Recupera el nombre del archivo que se va a crear
  // let file_NAME = data[0][headers.indexOf('file_NAME')];
  let consecutivo_string = data[0][headers.indexOf('consecutivo')].toString();
  let file_NAME = 'oficio ' + consecutivo_string.padStart(3, '0') + ' [BORRADOR]';
  Logger.log(file_NAME);
  let folder = DriveApp.getFolderById(folder_id_BORRADORES);
  let template = DriveApp.getFileById(file_id_TEMPLATE);
  let copy = template.makeCopy(file_NAME, folder);
  let borrador = DocumentApp.openById(copy.getId());

  Logger.log('Se creó el documento \'' + borrador.getName() + '\' en ' + borrador.getUrl());

  // Merge data
  let document_header = borrador.getHeader();
  document_header.replaceText('{{oficio_NUMERO}}', data[0][headers.indexOf('oficio_NUMERO')]);
  document_header.replaceText('{{oficio_ASUNTO}}', data[0][headers.indexOf('oficio_ASUNTO')]);

  let document_body = borrador.getBody();
  document_body.replaceText('{{oficio_CIUDAD}}', data[0][headers.indexOf('oficio_CIUDAD')]);
  document_body.replaceText('{{oficio_FECHA_LARGA}}', data[0][headers.indexOf('oficio_FECHA_LARGA')]);
  document_body.replaceText('{{oficio_DESTINATARIO}}', data[0][headers.indexOf('oficio_DESTINATARIO')]);
  document_body.replaceText('{{oficio_TEXTO}}', data[0][headers.indexOf('oficio_TEXTO')]);
  document_body.replaceText('{{oficio_CON_COPIA_PARA}}', data[0][headers.indexOf('oficio_CON_COPIA_PARA')]);
  document_body.replaceText('{{oficio_HAY_COPIA}}', data[0][headers.indexOf('oficio_HAY_COPIA')]);
  document_body.replaceText('{{remitente_NOMBRE_COMPLETO}}', data[0][headers.indexOf('remitente_NOMBRE_COMPLETO')]);
  document_body.replaceText('{{remitente_INICIALES}}', data[0][headers.indexOf('remitente_INICIALES')]);
  document_body.replaceText('{{remitente_ADSCRIPCION_PUESTO}}', data[0][headers.indexOf('remitente_ADSCRIPCION_PUESTO')]);
  document_body.replaceText('{{redactor_INICIALES}}', data[0][headers.indexOf('redactor_INICIALES')]);
  
  Logger.log(borrador.getHeader().getText() + '\n' + document_body.getText());

  // Insertar código QR
  // Inicialmente, la URI se calculaba en la tabla, pero qr_url regresaba vacía
  // (aparentemente, la fórmula no se calculaba a tiempo para que el script la leyera)
  let qr_URL = 'https://api.qrserver.com/v1/create-qr-code/?data=' + borrador.getUrl();
  let qr_URL_ENCODED = encodeURI(qr_URL);
  Logger.log('qr_URL_ENCODED: ' + qr_URL_ENCODED);
  let qr_FETCH = UrlFetchApp.fetch(qr_URL_ENCODED);
  // Attach the image to the first paragraph
  let qr_IMAGE = document_header.getChild(0).asParagraph().addPositionedImage(qr_FETCH);
  qr_IMAGE // Set image properties
    .setHeight(125) // In pixels. Approximately matches height of document's header
    .setWidth(125)
    .setLayout(DocumentApp.PositionedLayout.ABOVE_TEXT);

  // Crear accesos al documento

  // Jefe del Departamento
  borrador.addViewer(correo_JEFATURA); // Si es remitente o redactor, se promueve a editor
  Logger.log('Se agregó a la Jefatura del Departamento (\'' + correo_JEFATURA + '\') como lector');

  // Persona remitente
  let correo_REMITENTE = data[0][headers.indexOf('remitente_CORREO')];
  borrador.addEditor(correo_REMITENTE);
  Logger.log('Se agregó a ' + correo_REMITENTE + ' (remitente) como editor');

  // Persona redactora
  let correo_REDACTOR = data[0][headers.indexOf('redactor_CORREO')];
  if (correo_REDACTOR != '') {
    borrador.addEditor(correo_REDACTOR);
    Logger.log('Se agregó a ' + correo_REDACTOR + ' (redactor) como editor');
  }

  // Enlace administrativo
  let correo_ENLACE = data[0][headers.indexOf('enlace_CORREO')];
  if (correo_ENLACE != '') {
    borrador.addViewer(correo_ENLACE);
    Logger.log('Se agregó a ' + correo_ENLACE + ' (enlace administrativo) como comentarista');
  }

  list_EDITORS = borrador.getEditors();
  list_VIEWERS = borrador.getViewers();

  Logger.log('list_VIEWERS: ' + list_VIEWERS);
  Logger.log('list_EDITORS: ' + list_EDITORS);

  return borrador;
}

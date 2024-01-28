function enviarNotificacion(id_CONSECUTIVO) {

  let sheet_name_NOTIF = 'Enviar notificación';

  // Recupera los nombres de los encabezados
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name_NOTIF);
  let header_row = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
  let headers = header_row[0];
  // Logger.log('headers: ' + headers);

  let data = sheet.getRange(id_CONSECUTIVO, 1, 1, sheet.getLastColumn()).getValues();
  // Logger.log('data: ' + data);

  // Crear mensaje
  let emailTemp = HtmlService.createTemplateFromFile("Notificación");

  emailTemp.oficio_CONSECUTIVO = data[0][headers.indexOf('oficio_CONSECUTIVO')];
  emailTemp.oficio_NUMERO = data[0][headers.indexOf('oficio_NUMERO')];
  emailTemp.file_NAME = data[0][headers.indexOf('file_NAME')];
  emailTemp.oficio_SIGLAS = data[0][headers.indexOf('oficio_SIGLAS')];
  emailTemp.oficio_DESTINATARIO = data[0][headers.indexOf('oficio_DESTINATARIO')];
  emailTemp.oficio_ASUNTO = data[0][headers.indexOf('oficio_ASUNTO')];
  emailTemp.oficio_TEXTO = data[0][headers.indexOf('oficio_TEXTO')];
  emailTemp.oficio_CIUDAD = data[0][headers.indexOf('oficio_CIUDAD')];
  emailTemp.oficio_FECHA_LARGA = data[0][headers.indexOf('oficio_FECHA_LARGA')];
  emailTemp.oficio_CON_COPIA_PARA = data[0][headers.indexOf('oficio_CON_COPIA_PARA')];
  emailTemp.created_FECHA_LARGA = data[0][headers.indexOf('created_FECHA_LARGA')];
  emailTemp.link_BORRADOR = data[0][headers.indexOf('link_BORRADOR')];
  emailTemp.correo_REMITENTE = data[0][headers.indexOf('correo_REMITENTE')];
  emailTemp.correo_REDACTOR = data[0][headers.indexOf('correo_REDACTOR')];
  emailTemp.correo_ENLACE = data[0][headers.indexOf('correo_ENLACE')];
  emailTemp.rol_REDACTOR = data[0][headers.indexOf('rol_REDACTOR')];
  emailTemp.rol_JEFATURA = data[0][headers.indexOf('rol_JEFATURA')];
  emailTemp.rol_ENLACE = data[0][headers.indexOf('rol_ENLACE')];
  emailTemp.remitente_NOMBRE_USUAL = data[0][headers.indexOf('remitente_NOMBRE_USUAL')];
  emailTemp.remitente_NOMBRE_COMPLETO = data[0][headers.indexOf('remitente_NOMBRE_COMPLETO')];
  emailTemp.remitente_INICIALES = data[0][headers.indexOf('remitente_INICIALES')];
  emailTemp.remitente_ADSCRIPCION = data[0][headers.indexOf('remitente_ADSCRIPCION')];
  emailTemp.remitente_PUESTO = data[0][headers.indexOf('remitente_PUESTO')];
  emailTemp.notif_REDACTOR_INICIALES = data[0][headers.indexOf('notif_REDACTOR_INICIALES')];

  let HtmlNotification = emailTemp.evaluate().getContent();
  Logger.log('HtmlNotification: ' + HtmlNotification);

  // Datos para enviar el mensaje
  let email_SUBJECT = data[0][headers.indexOf('email_SUBJECT')];
  Logger.log('email_SUBJECT: ' + email_SUBJECT);
  let email_TO = data[0][headers.indexOf('email_TO')];
  Logger.log('email_TO: ' + email_TO);
  let email_CC = data[0][headers.indexOf('email_CC')];
  Logger.log('email_CC: ' + email_CC);

  /* Notificación de prueba (no se envía a los usuarios) */

  GmailApp.sendEmail( // recipient, subject, body, options
    'udysi.rafaelpi@gmail.com', // email_TO,
    email_SUBJECT,
    "Su cliente de correo no puede mostrar HTML. Por favor, abra este mensaje en un cliente de correo que pueda mostrar HTML.",
    {
      name: "UDySI: Oficios",
      htmlBody: HtmlNotification // , cc: email_CC
    }
  );

  Logger.log("Se envió notificación a " + email_TO + " con CC para " + email_CC);

}

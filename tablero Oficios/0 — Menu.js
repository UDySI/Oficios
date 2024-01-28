function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('UDySI')
    .addItem('Cambiar status a FINAL', 'promptFinal')
    .addItem('Cambiar status a CANCELADO', 'promptCancelado')
    .addItem('Verificar formato y contenido', 'contentProcessor')
    .addToUi();
}

function promptFinal() {
  cambiarStatus('FINAL');
}

function promptCancelado() {
  cambiarStatus('CANCELADO');
}



function cambiarStatus(status) {
  let success = true;

  const input = inputProcessor(status);
  if (input.is_ok == false) { return; };

  let consecutivo = input.value

  if (status == 'FINAL') {
    const content = contentProcessor(consecutivo);
    if (errors.lenght > -1) {
      success = false;
    };
  }

  fileProcessor(consecutivo, status);
  documentProcessor(consecutivo, status);

  Logger.log(success)

}



// let notificacion = emailProcessor(respaldo)
// let notificacion = emailProcessor(final);



function alert_FORMATO_NO_VALIDO(consecutivo, status = '') {
  let ui = SpreadsheetApp.getUi();
  let explain = '\n\nEl status del documento no será modificado ' + status;
  if (status == '') { explain = '' };
  ui.alert('🚧 El formato del documento no es válido',
    'No se encontraron los elementos requeridos.' + explain, ui.ButtonSet.OK);
}

function alert_CAMBIO_DE_STATUS_EXITOSO(mensaje) {
  // Mostrar una alerta al usuario donde se confirme que el status del oficio fue modificado
  let ui = SpreadsheetApp.getUi();
  ui.alert('Cambio de status exitoso', mensaje, ui.ButtonSet.OK);
}

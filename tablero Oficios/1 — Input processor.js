function inputProcessor(status = 'FINAL') {

  let response = showPrompt(status);
  if (response.is_ok == false) { return response; }

  let input = validateUserInput(response.value);
  if (input.is_ok == false) { return input; }

  // let confirmation = confirm(input.value, status)
  // if (confirmation.is_ok == false) { return confirmation; }

  // return confirmation.value;
  return input.value;
}


function showPrompt(status) {
  let ui = SpreadsheetApp.getUi();
  let prompt = ui.prompt(
    'Cambiar el status a ' + status,
    'Introduzca el número consecutivo del oficio.',
    ui.ButtonSet.OK_CANCEL);

  const response = {
    is_ok: false,
    value: prompt.getResponseText()
  };

  if (prompt.getSelectedButton() != ui.Button.OK) {
    toast_NoChanges('Se canceló o se cerró el diálogo.');
    return response;
  }
  if (response.value == '') {
    toast_NoChanges('No se recibió un input.');
    return response;
  }

  response.is_ok = true;
  return response;
}


function validateUserInput(responseText) { // 'responseText' es el input del usuario

  const input = {
    is_ok: false,
    value: responseText,
  }

  let parsed_response = parseInt(responseText);

  // 1 — Verifica si se introdujo algo que no sea un número
  if (isNaN(parsed_response)) { // El usuario introdujo texto
    alert_INPUT_NO_ES_VALIDO(responseText, 'Debe introducir el número consecutivo de un oficio.\nEjemplo: ' +
      'En el oficio \'DGCC/DBFLE/012/01/2023\', el consecutivo es 12.')
    return input;
  }

  // 2 — Verifica que el número sea mayor que 0
  let un_numero = parsed_response; // Procesa correctamente input con padding o espacios, como ' 012  '
  if (un_numero < 1) {
    alert_INPUT_NO_ES_VALIDO(responseText, 'La lista de números consecutivos empieza en 1.');
    return input;
  }

  // 3 — Verifica que el consecutivo exista
  let consecutivo = getFieldValue(un_numero, 'Status', 'consecutivo');
  if (consecutivo == '') {
    alert_INPUT_NO_ES_VALIDO(responseText, 'No existe un oficio con este número consecutivo (no ha sido creado).');
    return input;
  }

  // 4 — Verifica si el status permite que siga el procesamiento
  status = getFieldValue(consecutivo, 'Status', 'Status');
  switch (status) {
    case 'CANCELADO':
      alert_INPUT_NO_ES_VALIDO(responseText, 'El oficio con el número consecutivo ' + consecutivo +
        ' ya tiene el status CANCELADO. No es posible asignarle otro status.');
    case 'ERROR':
      alert_ERROR_DEL_SISTEMA();
    default:
      input.is_ok = true;
      input.value = consecutivo;
  }

  return input;
}


function confirm(consecutivo, status) {

  const confirmation = {
    is_ok: true,
    value: consecutivo
  }

  let aux = '';
  if (status == 'CANCELADO') { aux = '\n\nEste procedimiento no es reversible.'; }

  let ui = SpreadsheetApp.getUi();
  let button_CONFIRM = ui.alert(
    '¿Cambiar el status del oficio a ' + status + '?',
    'Introdujo el número consecutivo ' + consecutivo + '.' + aux,
    ui.ButtonSet.OK_CANCEL
  );

  if (button_CONFIRM != ui.Button.OK) {
    confirmation.is_ok = false;
    toast_NoChanges('No se confirmó el cambio de status.');
    return confirmation;
  }
  return confirmation;
}


function alert_INPUT_NO_ES_VALIDO(input, mensaje) {
  let ui = SpreadsheetApp.getUi();
  let alert = ui.alert('No es un número consecutivo válido', 'Introdujo \'' + input + '\'.\n\n' +
    mensaje + '\n\nCierre este diálogo para volver a intentarlo.', ui.ButtonSet.OK);
  if (alert) {
    toast_NoChanges('El input no era válido.');
  }
}

function alert_ERROR_DEL_SISTEMA() {
  let ui = SpreadsheetApp.getUi();
  let alert = ui.alert('Encontramos un error interno',
    'El sistema encontró una inconsistemcia en la información almacenada o en sus mecanismos internos.\n' +
    'El problema no está relacionado con los datos introducidos.\n\n' +
    'Por favor, avise a la Unidad de Información.', ui.ButtonSet.OK);
  if (alert) {
    toast_NoChanges('Hubo un error del sistema.');
  }
}



function toast_Success(message = '', title = 'Éxito', duration = 10) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  let default_text = '';
  if (message == '') {
    sheet.toast(default_text, '🟢 ' + title, duration);
  }
  sheet.toast(message + ' ' + default_text, '🟢 ' + title, duration)
};

function toast_NoChanges(message = '', title = '✌️ ' + 'No se hizo ningún cambio', duration = 8) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  let default_text = 'No se cambió el status de ningún oficio.';
  if (message == '') {
    sheet.toast(default_text, title, duration);
  }
  sheet.toast(message + ' ' + default_text, title, duration)
};


function toast_Wait(message = '', title = '🟡 ' + 'Procediendo…', duration = 8) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  let default_text = 'Espere unos segundos.';
  if (message == '') {
    sheet.toast(default_text, title, duration);
  }
  sheet.toast(message + ' ' + default_text, title, duration)
};

function test_finalPrompt() {
  let status = 'FINAL'; // Goes in the actual prompts

  let input = inputProcessor(status);
  if (input.is_ok == false) { return; }
}

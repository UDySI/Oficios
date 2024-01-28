function contentProcessor(consecutivo = 1) {
  // Por aquí no necesito que pase el contenido extraído, sino los issues
  // El contenido lo guarda el extractor y está disponible (después de haber sido verificado) en 'Contenido'

  const lines = getLines(consecutivo);

  const issues = extractContent(consecutivo, lines);
  // const sdf = informUser(issues);

  // const  = getIssues(consecutivo)
}


function extractContent(consecutivo = 1, lines) {
  /*
    Recupera el contenido del documento y lo guarda
    Las partes de esta función deben ser reutilizables de manera que sea posible llamarla
      en un procesoo que no implique un cambio de status
      no interactivamente
    ¿Debería devoler los elementos para avisarle al usuario qué se encontró y qué no,
      esa información puede obtenerse de las tablas?
      puede estar en otra función?
    es realmente necesario que esta revisión sea interactiva (y cómo sería?), o
    es suficiente con que se notifique al usuario que el status no se cambió (hay que hacerlo de todas formas)?
  const limits = defineSearches();
  */

  const elements = setBoundaries(lines);
  // Logger.log(elements);

  const positions = {};
  for (let element in elements) {
    positions[element] = elements[element].position;
    if (elements[element].position == -1) {
      Logger.log('No se encontró ' + element.toUpperCase());
    } else {
      Logger.log('Se encontró ' + element.toUpperCase());
    }
  }
  Logger.log('positions: ' + Object.keys(positions))

  const extracted = getElements(lines, positions);
  Logger.log('extracted: ' + Object.keys(extracted));
  Logger.log(extracted);

  const registro = saveDataObject(consecutivo, 'Extracted', extracted);
  Logger.log(registro);

  // const issues = [format, content, access];

  const errors = {}
  for (let element in elements) {
    if (elements[element].position == -1) {
      let message = 'No se encontrò el elemento requerido ' + element.toUpperCase()
      if (elements[element].required == false) {
        message = 'No se encontrò el elemento opcional ' + element.toUpperCase()
      }
      const formatError = {
        type: 'FORMATO',
        description: elements[element].description,
        ejemplo: elements[element].ejemplo,
        message: message
      }
      errors[element] = formatError
    }
  }
  Logger.log(errors)
}



function setBoundaries(lines) {
  const elements = defineSearches();

  let line_index = -1; // 0 indexed
  let last_found = -1;  // equal to 'not found'

  for (let element in elements) {
    let regex = elements[element].regex;
    elements[element].position = -1;

    // Logger.log('Buscando ' + element.toUpperCase() + ' | regex: ' + regex);

    while (line_index < lines.length) {
      line_index++;
      // Logger.log('line_index: ' + line_index + '  last_found: ' + last_found)
      if (regex.test(lines[line_index])) {
        elements[element].position = line_index;
        last_found = line_index; // Referencia por si no se encuentra el siguiente elemento
        // Logger.log('Se encontró ' + element.toUpperCase() + ' | line_index: ' + line_index + ' | contenido: ' + lines[line_index]);
        break; // Pasa al siguiente elemento
      }
    } // Ya busquè en todas las lìneas
    if (elements[element].position == -1) {
      // Logger.log(elements[element].position);
      // Logger.log('No se encontró ' + element.toUpperCase())
      line_index = last_found + 1;;
    } // Vamos al siguiente elemento
  } // Se llegó al final del documento

  return elements;
}


function getElements(lines, positions) {
  const extracted = {}; // Aquí vamos a poner los datos;
  function removeBlanks(line_INDEX) { return /^[^\s]+(\s+[^\s]+)*$/.test(line_INDEX) };

  let ranges = defineRanges(positions);

  for (let element in ranges) {
    // Logger.log(element + ' | ranges: from ' + ranges[element].from + ' to ' + ranges[element].to)
    if (ranges[element].from == -1 || ranges[element].to == -1) {
      let aux = 'No se encontraron los límites del elemento ' + element.toUpperCase();
      if (ranges[element].required != false) {
        extracted[element] = '[FORMATO: ' + aux + ']';
      } else {
        extracted[element] = '';
      }
    } else if (ranges[element].to == null) {
      aux = 'una línea';
      let position = ranges[element].from;
      extracted[element] = lines[position];
    } else {
      aux = 'multilínea';
      let array = lines.slice(ranges[element].from + 1, ranges[element].to).filter(removeBlanks);
      extracted[element] = array.join('\n');
    };
    // Logger.log('element: ' + element.toUpperCase() +
    //   ' | rango: ' + ranges[element].from + ' a ' + ranges[element].to + ' | ' + aux +
    //   ' | contenido:\n' + extracted[element]);
  }

  return extracted;
}



function defineSearches() {

  const watermark = {
    description: '<inicio de línea>La cadena \'No. de oficio:\' (el resto de la línea no es tomado en cuenta)',
    ejemplo: 'No. de oficio: DGCC/DBFLE/001/01/2023',
    regex: /^\s*BORRADOR[\S\s]*$/
  };

  const numero_de_oficio = {
    description: '<inicio de línea>La cadena \'No. de oficio:\' (el resto de la línea no es tomado en cuenta)',
    ejemplo: 'No. de oficio: DGCC/DBFLE/001/01/2023',
    regex: /^\s*No\. de oficio:\s+[\S\s]*$/
  };

  const asunto = {
    description: '<inicio de línea>La cadena \'Asunto:\' (el resto de la línea no es tomado en cuenta)',
    ejemplo: 'Asunto: Liberación de servicio social',
    regex: /^\s*Asunto:\s+([\S\s]*)$/
  };

  const lugar_fecha = {
    description: '<nombre de la ciudad>, Chih., <día a uno o dos dígitos> de <nombre del mes> de <año a cuatro dígitos>',
    ejemplo: 'Chihuahua, Chih., 24 de enero de 2023',
    regex: /^\s*([^,]+, [^,]+,\s+\d{1,2}\s+de\s+\w+\s+de\s+\d{4})\s*$/
  };

  const presente = {
    description: "Los caracteres 'P', 'R', 'E', 'S', 'E', 'N', 'T' y 'E', " +
      "en ese orden, en cualquier combinación de minúsculas y mayúsculas, " +
      "con espacios (' ') y puntuación (':', '.', '-') opcionales",
    ejemplo: 'Presente\nP R E S E N T E\nPresente.—',
    regex: /^\s*[pP]\s*[rR]\s*[eE]\s*[sS]\s*[eE]\s*[nN]\s*[tT]\s*[eE][-\s:.–—]*$/
  };

  const atentamente = {
    description: "Los caracteres 'A', 't', 'e', 'n', 't', 'a', 'm', 'e', 'n', 't' y 'e', " +
      "en ese orden, con espacios (' ') y puntuación (':', '.', '-') opcionales",
    ejemplo: 'Atentamente\nAtentamente,\nA t e n t a m e n t e —',
    regex: /^\s*A\s*t\s*e\s*n\s*t\s*a\s*m\s*e\s*n\s*t\s*e[- \t:.–—]*$/
  };

  const ccp = {
    description: 'La abreviatura \'C.c.p\' («con copia para») seguida por 0 o más espacios ' +
      '(la lista de personas que debe recibir copia física del oficio debe estar a continuación)',
    ejemplo: 'C.c.p.',
    regex: /C\.c\.p\.\s*/,
    required: false
  };

  const iniciales = {
    description: 'Entre 2 y cinco mayúsculas al inicio de la línea, ' +
      'seguidas por \'/\' y entre 0 y 5 minúsculas',
    ejemplo: 'EGLG/gtp\nEGLG/',
    regex: /^([A-Z]{2,5})\/([a-z]{0,5})$/
  };

  return { watermark, numero_de_oficio, asunto, lugar_fecha, presente, atentamente, ccp, iniciales };
}

function defineRanges(positions) {
  const watermark = {
    from: positions.watermark,
    to: null
  };
  const numero_de_oficio = {
    from: positions.numero_de_oficio,
    to: null
  };
  const asunto = {
    from: positions.asunto,
    to: null
  };
  const lugar_fecha = {
    from: positions.lugar_fecha,
    to: null
  };
  const destinatario = {
    from: positions.lugar_fecha,
    to: positions.presente
  };
  const texto = {
    from: positions.presente,
    to: positions.atentamente
  };
  const remitente = {
    from: positions.atentamente,
    to: get_end_remitente()
  };
  const con_copia_para = {
    from: positions.ccp,
    to: positions.iniciales,
    required: false
  };
  const iniciales = {
    from: positions.iniciales,
    to: null
  };

  function get_end_remitente() { if (positions.ccp == -1) { return positions.iniciales; } else { return positions.ccp; }; }

  return { watermark, numero_de_oficio, asunto, lugar_fecha, destinatario, texto, remitente, con_copia_para, iniciales };
}


function alert_OPCIONAL_NO_SE_ENCONTRO(element, mensaje = '') {
  let ui = SpreadsheetApp.getUi();
  let explain = '\n\n' + mensaje;
  if (mensaje == '') { explain = '' };
  ui.alert('⚠️ No se encontró un elemento opcional',
    'No se encontró el elemento opcional \'' + element.toUpperCase() + '\', o está en una posición incorrecta.' + explain + '\n\nSi el oficio debe incluir el elemento \'' + element.toUpperCase() + '\', revise el documento. En caso contrario, ignore este mensaje.', ui.ButtonSet.OK);
}

function alert_REQUERIDO_NO_SE_ENCONTRO(element, mensaje = '') {
  let ui = SpreadsheetApp.getUi();
  let explain = '\n\n' + mensaje;
  if (mensaje == '') { explain = '' };
  ui.alert('🛑 Error de formato',
    'No se encontró el elemento requerido \'' + element.toUpperCase() + '\'' + explain + '\n\nLa falta de este elemento podría ocasionar que el contenido se recuperara incorrectamente. Revise el documento.', ui.ButtonSet.OK);
  //
}

function alert_FORMATO_CORRECTO(consecutivo, status = '') {
  let ui = SpreadsheetApp.getUi();
  let explain = '\n\nA continuación, el status del documento cambiará a ' + status;
  if (status == '') { explain = '' };
  ui.alert('✅ El formato del documento es válido',
    'Se encontraron todos los elementos requeridos.' + explain, ui.ButtonSet.OK);
}

function getLines(consecutivo) {
  let file_id = getFieldValue(consecutivo, 'Status', 'file_id_MASTER');
  let file = DocumentApp.openById(file_id); // Recuperar el borrador
  let header_text = file.getHeader().getText().replaceAll(/[\r]/g, '\n'); // Recuperar header
  let body_text = file.getBody().getText().replaceAll(/[\r]/g, '\n'); // Recuperar body
  // El procesador funciona igual (bien) con cualquier tipo de salto, pero hay que cambiar todos los \r por \n
  //   por consistencia con las funciones subsecuentes que trabajan con arrays
  //   porque los \r llegan hasta la interfaz del usuario, y la tabla los despliega inicialmente como espacios
  let text = header_text + '\n' + body_text;
  let lines = text.split('\n'); // Crear un array
  return lines;
}


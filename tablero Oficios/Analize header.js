function launch_analizeHeader() {
  const content = {}; // Aquí vamos a poner los datos;
  let file = DocumentApp.openById('1pGtqPg5mAHWlTCjJEBd_8bp5698YVgTpINP3oCFH1aU');
  analizeHeader(file, content);
}

function analizeHeader(file) {
  let header_text = file.getHeader().getText();
  let lines = header_text.split("\n");
  Logger.log('HEADER tiene ' + (lines.length + 1) + ' líneas');
  // Logger.log(lines);

  /*
    HEADER

    HEADER se genera por completo: Sólo necesitamos el 'Asunto'

    - watermark es eliminada (y se lleva consigo el QR)
    - sigue la leyenda 'DEPARTAMENTO DE BIBLIOTECAS…'
    - número de oficio se regenera con la información de BODY
      (siglas / consecutivo / MM/YYYY)

  */


  // Establecemos la línea inicial
  let line = 0;

  /*
    WATERMARK

    BORRADOR — Versión preliminar para revisión

    Puede o no existir.
  */

  let lugar, fecha;

  // Debería ser lo primero que encontrara, pero se le da tolerancia
  // por si se insertaron líneas en blanco al inicio
  // (ignora las líneas vacías o sólo con 'white space characters')
  let regex_LINEA_EN_BLANCO = /^[\s]*$/;

  while (regex_LINEA_EN_BLANCO.test(lines[line])) {
    Logger.log("lines[" + line + "]: en blanco (" + lines[line] + ")");
    line++;
  };

  // Logger.log("lines[" + line + "]: primer línea con 'word characters' (" + lines[line] + ")");

  // La primer línea CON TEXTO debe tener el formato:
  // <texto>, <texto>, <uno o dos dígitos> de <caracteres alfabéticos> de <cuatro dígitos>
  let regex_LUGAR_FECHA = /([^,]+, [^,]+), (\d{1,2} de \w+ de \d{4})/;

  if (regex_LUGAR_FECHA.test(lines[line])) {
    let lugar_fecha = lines[line].match(regex_LUGAR_FECHA);
    Logger.log('lines[' + line + ']: se encontró LUGAR Y FECHA (' + lugar_fecha[0] + ')');
    content[lugar] = lugar_fecha[1];
    content[fecha] = lugar_fecha[2];
  }
  else {
    Logger.log('No se encontró una coincidencia con el patrón LUGAR Y FECHA "' + regex_LUGAR_FECHA + '"; revise el documento');
  };

  Logger.log("content[lugar]: '" + content[lugar] + "'");
  Logger.log("content[fecha]: '" + content[fecha] + "'");

  /*
    CÓDIGO QR

    Cualquier imagen en HEADER debe ser eliminada

  */

  /*
    const extracted = {
      watermark: lines.findIndex(function (line) { return line.includes('BORRADOR') }),
      departamento: lines.findIndex(function (line) { return line.includes('DEPARTAMENTO') }),
      numero_de_oficio: lines.findIndex(function (line) { return line.includes('No. de oficio:') }),
      asunto: lines.findIndex(function (line) { return line.includes('Asunto:') })
    };

    Logger.log('lines[' + extracted.watermark + '] — ' + lines[extracted.watermark]);
    Logger.log('lines[' + extracted.departamento + '] — ' + lines[extracted.departamento]);
    Logger.log('lines[' + extracted.numero_de_oficio + '] — ' + lines[extracted.numero_de_oficio]);
    Logger.log('lines[' + extracted.asunto + '] — ' + lines[extracted.asunto]);

    Logger.log(extracted);

    return extracted;
  */
}

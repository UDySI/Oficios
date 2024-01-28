function saveDataObject(consecutivo, table, data_object, spreadsheet_id) {
  let spreadsheet = '';
  if (spreadsheet_id == undefined) {
    spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  } else {
    spreadsheet = SpreadsheetApp.openById(spreadsheet_id);
  }
  let sheet = spreadsheet.getSheetByName(table);

  // Recupera los nombres de los encabezados. Column 1 es 'consecutivo'
  let row_number = consecutivo + 1;
  let last_table_column = sheet.getRange(1, 1).getDataRegion().getLastColumn(); // restamos la columna 'consecutivo'
  let last_column = last_table_column - 1;
  // Logger.log('last column: ' + last_table_column + ' (table) | ' + last_column + ' (range)')
  let header_row = sheet.getRange(1, 2, 1, last_column).getValues();
  let headers = header_row[0];
  let fields = Object.keys(data_object);
  // Logger.log('headers: ' + headers);
  // Logger.log('fields: ' + fields);

  let cells = [];
  for (let header in headers) {
    //Logger.log('Índice de ' + headers[header] + ' en fields: ' + fields.indexOf(headers[header]));
    if (fields.indexOf(headers[header]) == -1) {
      // Logger.log('El encabezado \'' + headers[header] + '\' no existe en fields');
      cells.push('');
      continue;
    }

    let key = headers[header];
    // Logger.log('El encabezado \'' + headers[header] + '\' existe en fields'
    //   + ', su valor es: ' + data_object[key]);
    // + ', su valor es: ' + data_object[key].replace('\r', '¶').replace('\n', '¶').substring(0, 25));
    cells.push(data_object[key]);
  }

  // Logger.log(cells);
  let data = [cells]

  let data_range = sheet.getRange(row_number, 2, 1, last_column); // column 1 es 'consecutivo'
  data_range.setValues(data);
  
  return data_range.getValues()[0];

}


function getDataObject(consecutivo = 1, table = 'Status', fields = ['file_id_BORRADOR', 'file_id_FINAL', 'file_id_CANCELADO']) {

  // Recupera los nombres de los encabezados. Column 1 es 'consecutivo'
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(table);
  let last_table_column = sheet.getRange(1, 1).getDataRegion().getLastColumn(); // restamos la columna 'consecutivo'
  let last_column = last_table_column - 1;
  let header_row = sheet.getRange(1, 2, 1, last_column).getValues();
  let headers = header_row[0];
  const data_object = {};

  for (let field in fields) {
    let value = fields[field];
    // Logger.log('Índice de ' + fields[field] + ' en headers: ' + headers.indexOf(fields[field]));
    if (headers.indexOf(fields[field]) == -1) {
      continue;
    }

    let row_number = consecutivo + 1;
    let column_number = headers.indexOf(fields[field]) + 2; // headers es un array (0 indexed); además sumamos columna 'consecutivo'
    data_object[value] = sheet.getRange(row_number, column_number).getValue();
  }

  return data_object;

}



function getFieldValue(consecutivo, table, field) {
  let row_number = consecutivo + 1
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(table);
  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; // column 1 es 'consecutivo'

  if (headers.indexOf(field) == -1) {
    // Logger.log('No se encontró \'' + field + '\' en \n' + headers);
    return null;
  };
  let col_number = headers.indexOf(field) + 1; // headers es un array (0 indexed)
  let value = sheet.getRange(row_number, col_number).getValue();
  // Logger.log('row_number: ' + row_number + ' | col_number: ' + col_number + ' | value: ' + value);
  return value;
}

function saveFieldValue(consecutivo, table, field,value) {
  let row_number = consecutivo + 1
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(table);
  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; // column 1 es 'consecutivo'

  if (headers.indexOf(field) == -1) {
    // Logger.log('No se encontró \'' + field + '\' en \n' + headers);
    return null;
  };
  let col_number = headers.indexOf(field) + 1; // headers es un array (0 indexed)
  sheet.getRange(row_number, col_number).setValue(value);
  Logger.log('\'' + value + '\' was saved in table ' + table + ' at row_number ' + row_number + ', col_number ' + col_number);
  return value;
}

// NOT USED?
function updateStatusTable(consecutivo, status, data) {
  //  Actualiza la tabla correspondiente cuando se crea o se elimina un archivo
  //    Oficios contiene los datos de los borradores
  //    tablero Oficios contiene los datos de finales y cancelados; es la spreadsheet 'activa'

  col_number = 2; // La columna 2 contiene la id en todas las tablas

  switch (status) {
    case 'BORRADOR':
      spreadsheet = SpreadsheetApp.openById('1ycq6gmDmOu5twG5duSDi7-YE0xmVvBsVbPbEWnvVQsU');
      sheet = spreadsheet.getSheetByName('File');
      break;

    default:
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(status);
      break;

  }

  let data_range = sheet.getRange(parseInt(consecutivo) + 1, col_number, 1, data.length);
  data_range.setValues([data]);

}


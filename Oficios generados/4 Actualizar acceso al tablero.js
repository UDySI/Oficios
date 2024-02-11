/***
 * UPDATE ACCESS TO RESOURCE
 * 2024-02-09 12:35:39
 * 
 * El acceso a ciertos recursos es exclusivo para quienes tienen datos almacenados en él
 * Esta herramienta recupera los permisos de acceso a un recurso,
 * los retira en silencio y los reasigna a las direcciones que encuentra en un lugar predefinido
 * Si los parámetros resource_id o accessors_spreadsheet_id son '' o undefined, se asume que se trata de la spreasheet activa
 * Puede dispararse por un trigger, por ejemplo, cuando se envía una respuesta a un formulario
 * Si se usan las dos funciones, hay que asegurarse de correr EDIT despuès de VIEW,
 * porque como editors tambièn son viewers, VIEW se los lleva, pero sòlo puede regresar a los viewers reales
 * 
 * @params {string} resource_id - Google Id del recurso de acceso exclusivo (una spreadsheet)
 * @params {string} access_type - Tipo de acceso al archivo, VIEW o EDIT
 * @params {string} accessors_sheet_name - Nombre de la sheet que contiene la información de accesos
 * @params {string} accessors_header - Encabezado de la columna que contiene las direcciones de correo de los accessors
 * @params {string} accessors_spreadsheet_id - Google Id de la spreadsheet que contiene la sheet que contiene la información de accesos
 * 
 */


function updateAccessToResource(resource_id, access_type, accessors_sheet_name, accessors_header, accessors_spreadsheet_id) {

  /** Accede al recurso */

  let resource = {};

  if (resource_id == undefined || resource_id == '') {
    resource = SpreadsheetApp.getActiveSpreadsheet();
  } else {
    resource = SpreadsheetApp.openById(resource_id);
  };

  /** Accede a las propiedades del recurso para recuperar sus lectores o editores */

  let resource_name = resource.getName();
  let resource_owner = resource.getOwner().getEmail();

  let accessors = [];
  if (access_type == 'VIEW') {
    accessors = resource.getViewers().sort();
  } else {
    accessors = resource.getEditors().sort();
  };

  Logger.log('Hay ' + accessors.length + ' persona(s) con acceso ' + access_type + ' al recurso \'' + resource_name + ':\n' + accessors);


  /** Elimina los permisos de acceso existentes */

  for (i = 0; i < accessors.length; i++) {
    let accessor = accessors[i];
    if (accessor == resource_owner) {
      Logger.log('Eliminando…\nEl propietario (' + resource_owner + ') no puede ser removido por éste método.');
    } else {
      switch (access_type) {
        case 'EDIT':
          resource.removeEditor(accessor);
          break
        default:
          resource.removeViewer(accessor);
          Logger.log('Se eliminó a ' + accessor + ' de accessores');
      }
    }
  }


  /** Obtiene los datos de acceso */

  let accessors_spreadsheet = {};
  if (accessors_spreadsheet_id == undefined || accessors_spreadsheet_id == '') {
    accessors_spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  } else {
    accessors_spreadsheet = SpreadsheetApp.openById(accessors_spreadsheet_id);
  };

  let accessors_sheet = accessors_spreadsheet.getSheetByName(accessors_sheet_name);
  let headers_row = 1; // Se asume que headers está en la fila 1
  let headers = accessors_sheet.getRange(headers_row, 1, 1, accessors_sheet.getLastColumn()).getValues();

  let range = accessors_sheet.getRange(
    headers_row + 1,
    headers[0].indexOf(accessors_header) + 1, // headers[0] es un array,
    accessors_sheet.getMaxRows()
  ).getValues();

  let new_accessors = [];

  for (let i = 0; i <= range.length; i++) {
    if (range[i][0] != '') {
      new_accessors.push(range[i][0] + '')
    } else {
      break;
    }
  }

  /** Agrega nuevos accesos */
  
  Logger.log('Se encontraron ' + new_accessors.length + ' correo(s) que deben tener acceso ' + access_type +
    ' al recurso \'' + resource_name + '\' en \'' + accessors_spreadsheet.getName() + '\'\n' +
    new_accessors +
    '\nAgregando…');

  switch (access_type) {
    case 'EDIT':
      resource.addEditors(new_accessors); // If the user was already on the list of viewers, this method promotes the user out of the list of viewers.
      break
    default:
      resource.addViewers(new_accessors); // If the user was already on the list of editors, this method has no effect.
  }
  Logger.log('Persona(s) con acceso EDIT al recurso \'' + resource_name + '\' ' +
    '(' + resource.getEditors().length + '):\n' + resource.getEditors().sort());
  Logger.log('Persona(s) con acceso VIEW al recurso \'' + resource_name + '\' ' +
    '(' + resource.getViewers().length + '):\n' + resource.getViewers().sort());

}

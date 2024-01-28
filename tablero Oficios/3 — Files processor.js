function fileProcessor(consecutivo, status) {
  let versions = getDataObject(consecutivo, 'Status', ['file_id_MASTER', 'file_id_ACTUAL'])

  // VERSIÓN ANTERIOR

  // Destruir versión anterior (si existe)
  if (versions.file_id_ACTUAL != '') {
    let anterior = DriveApp.getFileById(versions.file_id_ACTUAL);
    anterior.setTrashed(true);
    saveDataObject(consecutivo, 'FINAL', { file_id: '', last_updated: '', file_name: '', editors: '', viewers: '' });
  }

  // MASTER

  // Recuperar master (borrador)
  let master = DriveApp.getFileById(versions.file_id_MASTER);

  // Hacer una copia de master
  let consecutivo_string = consecutivo.toString();
  let file_name = 'oficio ' + consecutivo_string.padStart(3, '0') + ' [' + status + ']'
  let in_folder = DriveApp.getFolderById(defineFolderId(status)); // Folder donde será guardado
  let copia = master.makeCopy(file_name, in_folder);

  // Si el status está cambiando a CANCELADO, destruir master
  if (status == 'CANCELADO') {
    let file_id_Oficios_generados = '1ycq6gmDmOu5twG5duSDi7-YE0xmVvBsVbPbEWnvVQsU';
    master.setTrashed(true);
    Logger.log(saveDataObject(consecutivo, 'File', { file_ID: '',file_NAME : '' }, file_id_Oficios_generados));
  }

  // COPIA
  // Si status es 'CANCELADO', es respaldo; si status es 'FINAL', es versión actual

  // Recuperar los datos de archivo asociados a la copia
  const copiaInfo = {
    file_id: copia.getId(),
    file_name: file_name, // Nombre inespecífico
    date_created: copia.getDateCreated(), // Fecha en que se creó el respaldo
    last_updated: master.getLastUpdated(), // Fecha de la última edición del borrador
    editors: listUsersEmail(master.getEditors()),
    viewers: listUsersEmail(master.getViewers())
  };

  // Guardar file info en tabla correspondiente
  // La función sabe qué tiene que guardar dónde de acuerdo al status
  let table = status; // Por si algún día resulta que las tablas 'FINAL' y 'CANCELADO' tienen que llevar otros nombres
  Logger.log(saveDataObject(consecutivo, table, copiaInfo));

  return copiaInfo;
}


function listUsersEmail(users) {
  let emails_array = [];
  for (let user in users) {
    let email = users[user].getEmail();
    emails_array.push(email);
  }
  return emails_array.join('\n');
}


function defineFolderId(status) {
  switch (status) {
    case 'BORRADOR': return '1we2Er3k-ljjrVjogYiFwS10WoWSo0PJF';
    case 'CANCELADO': return '1yf9qKhdgXgfDq3AWg95jr1pQPFoLR3qC';
    case 'FINAL': return '1SM3FjPB9A7OuOh151y3I-mA80TTdZqjd'
  }
}


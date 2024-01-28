function documentProcessor(consecutivo, status) {

  if (status == 'FINAL') {
    let file_id = getFieldValue(consecutivo, status, 'file_id');
    let document = DocumentApp.openById(file_id);
    let numero_actual = getFieldValue(consecutivo, 'Contenido', 'numero_de_oficio_EXTRACTED');
    let numero_de_oficio = getFieldValue(consecutivo, 'identificadores', 'Número de oficio');
    let file_name = getFieldValue(consecutivo, 'identificadores', 'File name');
    let watermark_extracted = getFieldValue(consecutivo, 'Extracted', 'watermark');

    Logger.log('updated header:\n' + updateText(document, numero_actual, numero_de_oficio));
    Logger.log('file name: ' + updateFileName(document, file_name));
    removeWatermark(document, watermark_extracted);

    Logger.log(saveFieldValue(consecutivo, 'FINAL', 'file_name', document.getName()));
  }

  if (status == 'CANCELADO') {
    let file_id = getFieldValue(consecutivo, status, 'file_id');
    let document = DocumentApp.openById(file_id);
    let watermark_extracted = getFieldValue(consecutivo, 'Extracted', 'watermark');
    let watermark = 'CANCELADO — El documento no será remitido y\rel número consecutivo no será reasignado';

    updateText(document, watermark_extracted, watermark);

    Logger.log('Se actualizó el header del documento:\n' + document.getHeader().getText());
  }
}


function updateText(document, old_text, new_text) {
  let text_regex = '\\Q' + old_text + '\\E'
  let header = document.getHeader();
  header.replaceText(text_regex, new_text);
  return header.getText();
}

function removeWatermark(document, watermark_extracted) {
  let header = document.getHeader();

  // Define the search parameters.
  let searchType = DocumentApp.ElementType.PARAGRAPH;
  let searchResult = null;

  // Search until the paragraph is found.
  while (searchResult = header.findElement(searchType, searchResult)) {
    let paragraph = searchResult.getElement().asParagraph();
    let paragraph_text = paragraph.getText();
    if (paragraph_text.includes(watermark_extracted)) {
      paragraph.removeFromParent();
      Logger.log('Se eliminó el elemento \'' + paragraph_text + '\' junto con el código QR');
      break;
    }
  }
}

function updateFileName(document, file_name) {
  document.setName(file_name);
  let new_name = document.getName();
  return new_name;
}

function updateNumero(consecutivo, from_content) {
  let numero_de_oficio = getFieldValue(consecutivo, 'Nùmero de oficio', 'Nùmero de oficio');
  // let regex_string = numero_de_oficio.replace("\\","/\");
  let header = document.getHeader();

}
function defineSearchesHeader() {

  const numero_de_oficio = {
    description: '<inicio de línea>La cadena \'No. de oficio:\' (el resto de la línea no es tomado en cuenta)',
    ejemplo: 'No. de oficio: DGCC/DBFLE/001/01/2023',
    regex: /^No\. de oficio:[\S\s]*$/
  };
}

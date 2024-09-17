function onFormSubmit(e) {
  Logger.log("Formulario enviado");
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastRowData = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Obtener los encabezados de la primera fila
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Mapear encabezados antiguos a nuevos
  var headerMapping = {
    "Marca temporal": "Fecha y hora:",
    "Dirección de correo electrónico": "E-mail:",
    "Nombre del solicitante :": "Nombre:",
    "Tipo de ubicación:": "Donde:",
    "Aula:": "Aula:",
    "Laboratorio:": "Laboratorio:",
    "Ubicación donde se encuentra el problema:": "Ubicación:",
    "Edificio:": "Edificio:",
    "Problema a resolver:": "Problema:"
  };
  
  // Encabezados a excluir
  var excludeHeaders = ["Donde:", "E-mail:"];
  
  // MENSAJE A ENVIAR POR WHATSAPP CON LA INFORMACIÓN DE LAS CELDAS
  var message = `⚠ *Nuevo reporte:*\n\n`;
  
  for (var i = 0; i < lastRowData.length; i++) {
    if (lastRowData[i]) {  // Solo incluir si la celda tiene texto
      var cellValue = lastRowData[i];
      var header = headers[i];
      
      // Obtener el nuevo encabezado
      var newHeader = headerMapping[header] || header; // Usa el nuevo encabezado si existe, de lo contrario usa el original
      
      // Verificar si el encabezado debe ser excluido
      if (!excludeHeaders.includes(newHeader)) {
        // Verificar si el valor es una fecha
        if (cellValue instanceof Date) {
          // Formatear la fecha como 11/sep/2024 12:05
          var formattedDate = Utilities.formatDate(cellValue, Session.getScriptTimeZone(), "dd/MMM/yyyy HH:mm");
          message += `*${newHeader}* ${formattedDate}\n`;
        } else {
          message += `*${newHeader}* ${cellValue}\n`;  // Usa los encabezados como etiquetas
        }
      }
    }
  }
  
  Logger.log("Mensaje a enviar: " + message);
  
  // Enviar el mensaje a los siguientes números
  sendWhatsAppMessage(message, 'whatsapp:+5213314556124');
  //sendWhatsAppMessage(message, 'whatsapp:+5213323473427'); //Jesus

  //sendWhatsAppMessage(message, 'whatsapp:+5213315870896');
  //Pepe: +52 1 33 3577 8761 Camarillo: +52 1 33 1465 5664
}

function sendWhatsAppMessage(message, toNumber) {
  var accountSid = 'ACff87631f4e987be63f83ed3d64a0f48a'; // Reemplaza con tu Account SID
  var authToken = '9aa33a528291964ed2b844e6f1bada26'; // Reemplaza con tu Auth Token
  var fromNumber = 'whatsapp:+14155238886'; // Número de sandbox de Twilio WhatsApp
  
  var payload = {
    To: toNumber,
    From: fromNumber,
    Body: message
  };
  
  var options = {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    payload: payload,
    headers: {
      'Authorization': 'Basic ' + Utilities.base64Encode(accountSid + ':' + authToken)
    }
  };
  
  var response = UrlFetchApp.fetch('https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json', options);
  Logger.log(response.getContentText());
}

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("psbops_blog");
  const data = sheet.getDataRange().getValues();
  
  const htmlOutput = HtmlService.createHtmlOutput(JSON.stringify(data));
  htmlOutput.setMimeType(ContentService.MimeType.JSON);
  
  return htmlOutput;
}

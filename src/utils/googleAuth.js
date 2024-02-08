const { google } = require('googleapis');

// create a function to authenticate the google sheets API
async function getAuthSheets() {
  // create a new google auth object
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  // get the client
  const client = await auth.getClient();

  // create a new google sheets object
  const googleSheets = google.sheets({ version: 'v4', auth: client });

  // the id of the google sheet
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // return the auth and googleSheets objects
  return {
    auth, 
    client, 
    googleSheets,
    spreadsheetId
  }

}

module.exports = getAuthSheets;
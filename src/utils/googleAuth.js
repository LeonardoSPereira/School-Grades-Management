const { google } = require('googleapis');

// create a function to authenticate the google sheets API
async function getAuthSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = '1UHsugysg-BSeaEm6s8wJRF3HiWuq_gxkV3D1BfL6MUI';

  return {
    auth, 
    client, 
    googleSheets,
    spreadsheetId
  }

}

module.exports = getAuthSheets;
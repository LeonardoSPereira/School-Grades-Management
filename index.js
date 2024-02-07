const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();

app.use(express.json());

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


async function getSheetData(req, res) {
  const { auth, googleSheets, spreadsheetId } = await getAuthSheets();

  const values = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: 'A2:H27',
    valueRenderOption: 'UNFORMATTED_VALUE',
  });

  fs.writeFileSync('sheetsValue.json', JSON.stringify(values.data.values, null, 2));

  res.json(values.data.values);
}

app.get('/values', getSheetData);


async function appendSheetData(req, res) {
  const { auth, googleSheets, spreadsheetId } = await getAuthSheets();

  const values = fs.readFileSync('sheetsValue.json', 'utf-8');
  
  const sheetsValues = JSON.parse(values);

  if (!sheetsValues) {
    return res.status(400).json({ error: 'No data to append' });
  }

  for(let i = 2; i < sheetsValues.length; i++) {
    const studentData = sheetsValues[i]

    const studentInfo = {
      id: studentData[0],
      name: studentData[1],
      absences: studentData[2],
      gradeP1: studentData[3],
      gradeP2: studentData[4],
      gradeP3: studentData[5],
      situation: studentData[6],
      gradeToAprove: studentData[7]
    }

    if (studentInfo.absences > 60 / 4) {
      studentInfo.situation = 'Reprovado por Falta';
      studentInfo.gradeToAprove = 0;

    } else {
      const average = (studentInfo.gradeP1 + studentInfo.gradeP2 + studentInfo.gradeP3) / 3;
      console.log('average: ', average);
  
      if (average >= 70) {
        studentInfo.situation = 'Aprovado';
        studentInfo.gradeToAprove = 0;

      } else if ( 70 > average && average >= 50) {
        studentInfo.situation = 'Exame Final';

        const gradeToAprove = 100 - average;
        studentInfo.gradeToAprove = gradeToAprove.toFixed(0);

      } else {
        studentInfo.situation = 'Reprovado';
        studentInfo.gradeToAprove = 0;
      }

    }
    
    console.log(`student ${i - 1}: `, studentInfo);
    
  }

  res.json({ message: 'Data appended' });

  return
  
  const resource = {
    values: [values]
  };
  
  const response = await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: 'A2:H27',
    valueInputOption: 'USER_ENTERED',
    resource,
  });

  res.json(response.data);

}

app.post('/values', appendSheetData);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
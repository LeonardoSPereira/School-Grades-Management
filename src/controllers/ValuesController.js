const fs = require('fs');
const getAuthSheets = require('../utils/googleAuth');

class ValuesController {

  // create a function to get the data from the google sheet
  async getSheetData(req, res) {
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

  // create a function to append the data to the google sheet
  async  appendSheetData(req, res) {
    const { auth, googleSheets, spreadsheetId } = await getAuthSheets();

    const values = fs.readFileSync('sheetsValue.json', 'utf-8');
    
    const sheetsValues = JSON.parse(values);

    if (!sheetsValues) {
      return res.status(400).json({ error: 'No data to append' });
    }

    let sheetRowNumberControl = 4;
    
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
    
        if (average >= 70) {
          studentInfo.situation = 'Aprovado';
          studentInfo.gradeToAprove = 0;

        } else if ( 70 > average && average >= 50) {
          studentInfo.situation = 'Exame Final';

          const gradeToAprove = 100 - average;
          studentInfo.gradeToAprove = Math.round(gradeToAprove);

        } else {
          studentInfo.situation = 'Reprovado';
          studentInfo.gradeToAprove = 0;
        }

      }

      const resource = {
        values: [[
          studentInfo.id, 
          studentInfo.name, 
          studentInfo.absences, 
          studentInfo.gradeP1, 
          studentInfo.gradeP2, 
          studentInfo.gradeP3, 
          studentInfo.situation, 
          studentInfo.gradeToAprove
        ]]
      };
      
      await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: `A${sheetRowNumberControl}:H${sheetRowNumberControl}`,
        valueInputOption: 'USER_ENTERED',
        resource,
      });

      sheetRowNumberControl++;

    }
    
    res.json({ message: 'Data updated' });
  }

}

module.exports = ValuesController;
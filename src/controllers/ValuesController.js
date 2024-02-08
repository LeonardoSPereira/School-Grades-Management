const fs = require('fs');
const getAuthSheets = require('../utils/googleAuth');

class ValuesController {

  // create a function to get the data from the google sheet
  async getSheetData(req, res) {
    // get the auth and googleSheets objects from the getAuthSheets function
    const { auth, googleSheets, spreadsheetId } = await getAuthSheets();

    // get the values from the google sheet
    const values = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: 'A2:H27',
      valueRenderOption: 'UNFORMATTED_VALUE',
    });

    // write the values to a file
    fs.writeFileSync('sheetsValue.json', JSON.stringify(values.data.values, null, 2));

    // return the values to the client
    res.json(values.data.values);
  }

  // create a function to append the data to the google sheet
  async  appendSheetData(req, res) {
    // get the auth and googleSheets objects from the getAuthSheets function
    const { auth, googleSheets, spreadsheetId } = await getAuthSheets();

    // read the values from the file
    const values = fs.readFileSync('sheetsValue.json', 'utf-8');
    
    // parse the values to a JSON object
    const sheetsValues = JSON.parse(values);

    // check if there are values to append or throw an error
    if (!sheetsValues) {
      return res.status(400).json({ error: 'No data to append' });
    }

    // variable to control the row number
    let sheetRowNumberControl = 4;
    
    // loop through the values to append to the google sheet
    for(let i = 2; i < sheetsValues.length; i++) {
      // get the student data from the values
      const studentData = sheetsValues[i]

      // create an object with the student data
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

      // check the student situation and calculate the grade to aprove
      if (studentInfo.absences > 60 / 4) {
        studentInfo.situation = 'Reprovado por Falta';
        studentInfo.gradeToAprove = 0;

      } else {
        // calculate the average
        const average = (studentInfo.gradeP1 + studentInfo.gradeP2 + studentInfo.gradeP3) / 3;
    
        // check the average and set the situation and grade to aprove
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

      // create the resource object to append the data to the google sheet
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
      
      // append the data to the google sheet
      await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: `A${sheetRowNumberControl}:H${sheetRowNumberControl}`,
        valueInputOption: 'USER_ENTERED',
        resource,
      });

      // increment the row number control
      sheetRowNumberControl++;

    }
    
    // return a message to the client
    res.json({ message: 'Data updated' });
  }

}

module.exports = ValuesController;
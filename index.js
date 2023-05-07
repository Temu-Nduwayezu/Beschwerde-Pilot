const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdf-lib').PDFDocument;
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
  //res.sendFile('/public/login.html')
});

app.post('/create-pdf', async (req, res) => {
  const behoerde = req.body.behoerde;
  const adresse = req.body.adresse;
  const ort = req.body.ort;
  const datum = req.body.datum;
  const name = req.body.name;
  const adresse1 = req.body.adresse1;
  const email = req.body.email;
  const saumnisbehorde = req.body.saumnisbehorde;


  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const paragraph = "Gegen die mehr als 6-monatige Untätigkeit (belangte Behörde) bei der Erledigung \n eines Antrages auf (Antragsgegenstand) vom (Datum), erhebe ich wegen \n Verletzung in meinem Recht auf Entscheidung"

  // Add a new page to the document
  const page = pdfDoc.addPage();

  // Draw the text on the page
  const { width, height } = page.getSize();
  page.drawText(`Behörde: ${behoerde}`, { x: 50, y: height - 70 });
  page.drawText(`Adresse: ${adresse}`, { x: 50, y: height - 90 });
  page.drawText(`Ort: ${ort}`, { x: 50, y: height - 110 });
  page.drawText(`Datum: ${datum}`, { x: 50, y: height - 130 });
  page.drawText(`Name: ${name}`, { x: 50, y: height - 150 });
  page.drawText(`Adresse: ${adresse}`, { x: 50, y: height - 170 });
  page.drawText(`Email: ${email}`, { x: 50, y: height - 190 });
  page.drawText(`Säumnisbeschwerde:`, { x: 50, y: height - 210 });
  page.drawText(paragraph, { x: 50, y: 600, size: 10});

  

  // Serialize the PDF document to a buffer
  const pdfBytes = await pdfDoc.save();

  // Write the buffer to a file
  fs.writeFile('output.pdf', pdfBytes, (err) => {
    if (err) {
      console.log(err);
      res.send('Error generating PDF');
    } else {
      res.download('output.pdf');
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});


app.use(express.static('public'));
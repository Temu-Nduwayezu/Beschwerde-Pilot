const express = require('express');
const bodyParser = require('body-parser');
//const PDFDocument = require('pdf-lib').PDFDocument;
const { PDFDocument, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
//const sqlite3 = require('sqlite3').verbose();

// Open a connection to a new SQLite database file
//const db = new sqlite3.Database('mydb.sqlite');
// Create a new table named "users"
//db.run('CREATE TABLE IF NOT EXISTS log (id INTEGER PRIMARY KEY, name TEXT)');


const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
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
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const paragraph = `Gegen die mehr als 6-monatige Untätigkeit ${behoerde} bei der Erledigung \n eines Antrages auf (Antragsgegenstand) vom ${datum}, erhebe ich wegen \n Verletzung in meinem Recht auf Entscheidung`
  const beschwerde = `Beschwerde \n und stelle den/stelle durch meine bevollmächtigte Vertreterin den`
  const antrag = `das Verwaltungsgericht möge über meinen Antrag auf Erteilung der Bewilligung zur (Antragsgegenstand)\n selbst in der Sache erkennen und mir die Bewilligung zur (Antragsgegenstand) erteilen,\n [in eventu] gem §24 VwGVG eine öffentliche Verhandlung durchführen.`
  const begruenung = `Begründung Der Sachverhalt stellt sich wie folgt dar:\n Am ${datum} beantragte ich bei ${behoerde} die Erteilung der Bewilligung zur (Antragsgegenstand).`
  // Add a new page to the document
  const page = pdfDoc.addPage();

  // Draw the text on the page
  const {width,height} = page.getSize();
  page.drawText(`Behörde: ${behoerde}`, {
    size:16,
    x: 50,
    y: height - 70
  });
  page.drawText(`Adresse: ${adresse}`, {
    size:16,
    x: 50,
    y: height - 90
  });
  page.drawText(`${ort},${datum}`, {
    size:16,
    x: 450,
    y: height - 110
  });
  page.drawText(`Beschwerdeführer: ${name}`, {
    size:16,
    x: 50,
    y: height - 150
  });
  page.drawText(`Adresse: ${adresse}`, {
    size:16,
    x: 50,
    y: height - 170
  });
  page.drawText(`Säumnisbeschwerde:`, {
    size:16,
    x: 220,
    y: height - 210,
    font: boldFont
  });
  page.drawText(paragraph, {
    x: 50,
    y: 600,
    size: 10
  });

  page.drawText(beschwerde, {x: 50, y: 500, size: 10});
  page.drawText(antrag, {x: 50, y: 400, size: 10});
  page.drawText(begruenung, {x: 50, y: 300, size: 10});

  // Serialize the PDF document to a buffer
  const pdfBytes = await pdfDoc.save();
  const IsCompleted = true;

  // Write the buffer to a file
  fs.writeFile('output.pdf', pdfBytes, (err) => {
    if (err) {
      console.log(err);
      res.send('Error generating PDF');
    } else {
      res.download('output.pdf');
      if(IsCompleted){
        cron.schedule('*/2 * * * *', () => {
          console.log('running a task every 5 minutes');
        });
    }
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

app.use(express.static('public'));
const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdf-lib').PDFDocument;
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
});

app.post('/create-pdf', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a new page to the document
  const page = pdfDoc.addPage();

  // Draw the text on the page
  const { width, height } = page.getSize();
  page.drawText(`Name: ${name}`, { x: 50, y: height - 50 });
  page.drawText(`Email: ${email}`, { x: 50, y: height - 70 });

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

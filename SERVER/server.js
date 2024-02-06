const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');//commit
const firebase = require('firebase');
const app = express();

const port = process.env.PORT || 3000;

const firebaseConfig = {
  apiKey: "AIzaSyDxeU-bMAf-O0HYhz6X8yhsNPpqe19ld_8",
  authDomain: "apsc-database.firebaseapp.com",
  databaseURL: "https://apsc-database-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "apsc-database",
  storageBucket: "apsc-database.appspot.com",
  messagingSenderId: "848325536482",
  appId: "1:848325536482:web:efe7c6b0cd442eff6c0cbb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Firebase reference
let database = firebase.database();

let payload;
let machineID;
let amountPaid;
let paymentStatus;
let ewalletType;
let transactionID;
let transactionDate;
let transactionSummary = "No Data received.";
let transactionSummary2 = "No Data received.";

//middleware
app.use(express.static(path.join(__dirname), { 'extensions': ['css'], 'index': false }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ignore favicon.ico requests
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Webhook endpoint to handle POST requests
app.post('/', (req, res) => {
  // Request body data to payload variable
  payload = req.body;

  try {
    // Check if payload is present
    if(payload) {
      console.log('\nReceived data:', payload);
      
      amountPaid = JSON.stringify(payload.paid_amount, null, 2).replace(/"/g, '');
      transactionID = JSON.stringify(payload.id, null, 2).replace(/"/g, '');
      transactionDate = JSON.stringify(payload.paid_at, null, 2).replace(/"/g, '');
      machineID = JSON.stringify(payload.external_id, null, 2).replace(/"/g, '');
      paymentStatus = JSON.stringify(payload.status, null, 2).replace(/"/g, '');
      ewalletType = JSON.stringify(payload.ewallet_type, null, 2).replace(/"/g, '');

      if(machineID == `"machineTest2"`){
        transactionSummary2 = `<${amountPaid}!${paymentStatus}@${ewalletType}#${transactionID}%${machineID}>`;
      }
      else{
        transactionSummary = `<${amountPaid}!${paymentStatus}@${ewalletType}#${transactionID}%${machineID}>`;
      }

      writeData();

      console.log('Amount Paid:', amountPaid);
      console.log('Status:', paymentStatus);
      console.log('Ewallet:', ewalletType);
      console.log('Transaction Id:', transactionID);
      console.log('Date:', transactionDate);
      console.log('Machine ID:', machineID);
    }
    else {
      transactionSummary = `Invalid payload structure`;
    }
    // 2xx response from our server to paymongo indicating successful data acquisition.
    res.status(200).send('Data received.');
  }
  catch(error) {
    console.error('Error processing payload:', error);
    res.status(500).send('Internal Server Error');
    return;
  }
});

app.get('/', (req, res) => {
  // Display JSON data
  res.send(transactionSummary);
  console.log(`localhost:${port} has been opened`)
});

app.get('/machine2', (req, res) => {
  // Display JSON data
  res.send(transactionSummary2);
  console.log(`localhost:${port} has been opened`)
});

app.get('/paymentPage', (req, res) => {
    const htmlPath = path.join(__dirname,'paymentPage.html');
    //const cssPath = path.join(__dirname, 'mainPageStyles.css');
    const jsPath = path.join(__dirname, 'createInvoice.js');
    
    if (fileExists(htmlPath) /*&& fileExists(cssPath)*/ && fileExists(jsPath)) {
        //const cssContent = fs.readFileSync(cssPath, 'utf8');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        const jsContent = fs.readFileSync(jsPath, 'utf8');
        res.send(`
            ${htmlContent}
        `);
    } else {
        res.status(404).send('404 Not Found');
    }
});

app.get('/paymentPage2', (req, res) => {
    const htmlPath = path.join(__dirname,'paymentPage2.html');
    //const cssPath = path.join(__dirname, 'mainPageStyles.css');
    const jsPath = path.join(__dirname, 'createInvoice2.js');
    
    if (fileExists(htmlPath) /*&& fileExists(cssPath)*/ && fileExists(jsPath)) {
        //const cssContent = fs.readFileSync(cssPath, 'utf8');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        const jsContent = fs.readFileSync(jsPath, 'utf8');
        res.send(`
            ${htmlContent}
        `);
    } else {
        res.status(404).send('404 Not Found');
    }
});

app.get('/paymentPage3', (req, res) => {
    const htmlPath = path.join(__dirname,'paymentPage3.html');
    //const cssPath = path.join(__dirname, 'mainPageStyles.css');
    const jsPath = path.join(__dirname, 'createInvoice3.js');
    
    if (fileExists(htmlPath) /*&& fileExists(cssPath)*/ && fileExists(jsPath)) {
        //const cssContent = fs.readFileSync(cssPath, 'utf8');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        const jsContent = fs.readFileSync(jsPath, 'utf8');
        res.send(`
            ${htmlContent}
        `);
    } else {
        res.status(404).send('404 Not Found');
    }
});

app.get('/paymentPage4', (req, res) => {
    const htmlPath = path.join(__dirname,'paymentPage4.html');
    //const cssPath = path.join(__dirname, 'mainPageStyles.css');
    const jsPath = path.join(__dirname, 'createInvoice4.js');
    
    if (fileExists(htmlPath) /*&& fileExists(cssPath)*/ && fileExists(jsPath)) {
        //const cssContent = fs.readFileSync(cssPath, 'utf8');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        const jsContent = fs.readFileSync(jsPath, 'utf8');
        res.send(`
            ${htmlContent}
        `);
    } else {
        res.status(404).send('404 Not Found');
    }
});

// writeData function
function writeData() {
  let dataRef = null;

  // Data to be written
  let newData = {
    amount: amountPaid,
    status: paymentStatus,
    eWallet: ewalletType,
    transactionDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' })
  };

  switch(machineID) {
    //cases machineTest1 & machineTest2 is for owner1.
    //cases machineTest3 & machineTest4 is for owner2.
    case `machineTest1`:
      dataRef = database.ref(`users/uid/CpSFEjW3QGckOPjuQSEbORx7Wdq1/TST001/transactionHistory/eWallet`);
      // Push new data to the database or update existing data if there is a similar existing transactionID in the database/
      dataRef.child(transactionID).set(newData)
      .then(function() {
        console.log("Data written successfully!");
      })
      .catch(function(error) {
        console.error("Error writing data: ", error);
      });
      break;
    case `machineTest2`:
      dataRef = database.ref(`users/uid/CpSFEjW3QGckOPjuQSEbORx7Wdq1/TST002/transactionHistory/eWallet`);
      // Push new data to the database or update existing data if there is a similar existing transactionID in the database/
      dataRef.child(transactionID).set(newData)
      .then(function() {
        console.log("Data written successfully!");
      })
      .catch(function(error) {
        console.error("Error writing data: ", error);
      });
      break;
    case `machineTest3`:
      dataRef = database.ref(`users/uid/am1eoT1rHJaI6rRrt3kplD0Zfrt2/TST001/transactionHistory/eWallet`);
      // Push new data to the database or update existing data if there is a similar existing transactionID in the database/
      dataRef.child(transactionID).set(newData)
      .then(function() {
        console.log("Data written successfully!");
      })
      .catch(function(error) {
        console.error("Error writing data: ", error);
      });
      break;
    case `machineTest4`:
      dataRef = database.ref(`users/uid/am1eoT1rHJaI6rRrt3kplD0Zfrt2/TST002/transactionHistory/eWallet`);
      // Push new data to the database or update existing data if there is a similar existing transactionID in the database/
      dataRef.child(transactionID).set(newData)
      .then(function() {
        console.log("Data written successfully!");
      })
      .catch(function(error) {
        console.error("Error writing data: ", error);
      });
      break;
    default:
      break;
  }
}

function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

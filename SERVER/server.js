const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const app = express();

const port = process.env.PORT || 8080;

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
let header;
let machineID;
let amountPaid;
let paymentStatus;
let ewalletType;
let transactionID;
let transactionDate;
let transactionSummary = "No Data received.";
let transactionSummary2 = "No Data received.";
let callbackToken = "1MAgXeIhQc43ov74AoWMKVuww3fjKHkAPCS9iabBm2c3NuW0";

// JSON Data parser
app.use(bodyParser.json());

// ignore favicon.ico requests
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Webhook endpoint to handle POST requests
app.post('/', (req, res) => {
  // Request body data to payload variable
  header = req.headers;
  payload = req.body;

  // Check if payload is present & callback token is valid.
  if(payload && header['x-callback-token'] == callbackToken) {
    console.log('\nReceived data:', payload);
    try {
      amountPaid = JSON.stringify(payload.paid_amount, null, 2).replace(/"/g, '');
      transactionID = JSON.stringify(payload.id, null, 2).replace(/"/g, '');
      transactionDate = JSON.stringify(payload.paid_at, null, 2).replace(/"/g, '');
      machineID = JSON.stringify(payload.external_id, null, 2).replace(/"/g, '');
      paymentStatus = JSON.stringify(payload.status, null, 2).replace(/"/g, '');
      ewalletType = JSON.stringify(payload.ewallet_type, null, 2).replace(/"/g, '');

      if(machineID == "machineTest2"){
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
  
      // 2xx response from our server to indicate successful data acquisition.
      res.status(200).send('Data received.');
    }
    catch(error) {
      console.error('Error processing payload:', error);
      res.status(500).send('Error processing payload.');
      return;
    }
  }
  else {
    transactionSummary = `Invalid callback token`;
    res.status(401).send('Invalid callback token');
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

// writeData function
function writeData(/*amountPaid, transactionID, paymentStatus, ewalletType*/) {
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

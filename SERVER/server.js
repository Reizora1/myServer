const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const app = express();

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
var database = firebase.database();

let payload;
let header;
let machineID;
let amountPaid;
let paymentStatus;
let ewalletType;
let transactionID;
let transactionDate;
let transactionSummary = "No Data received.";

// JSON Data parser
app.use(bodyParser.json());

// ignore favicon.ico requests
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Webhook endpoint to handle POST requests
app.post('/', (req, res) => {
  // Request body data to payload variable
  payload = req.body;
  header = JSON.stringify(req.header, null, 2);
  console.log(header);
  
  try {
    // Check if payload is present
    if(payload) {
      console.log('\nReceived data:', payload);
      
      amountPaid = JSON.stringify(payload.paid_amount, null, 2);
      transactionID = JSON.stringify(payload.id, null, 2);
      transactionDate = JSON.stringify(payload.paid_at, null, 2);
      machineID = JSON.stringify(payload.external_id, null, 2);
      paymentStatus = JSON.stringify(payload.status, null, 2);
      ewalletType = JSON.stringify(payload.ewallet_type, null, 2);

      transactionSummary = amountPaid + " " + paymentStatus + " " + ewalletType + " " + transactionID + " " + transactionDate + " " + machineID;

      writeData(amountPaid, transactionID, paymentStatus, ewalletType);

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
  console.log("localhost:3000 has been opened")
});

// writeData function
function writeData(amountPaid, transactionID, paymentStatus, ewalletType) {
  var dataRef = database.ref('TST001/transactionHistory/eWallet');

  // Data to be written
  var newData = {
    amount: amountPaid,
    status: paymentStatus,
    eWallet: ewalletType,
    transactionDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' })
  };

  // Push new data to the database or update existing data if there is a similar existing transactionID in the database/
  dataRef.child(transactionID).set(newData)
    .then(function() {
      console.log("Data written successfully!");
    })
    .catch(function(error) {
      console.error("Error writing data: ", error);
    });
}

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

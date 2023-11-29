const express = require('express');
const bodyParser = require('body-parser');

const app = express();
let payload;
//let data;
let machineID;
let amountPaid;
let paymentStatus;
let transactionID;
let transactionDate;
let transactionSummary = "No Data received.";

// Middleware to parse JSON data
app.use(bodyParser.json());

// Middleware to ignore requests for favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // Send a 204 No Content response
});

// Webhook endpoint to handle POST requests
app.post('/', (req, res) => {
  // Handle the webhook payload containing json data of events triggered from PayMongo.
  payload = req.body;
  // Convert payload json data into a string and assign to global variable named data.
  // data = JSON.stringify(payload, null, 2);

  try {
    // Check if the payload and its properties exist before accessing them
    if(payload) {
      // Display the entire payload to the console.
      console.log('\nReceived data:', payload);
      // console.log('Received data object:\n', data);
      
      amountPaid = JSON.stringify(payload.paid_amount, null, 2);
      transactionID = JSON.stringify(payload.id, null, 2);
      transactionDate = JSON.stringify(payload.paid_at, null, 2);
      machineID = JSON.stringify(payload.external_id, null, 2);
      paymentStatus = JSON.stringify(payload.status, null, 2);

      transactionSummary = amountPaid + " " + paymentStatus + " " + transactionID + " " + transactionDate + " " + machineID;

      console.log('Amount Paid:', amountPaid);
      console.log('Status:', paymentStatus);
      console.log('\nTransaction Id:', transactionID);
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

// Route to handle GET requests at the root URL
app.get('/', (req, res) => {
  // Display json data to the web UI.
  res.send(transactionSummary);
  console.log("localhost:3000 has been opened")
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

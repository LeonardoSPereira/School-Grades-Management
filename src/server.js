const express = require('express');
const router = require('./routes');

// initialize the express server
const app = express();

// parse the request body as JSON
app.use(express.json());

// create a function to handle the routes
app.use(router);

const PORT = process.env.PORT || 3000;

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
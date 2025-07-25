// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./models/init'); // Runs table creation

const loansRouter = require('./routes/loans');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1/loans', loansRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

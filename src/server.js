const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON payloads
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

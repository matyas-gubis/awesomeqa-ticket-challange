const express = require('express');

const app = express();

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Successful response.');
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));

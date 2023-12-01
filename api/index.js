import express from 'express';

const app = express();

app.listen(5002, () => {
  console.log('serveri on käynnissä portilla 5002');
});

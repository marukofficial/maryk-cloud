import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ API MaryK fonctionne correctement !');
});

app.listen(port, () => {
  console.log(`🚀 API MaryK écoute sur le port ${port}`);
});

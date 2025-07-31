// ✅ version stable CommonJS
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ MaryK API is responding 🎉');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Listening on port ${port}`);
});

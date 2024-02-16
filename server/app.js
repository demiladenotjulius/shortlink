const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const path = require('path');
const app = express();

const port = process.env.PORT || 3700;


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const urlSchema = new mongoose.Schema({
  longURL: String,
  shortCode: String,
});

const UrlModel = mongoose.model('Url', urlSchema);



app.post('/shorten', async (req, res) => {
  const longURL = req.body.longURL;
  const shortCode = shortid.generate();

  const newURL = new UrlModel({
    longURL,
    shortCode,
  });


  await newURL.save();

  res.json({ shortURL: `http://localhost:3700/${shortCode}` });
});



app.get('/:shortCode', async (req, res) => {
  const shortCode = req.params.shortCode;

  const urlData = await UrlModel.findOne({ shortCode });

  if (urlData) {
    res.redirect(urlData.longURL);
  } else {
    res.status(404).json({ error: 'URL not found' });
  }
})



app.listen(port , () => {
    console.log(`listening to port ${port}`)
});

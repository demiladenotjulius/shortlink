const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const path = require('path');
const cors = require('cors');  // Import the cors middleware
const app = express();
const port = process.env.PORT || 4700;
const dotenv = require('dotenv');
dotenv.config()

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://shorten:142580@cluster0.gpbwmkj.mongodb.net/urlShortener')
.then(() => {
  console.log('database connection established');
})
.catch(err => {
  console.log(err);
});

const urlSchema = new mongoose.Schema({
  longURL: String,
  shortCode: String,
});

const UrlModel = mongoose.model('Url', urlSchema);

app.post('/shorten', async (req, res) => {
  console.log('Received POST request to /shorten');

  const longURL = req.body.longURL;
  const shortCode = shortid.generate();

  const newURL = new UrlModel({
    longURL,
    shortCode,
  });

  await newURL.save();

  const baseURL = process.env.BASE_URL;
  const shortURL = `${baseURL}/${shortCode}`;

  res.json({ shortURL });});

app.get('/:shortCode', async (req, res) => {
  console.log('Received GET request to /:shortCode');

  const shortCode = req.params.shortCode;
  console.log('Searching for shortCode:', shortCode);

  const urlData = await UrlModel.findOne({ shortCode });

  if (urlData) {
    console.log('URL found:', urlData.longURL);
    res.redirect(urlData.longURL);
  } else {
    console.log('URL not found for shortCode:', shortCode);
    res.status(404).json({ error: 'URL not found' });
  }
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});

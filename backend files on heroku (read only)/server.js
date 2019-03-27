let data = require('./data.json');

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const Meteorites = require('./model');

const API_PORT = process.env.PORT || 8080;
const app = express();
const router = express.Router();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

mongoose.connect('API_URL', {
  useNewUrlParser: true
});

const connection = mongoose.connection;

connection.once('open', () => {
  Meteorites.countDocuments({}, (err, count) => {
    if (count > 0) {
      console.log("DB has all needed records!");
    } else {
      Meteorites.insertMany(data.data);
    }
  });
  console.log('MongoDB database connection estabilished successfully.');
});

connection.on('error', () => {
  console.error(console, 'MongoDB connection error:');
});

// GET

router.get('/get', (req, res) => {
  Meteorites.find((err, data) => {
    if (err) { return res.json({ success: false, error: err }); }
    return res.json({ success: true, data: data });
  });
});

// DELETE

router.delete('/delete', (req, res) => {
  const { id } = req.body;
  Meteorites.findByIdAndDelete(id, err => {
    if (err) { return res.json(err); }
    return res.json({ success: true })
  });
});

// ADD

router.post('/add', (req, res) => {
  let meteorite = new Meteorites(req.body);
  meteorite.save()
    .then(meteorite => {
      res.status(200).json("Meteorite added successfully!");
    })
    .catch(err => {
      res.status(400).json("Adding new meteorite fails.");
    });
});

app.use('/', router);
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));

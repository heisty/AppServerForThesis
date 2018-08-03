const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var router = require('./services/router');

var app = express();

mongoose.connect('mongodb://localhost/jnlbha');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use('/v1',router);

var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || '192.168.30.2';

console.log('Listening on ',HOST,PORT);
app.listen(PORT,HOST);
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var router = require('./services/router');

var app = express();

//mongoose.connect('mongodb://localhost/jnlbha');

mongoose.connect('mongodb://jnladmin:jnlpassword123@ds131312.mlab.com:31312/jnlbah');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use('/v1',router);

var PORT = process.env.PORT || 3000;
//var HOST = process.env.HOST || '192.168.30.3';

console.log('Listening on '/*,HOST*/,PORT);
app.listen(PORT/*,HOST*/);
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var router = require('./services/router');
const cors = require('cors');

var app = express();

// mongoose.connect('mongodb://localhost/jnlbha');



// app.use(morgan('combined'));
// app.use(cors());
// app.use(bodyParser.json());
// app.use('/v1',router);

// var PORT = process.env.PORT || 3000;
// var HOST = process.env.HOST || '192.168.30.3';

// console.log('Listening on ',PORT);
// app.listen(PORT,HOST);

//ON SERVER

mongoose.connect('mongodb://admin:123admin@ds045087.mlab.com:45087/jnlbha');

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use('/v1',router);

var PORT = process.env.PORT || 3000;

console.log('Listening on ',PORT);
app.listen(PORT);  
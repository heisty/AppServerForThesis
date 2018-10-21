const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var router = require('./services/router');
var backup = require('mongodb-backup');
var fs = require('fs');
const cors = require('cors');

var app = express();

mongoose.connect('mongodb://localhost/jnlbha');



// app.use(morgan('combined'));
// app.use(cors());
// app.use(bodyParser.json());
// app.use('/v1',router);




// // let bc = backup({
// //   uri: 'mongodb://localhost/jnlbha', // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
// //   tar: 'dump.tar',
// //    root: __dirname,
// // })



// app.get('/backup',function(req,res,next){
// 	// const filePath =  "dump.tar" // or any file format

//  //  // Check if file specified by the filePath exists 
//  //  fs.exists(filePath, function(exists){
//  //      if (exists) {     
//  //        // Content-type is very interesting part that guarantee that
//  //        // Web browser will handle response in an appropriate manner.
//  //        res.writeHead(200, {
//  //          "Content-Type": "application/octet-stream",
//  //          "Content-Disposition": "attachment; filename=" + "LLSALON BACKUP --- DONOT DELETE --  SAVE IT.tar"
//  //        });
//  //        fs.createReadStream(filePath).pipe(res);
//  //      } else {
//  //        res.writeHead(400, {"Content-Type": "text/plain"});
//  //        res.end("ERROR File does not exist");
//  //      }
//  //    });
//  execute('ping google.com');
//  res.json("ok")
  
// })
// var PORT = process.env.PORT || 3000;
// var HOST = process.env.HOST || '192.168.30.5';

// console.log('Listening on ',PORT);
app.listen(PORT,HOST);

//ON SERVER

//mongoose.connect('mongodb://admin:123admin@ds045087.mlab.com:45087/jnlbha');

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/v1',router);

app.get('/backup',function(req,res,next){
	res.json("Okay")
})


var PORT = process.env.PORT || 3000;

console.log('Listening on ',PORT);
app.listen(PORT);  
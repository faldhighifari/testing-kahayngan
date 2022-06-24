const express = require('express')
const mongo = require('mongodb');

const app = express()
const port = 5000

//allow this app to receive incoming json request
//Create app.use for express.json here
app.use(express.json())

// app.use(mongo)
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const fs = require('fs')
const exec = require('child_process').exec;  

// Menggunakan File System
app.post('/newfolders', (req, res) => {

    const data = req.body

    if (!fs.existsSync(`${data.name}`)){
        fs.mkdirSync(`${data.name}`)

        res.send({
            data,
            status : "ok"
        })
    } else {
   
    res.send({
        status : "exist"
    })
    }
})

// Menggunakan Child Process
app.post('/new-folders', (req, res) => {

    const data = req.body

    exec(`mkdir ${data.folder}`, (err, stdout, stderr) => {  
        if (err) {  
          console.error(err);  
          return;  
        }  
        console.log('stdout: ' + stdout);  
        console.log('stderr: ' + stderr);  
        {
           if((data.files).length>1)
           {
            for(let i = 0;i<(data.files).length;i++){

                exec(`cd ${data.folder} && cd.> ${data.files[i]}.txt`, (err, stdout, stderr) => {  
                    if (err) {  
                    console.error(err);  
                    return;  
                    }  
                    console.log('stdout: ' + stdout);  
                    console.log('stderr: ' + stderr);  
                    console.log(data.files[i]);  
                    
                });  
                }
            
            }
            else{
                exec(`cd ${data.folder} && cd.> ${data.files}`, (err, stdout, stderr) => {  
                    if (err) {  
                      console.error(err);  
                      return;  
                    }  
                    console.log('stdout: ' + stdout);  
                    console.log('stderr: ' + stderr);  
                    
                  });  
            }
        }
      });  

        res.send({
            data,
            status : "ok"
        })
})

app.get('/new-folders', (req, res) => {

    //saya salah logic, method get tidak perlu request body, langsung saja dilisting datanya
    const data = req.body

    // baca database apakah ada nama folder ?
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Testing");
        dbo.collection("folders").findOne({name : `${data.folder}`}, function(err, result) {
          if (err) throw err;
          console.log(result);
        //   console.log(data);
          db.close();
        });
      });

    // ada, maka baca database
    
    // tidak ada, maka baca terminal -> cek pake dir atau ls (menggunakan child process)
    // insert ke database

    res.send({
        data,
        status : "ok"
    })

})

app.listen(port, () => console.log(`Listening on port ${port}!`))
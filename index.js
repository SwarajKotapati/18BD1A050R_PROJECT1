let express = require("express");
let bodyParser = require("body-parser");
let middleware = require('./middleware');
let app = express();
let server = require("./server");

app.use(bodyParser.json());

const MongoClient = require("mongodb").MongoClient;

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'firstdb';

let db;
MongoClient.connect(url,{useNewUrlParser:true,useUnifiedTopology:true},(error,client) =>{
    if(error){
        throw error;
    }

    db = client.db(dbName);
})

// 1. ALL HOSPITALS' DETAILS
app.get('/hospitals/',middleware.checkToken,(req,res) =>{
    db.collection('hospital').find().toArray((err,items) =>{
        if(err){
            throw err;
        }
        res.json(items);
        res.end();
    }); 
});

// 2. ALL VENTILATORS' DETAILS
app.get('/ventilators',middleware.checkToken,(req,res) =>{
    db.collection('ventilator').find().toArray((err,items) =>{
        if(err){
            throw err;
        }
        res.json(items);
        res.end();
    });
});

// 3. HOSPITAL DETAILS BY HOSPITAL NAME
app.get('/HospitalInfo/:hosp_name',middleware.checkToken,(req,res) => {
  
    let hosp_name = req.params.hosp_name;
    
    db.collection('hospital').find({"name":hosp_name}).toArray((err,items) =>{
        if(err){
            throw err;
        }
            res.json(items);
            res.end();
        
    });
});

// 4. VENTILATOR DETAILS BY HOSPITAL ID
app.get('/VentilatorInfo/:hosp_id',middleware.checkToken,(req,res) =>{
    
    let hosp_id = req.params.hosp_id;

    db.collection('ventilator').find({"hid":hosp_id}).toArray((err,items) =>{
       res.json(items);
        res.end();
    });
});

// 5. VENTILATOR DETAILS BY STATUS 
app.get('/VentilatorInfoStatus/:status',middleware.checkToken,(req,res) =>{
    let status = req.params.status;

    db.collection('ventilator').find({"status":status}).toArray((err,items) =>{
        if(err){
            throw err;
        }
        res.json(items);
        res.end();
    });
});

// 6. UPDATE VENTILATOR INFO
app.put('/updateVentilator/',middleware.checkToken,(req,res) =>{
    let status = req.body.status;
    let v_id = req.body.vid;

        let myquery = {"Ventilator_ID":v_id};
        let newquery = { $set: {"Status":status}};
        db.collection('Ventilator_Info').updateOne(myquery,newquery,(err,res1) =>{
            if(err){
                throw err;
            }
            console.log("Document updated");
            console.log(res1.result);
        });
        res.send("Updated");
});

// 7. ADD VENTILATOR
app.post('/addVentilator/',middleware.checkToken,(req,res) =>{
 
    let hosp_id = req.body.hid;
    let hosp_name = req.body.name;
    let v_id = req.body.vid;
    let status = req.body.status;

  

        let myobj = {"hid":hosp_id,"name":hosp_name,"vid":v_id,"status":status};
        db.collection('Ventilator_Info').insertOne(myobj,(err,res1) =>{
            if(err){
                throw err;
            }
            console.log("Document added");
            console.log(res1.result);
        });
});

// 8. DELETE VENTILATOR
app.delete('/deleteVentilator/',middleware.checkToken,(req,res) =>{

    let v_id = req.body.vid;
        let delObj = {"Ventilator_ID":v_id};
        db.collection('Ventilator_Info').deleteOne(delObj,(err,res1) =>{
            if(err){
                throw err;
            }

            console.log("Document Deleted");
            console.log(res1.result);
        });
    
    res.end("<h2>Document Deleted</h2>");
});

app.listen(3000,() =>{
    console.log("Server listening at PORT 3000....");
});
const express = require('express')
const app = express()
const port = 3001
var {MongoClient,ObjectId} = require('mongodb');
const cors = require('cors');
var bodyParser = require("body-parser");
const WebSocket = require('ws')
const server = require('http').createServer(app)
const wss=new WebSocket.Server({port:9000})
var url= 'mongodb://localhost:27017/'
var mongoURL=process.env.mongo_URL
var Mongoclient=new MongoClient(url);
app.use(cors())
require('dotenv').config()
let URLAPI=process.env.URL_API
wss.on('connection', (ws)=>{
   
    ws.send('welcome')
    app.post('/updatebooking',(req,res)=>{
        for( let i of wss.clients){
          if(i!==ws&& i.readyState=== WebSocket.OPEN)
          {
            i.send('welcome')
          }
        }
      var query={
        _id:new ObjectId(req.body._id)
      }
      var set={
        $set:{
          from:req.body.from,
          to:req.body.to,
          soPhong:req.body.soPhong,
        }
    
      }
      connect(async (db)=>{
         var kq= await db.collection('booking').updateOne(query,set)
         console.log(kq)
      })
      
      res.status(200).send('ok')
    })
})

  const connect=( funtion)=>{
    Mongoclient.connect().then( async(b)=>{

      if(b)
      {
        console.log('kết nối thành công')
       await funtion(b.db('roomplan'))
       
      }
      })
  }
  app.use(bodyParser.json({ type: ["application/json", "application/csp-report"] }));
  app.use(express.urlencoded({ extended: false }));
app.listen(port, () => {

})
app.post('/addroom',(req,res)=>{
  connect((db)=>{
      db.collection('room').insertOne(req.body)
  })

  res.status(200).send('ok')
})
app.post('/addbooking',(req,res)=>{
  connect((db)=>{
      db.collection('booking').insertOne(req.body)
  })
  
  res.status(200).send('ok')
})

app.get('/getbooking', (req, res) => {
  connect(async (db)=>{
  
    
    let array = await db.collection('booking').find({}).toArray()

    res.send(array)
 

  })
})
app.get('/getroom', (req, res) => {
  connect(async (db)=>{
  
    
    let array = await db.collection('room').find({}).toArray()

    res.send(array)
 

  })
})
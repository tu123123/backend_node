const express = require('express')
const app = express()
require('dotenv').config()
const port =process.env.PORT|| 3001
var {MongoClient,ObjectId} = require('mongodb');
const cors = require('cors');
var bodyParser = require("body-parser");
const WebSocket = require('ws')
const server = require('http').createServer(app)
const wss=new WebSocket.Server({server:server})
var mongoURL=process.env.mongo_URL
var url= mongoURL||'mongodb://localhost:27017/'
console.log(process.env.mongo_URL)
var Mongoclient=new MongoClient(url);
app.use(cors())
var checksocket=false
let URLAPI=process.env.URL_API


  const connect=( funtion)=>{
    Mongoclient.connect().then( async(b)=>{

      if(b)
      {
        console.log('kết nối thành công'+url)
       await funtion(b.db('roomplan'))
       
      }
      })
  }
  app.use(bodyParser.json({ type: ["application/json", "application/csp-report"] }));
  app.use(express.urlencoded({ extended: false }));
server.listen(port, () => {

})
if(!checksocket){
 app.post('/updatebooking',(req,res)=>{
     
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
}
wss.on('connection', (ws)=>{
   checksocket=true
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

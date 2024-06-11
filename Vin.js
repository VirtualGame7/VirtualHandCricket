
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
var nodemailer = require('nodemailer');
var cors = require('cors')
const bodyParser = require('body-parser');

const uri = "mongodb+srv://VirtualGames:vinay$g9jw7@vinay.qv2pwle.mongodb.net/?retryWrites=true&w=majority&appName=Vinay";
var transporter =nodemailer.createTransport({
  service:'gmail',
  secure : false,
  auth:{
    user:'kaverysree69@gmail.com',
    pass:'itwqyzvwkjkewbpe'
  },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    poolSize:3,
    autoConnect:true,
    reconnectTries:Number.MAX_VALUE,
    reconnectInterval:1000,
  }
});
const app = express();
app.use(cors())
const port = 10000;

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  catch(e){
    console.log("An error occurred");
  }
}
run().catch(console.dir);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get("/",(req,res)=>{
  return res.json({"msg":"Hello"});
});

app.post("/",(req,res)=>{
  return res.json({"msg":"Hello"});
});

app.post('/api/signup',async(req,res)=>{
  try{
  if(!req.body||!req.body.username || !req.body.password ){//if conditon to check if username and stuff exits
    res.status(400);
    return res.json({"msg":"Error: Invalid username or password"});
  }
  const username = req.body.username;
  const password =req.body.password;
  await client.db("admin").command({ ping: 1 });
  const db=client.db("username");//connecting to database
  const collection=db.collection("users");//connecting to collection
  const found= await collection.findOne({"name":username});//searching for the username
  console.log(found);
  if (found===null){//if username not found then addvar currentdate = new Date();
    var currentdate=new Date();
    currentdate=new Date(currentdate.getTime()+1800000);
    var datetime = currentdate.getFullYear() + "-"
    + (currentdate.getMonth()+1)  + "-"
    + currentdate.getDate() + " "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();
    var data = (Math.random().toString(36).substring(2,7))+btoa(datetime);
    await collection.insertOne({"name":username,"password":password,"token":data});//adding the username and password
    res.status(200);
    return res.json({"token":data,"msg":"Success"})
  }
  else{ 
    throw new Error("Couldn't find");
  }  
}
catch(e){
  console.log(e.message);
  res.status(401);
  return res.json({"msg":"Error"})
}

});

app.post('/api/login',async(req,res)=>{
  try{
  if(!req.body||!req.body.username || !req.body.password){//if conditon to check if username and stuff exits
    res.status(400);
    return res.json({"msg":"Error: Invalid username or password"});
  }
  const rem=req.body.rem;
  const username = req.body.username;
  const password =req.body.password;
  await client.db("admin").command({ ping: 1 });
  const db=client.db("username");//connecting to database
  const collection=db.collection("users");//connecting to collection
  const found= await collection.findOne({"name":username});//searching for the username
  var currentdate=new Date();
    currentdate=new Date(currentdate.getTime()+1800000);
  if (found!=null && password.localeCompare(found["password"])===0){
    var datetime = currentdate.getFullYear() + "-"
    + (currentdate.getMonth()+1)  + "-"
    + currentdate.getDate() + " "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();
    var data = (Math.random().toString(36).substring(2,7));
    if (rem) { data=data+btoa("inf");}
    else{data=data+btoa(datetime);}
    var newvalues = { $set: { token: data } };
    await collection.updateOne({"name":username},newvalues,{ upsert: false});
    res.status(200);
    return res.json({"token":data,"msg":"Success"})
  }
  else{
    throw new Error("Couldn't find");
  }
  
}
catch(e){
  console.log(e.message);
  res.status(404);
  return res.json({"msg":"Error"});
}
});


app.post('/api/logout',async(req,res)=>{
  try{
  if(!req.body||!req.body.username || !req.body.token){//if conditon to check if username and stuff exits
    res.status(400);
    return res.json({"msg":"Error: Invalid username or token"});
  }
  const username = req.body.username;
  const token =req.body.token;
  await client.db("admin").command({ ping: 1 });
  const db=client.db("username");//connecting to database
  const collection=db.collection("users");//connecting to collection
  const found= await collection.findOne({"name":username});//searching for the username
  if (found!=null && token.localeCompare(found["token"])===0){
    var newvalues = { $set: { token: "" } };
    await collection.updateOne({"name":username},newvalues,{ upsert: false});
    res.status(200);
    return res.json({"msg":"Success"})
  }
  else{
    throw new Error("Couldn't find");
  }
  
}
catch(e){
  console.log(e.message);
  res.status(401);
  return res.json({"msg":"Error"});
}
});

app.post('/api/delete',async(req,res)=>{
  try{
  if(!req.body||!req.body.username || !req.body.password){//if conditon to check if username and stuff exits
    res.status(400);
    return res.json({"msg":"Error: Invalid username or password"});
  }
  const rem=req.body.rem;
  const username = req.body.username;
  const password =req.body.password;
  await client.db("admin").command({ ping: 1 });
  const db=client.db("username");//connecting to database
  const collection=db.collection("users");//connecting to collection
  const found= await collection.findOne({"name":username});//searching for the username
  if (found!=null && password.localeCompare(found["password"])===0){
    await collection.deleteOne({"name":username});
    res.status(200);
    return res.json({"msg":"Success"})
  }
  else{
    throw new Error("Couldn't find");
  }
  
}
catch(e){
  console.log(e.message);
  res.status(401);
  return res.json({"msg":"Error"});
}
});

app.post('/api/check',async(req,res)=>{
  try{
  if(!req.body||!req.body.username || !req.body.token){//if conditon to check if username and stuff exits
    res.status(400);
    return res.json({"msg":"Error: Invalid username or token"});
  }
  const username = req.body.username;
  const token =req.body.token;
  await client.db("admin").command({ ping: 1 });
  const db=client.db("username");//connecting to database
  const collection=db.collection("users");//connecting to collection
  const found= await collection.findOne({"name":username});//searching for the username
  if (found!=null && found.token.localeCompare(token)===0 && (atob((found.token).substring(5)).localeCompare("inf")===0 || new Date(atob((found.token).substring(5)))>new Date()) ){
    res.status(200);
    return res.json({"msg":"Success"})
  }
  else{
    throw new Error("Couldn't find");
  }
  
}
catch(e){
  console.log(e.message);
  res.status(401);
  return res.json({"msg":"Invalid details"});
}
});

app.post('/api/watchhistory',async(req,res)=>{
  try{
  if(!req.body||!req.body.username || !req.body.token || !req.body.watch){//if conditon to check if username and stuff exits
    res.status(400);
    return res.json({"msg":"Error: Invalid username or token"});
  }
  const watch=req.body.watch;
  const username = req.body.username;
  const token =req.body.token;
  await client.db("admin").command({ ping: 1 });
  const db=client.db("username");//connecting to database
  const collection=db.collection("users");//connecting to collection
  const found= await collection.findOne({"name":username});//searching for the username
  if (found!=null && found.token.localeCompare(token)===0 && (atob((found.token).substring(5)).localeCompare("inf")===0 || new Date(atob((found.token).substring(5)))>new Date()) ){
    if(found['wacthhistory']!=null){
      var watchhist=found['wacthhistory'];
      watchhist.push(watch);
      var newvalues = { $set: { wacthhistory: watchhist } };
      await collection.updateOne({"name":username},newvalues,{ upsert: false});
    }
    else{
      var newvalues = { $set: { wacthhistory: [watch] } };
      await collection.updateOne({"name":username},newvalues,{ upsert: false});
    }
    res.status(200);
    return res.json({"msg":"Success"})
  }
  else{
    throw new Error("Couldn't find");
  }
  
}
catch(e){
  console.log(e.message);
  res.status(404);
  return res.json({"msg":"Invalid details"});
}
});

app.get('/api/watchhistory',async(req,res)=>{
  try{
    if (!req.query.username || !req.query.token ){//if conditon to check if username and stuff exits
    res.status(400);
    return res.json({"msg":"Error: Invalid username or token"});
    }
    const username = req.query.username;
    const token =req.query.token;
    await client.db("admin").command({ ping: 1 });
    const db=client.db("username");//connecting to database
    const collection=db.collection("users");//connecting to collection
    const found= await collection.findOne({"name":username});//searching for the username
    if (found!=null && found.token.localeCompare(token)===0 && (atob((found.token).substring(5)).localeCompare("inf")===0 || new Date(atob((found.token).substring(5)))>new Date()) ){
      res.status(200);
      const j={"msg":"Success","watchhistory":found['wacthhistory']};
      return res.json(j);
    }
    else{
      throw new Error("Couldn't find");
    }
  }
  catch(e){
    console.log(e.message);
    res.status(404);
    return res.json({"msg":"Invalid details"});
  } 
});

app.post('/api/addinfo',async(req,res)=>{
  try{
  if(!req.body||!req.body.username || !req.body.token || !req.body.number || !req.body.email || !req.body.name ){//if conditon to check if username and stuff exits
    res.status(400);
    return res.json({"msg":"Error: Invalid username or token"});
  }
  const username = req.body.username;
  const token =req.body.token;
  const number = req.body.number;
  const email =req.body.email;
  const name = req.body.name;
  await client.db("admin").command({ ping: 1 });
  const db=client.db("username");//connecting to database
  const collection=db.collection("users");//connecting to collection
  const found= await collection.findOne({"name":username});//searching for the username
  if (found!=null && found.token.localeCompare(token)===0 && (atob((found.token).substring(5)).localeCompare("inf")===0 || new Date(atob((found.token).substring(5)))>new Date()) ){

    var newvalues = { $set: { fullname: name, number: number, email: email } };
    await collection.updateOne({"name":username},newvalues,{ upsert: false});
    res.status(200);
    return res.json({"msg":"Success"})
  }
  else{
    throw new Error("Couldn't find");
  }
  
}
catch(e){
  console.log(e.message);
  res.status(404);
  return res.json({"msg":"Invalid details"});
}
});

app.post('/api/updatemail',async(req,res)=>{
  try{
  if(!req.body||!req.body.username || !req.body.token ||  !req.body.email  ){//if conditon to check if username and stuff exits
    res.status(400);
    return res.json({"msg":"Error: Invalid username or token"});
  }
  const username = req.body.username;
  const token =req.body.token;
  const email =req.body.email;
  await client.db("admin").command({ ping: 1 });
  const db=client.db("username");//connecting to database
  const collection=db.collection("users");//connecting to collection
  const found= await collection.findOne({"name":username});//searching for the username
  if (found!=null && found.token.localeCompare(token)===0 && (atob((found.token).substring(5)).localeCompare("inf")===0 || new Date(atob((found.token).substring(5)))>new Date()) ){

    var newvalues = { $set: { email: email } };
    await collection.updateOne({"name":username},newvalues,{ upsert: false});
    res.status(200);
    return res.json({"msg":"Success"})
  }
  else{
    throw new Error("Couldn't find");
  }
  
}
catch(e){
  console.log(e.message);
  res.status(404);
  return res.json({"msg":"Invalid details"});
}
});

app.post('/api/updatename',async(req,res)=>{
  try{
  if(!req.body||!req.body.username || !req.body.token || !req.body.name ){//if conditon to check if username and stuff exits
    res.status(400);
    return res.json({"msg":"Error: Invalid username or token"});
  }
  const username = req.body.username;
  const token =req.body.token;
  const name = req.body.name;
  await client.db("admin").command({ ping: 1 });
  const db=client.db("username");//connecting to database
  const collection=db.collection("users");//connecting to collection
  const found= await collection.findOne({"name":username});//searching for the username
  if (found!=null && found.token.localeCompare(token)===0 && (atob((found.token).substring(5)).localeCompare("inf")===0 || new Date(atob((found.token).substring(5)))>new Date()) ){

    var newvalues = { $set: { fullname: name } };
    await collection.updateOne({"name":username},newvalues,{ upsert: false});
    res.status(200);
    return res.json({"msg":"Success"})
  }
  else{
    throw new Error("Couldn't find");
  }
  
}
catch(e){
  console.log(e.message);
  res.status(404);
  return res.json({"msg":"Invalid details"});
}
});

app.post('/api/updatenumber',async(req,res)=>{
  try{
  if(!req.body||!req.body.username || !req.body.token || !req.body.number ){//if conditon to check if username and stuff exits
    res.status(400);
    return res.json({"msg":"Error: Invalid username or token"});
  }
  const username = req.body.username;
  const token =req.body.token;
  const number = req.body.number;
  await client.db("admin").command({ ping: 1 });
  const db=client.db("username");//connecting to database
  const collection=db.collection("users");//connecting to collection
  const found= await collection.findOne({"name":username});//searching for the username
  if (found!=null && found.token.localeCompare(token)===0 && (atob((found.token).substring(5)).localeCompare("inf")===0 || new Date(atob((found.token).substring(5)))>new Date()) ){

    var newvalues = { $set: {number: number } };
    await collection.updateOne({"name":username},newvalues,{ upsert: false});
    res.status(200);
    return res.json({"msg":"Success"})
  }
  else{
    throw new Error("Couldn't find");
  }
  
}
catch(e){
  console.log(e.message);
  res.status(404);
  return res.json({"msg":"Invalid details"});
}
});

app.post('/api/forgotpass',async(req,res)=>{
  try{
  if(!req.body||!req.body.username ){//if conditon to check if username and stuff exits
    res.status(400);
    return res.json({"msg":"Error: Invalid username"});
  }
  const username = req.body.username;
  await client.db("admin").command({ ping: 1 });
  const db=client.db("username");//connecting to database
  const collection=db.collection("users");//connecting to collection
  const found= await collection.findOne({"name":username});//searching for the username
  if (found!=null && found["email"]!=null){

    var currentdate=new Date();
    currentdate=new Date(currentdate.getTime()+300000);
    var datetime = currentdate.getFullYear() + "-"
    + (currentdate.getMonth()+1)  + "-"
    + currentdate.getDate() + " "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();
    var data = (Math.random().toString(36).substring(2,7))+btoa(datetime);
    var mailOptions ={
      from:'kaverysree69@gmail.com',
      to:found["email"],
      subject:'Change Password',
      text:'OTP= '+data.substring(0,5)
    };
    var newvalues = { $set: { otp: data } };
    await collection.updateOne({"name":username},newvalues,{ upsert: false});
    transporter.sendMail(mailOptions,function(err,info){
      if(err){
        console.log(err);
      } else {
        console.log(info.response);
      }
    });
    res.status(200);
    return res.json({"msg":"Success"})
  }
  else{
    throw new Error("No email linked with profile");
  }
}
catch(e){
  console.log(e.message);
  res.status(404);
  return res.json({"msg":"No email linked with profile"});
}
});

app.post('/api/updatepass',async(req,res)=>{
  try{
  if(!req.body||!req.body.username || !req.body.otp || !req.body.password){//if conditon to check if username and stuff exits
    res.status(400);
    return res.json({"msg":"Error: Invalid username or otp"});
  }
  const password = req.body.password;
  const username = req.body.username;
  const otp =req.body.otp;
  await client.db("admin").command({ ping: 1 });
  const db=client.db("username");//connecting to database
  const collection=db.collection("users");//connecting to collection
  const found= await collection.findOne({"name":username});//searching for the username
  if (found!=null && found.otp.substring(0,5).localeCompare(otp)===0 && (new Date(atob((found.otp).substring(5)))>new Date()) ){
    var newvalues = { $set: { password: password } };
    await collection.updateOne({"name":username},newvalues,{ upsert: false});
    res.status(200);
    return res.json({"msg":"Success"})
  }
  else{
    throw new Error("Couldn't find");
  }
  
}
catch(e){
  console.log(e.message);
    res.status(401);
  return res.json({"msg":"Invalid otp"});
}
});

app.listen(port,()=> {
  console.log("Server listening on port " + port);
});

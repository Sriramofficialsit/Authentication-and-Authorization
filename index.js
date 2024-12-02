const Express = require('express');
const app = Express();


const auth = require('./controller/auth.controller')
require('dotenv').config();

const {dbconnect} = require('./config/db');
app.use(Express.json());

dbconnect();

app.use("/auth",auth);


app.listen(process.env.PORT,process.env.HOSTNAME,function(){
    console.log("server started");
    console.log(`http://${process.env.HOSTNAME}:${process.env.PORT}`);
})


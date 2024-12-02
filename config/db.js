const mongoose  = require('mongoose');
require('dotenv').config();

async function dbconnect(){
    
    // const mongodb_uri = process.env.MONGODB_URI;
    const mongodb_uri = "mongodb://127.0.0.1:27017/recipes";
    try{
        await mongoose.connect(mongodb_uri);
        console.log("DB connected sucessfully");
    }catch(error){
        console.log(error);
        console.log("Error in connecting DB")
    }
}

module.exports = {dbconnect}
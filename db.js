const mongoose = require("mongoose");
require('dotenv').config();

const DB_URI="mongodb://localhost:27017/Voting";

const connectDatabase = async ()=>{
        await mongoose.connect(DB_URI,{
    }).then(
            (data)=>{
            console.log(`mongodb connected with server: ${data.connection.host}`);
        }).catch((err)=>{
            console.log(err)
        })
}
module.exports=connectDatabase;
const mongoose  = require("mongoose")
const dotenv = require("dotenv");
dotenv.config();
async function Connectmongodb(dbUrl) {
    return mongoose
        .connect(dbUrl,{
            useNewUrlParser : true,
            useUnifiedTopology : true
        })
        .then(()=>{console.log("mongo db connected")})
        .catch((err)=>{console.log("mongo error",err)})
}
module.exports = Connectmongodb;

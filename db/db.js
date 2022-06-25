const url = "mongodb+srv://vimal:vimal1234@cluster0.ferio.mongodb.net/?retryWrites=true&w=majority"

const mongoose  =  require('mongoose');
module.exports= {
    connectDb:async()=>{
        await mongoose.connect(url,{
            useNewUrlParser: true, 
            useUnifiedTopology: true
        },(err,res)=>{
            if(err){
                console.log(err+"cant connect to database")
            }else{
                console.log("successfully connected to database");
            }
        })
    }
}

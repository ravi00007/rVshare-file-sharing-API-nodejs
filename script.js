const File =  require("./models/schema");
const fs =  require('fs');
const connectDB =require('./config/db');

//database connection
connectDB();

async function deleteData(){
    // substracting 24hr in currnet time 
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
  // fetching all file which has been expired(exceded 24hr)
    const files = await  File.find({createdAt: {$lt:pastDate}})

    if(files.length){
       for(const file of files){
        try{
            fs.unlinkSync(file.path);
            await file.remove();
            console.log(`succefully removed ${file.filename}`);
        }catch(err){ 
            console.log("somting went wrong while deleting");
        }
       }
       console.log('Job Done!')
    }
}
deleteData().then(process.exit)
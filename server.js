const exprees = require("express");
const app = exprees();
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT || 3000;

const connectDB =  require('./config/db');

connectDB();
// app.use(cors())
// // cors
// const corsOptions ={
//     orign:process.env.ALLOWED_CLIENTS.split(',')
//     // ['http://localhost:3000','http://localhost:5000']
// }
app.use(exprees.static('public'))
//Template Engine
app.set('views',path.join(__dirname,'/views'));

app.set('view engine', 'ejs');

app.use(exprees.json());
//Routes 
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));
app.listen(PORT,()=>{
    console.log(`listing on port ${PORT}`)
}) 


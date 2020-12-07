const router = require('express').Router();
const multer =  require('multer');
const path = require("path");
const File =  require("../models/schema");
const {v4: uuid4} = require('uuid');

let storage = multer.diskStorage({
    destination:(req, file , cb ) => cb(null,"uploads/"),
    filename: (req, file , cb)=>{
        const uniquename =  `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null,uniquename);
    }
})

let upload =  multer({
    storage:storage,
    limits: {fileSize:1000000 * 100}
}).single('myfile');

router.post('/',(req,res,next)=>{
   
    //store file
   upload(req, res, async(err)=>{
        //validate request
     if(!req.file){
        return res.json({ error : 'All fields are required.'});
    }
     if(err){
         res.status(500).send({error: err.message})
     }
   //store into database
     const file  = new File({
         filename:req.file.filename,
         uuid : uuid4(),
         path:req.file.path,
         size:req.file.size, 
     })
     const  response = await file.save();
     return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`})
  
    })


    //Response -> link

})

router.post('/send',async(req,res)=>{
    const {uuid , emailTo , emailFrom } = req.body;
    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error:"All fields are required"})
    }
    //get data from database

    const file = await File.findOne({uuid:uuid});
    if(file.sender){
        return res.status(422).send({error:"Email Already Sent"})
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    
    //send email
    const sendmail = require('../services/emailService');
    sendmail({
        from:emailFrom,
        to:emailTo,
        subject: "rVshare File Sharing",
        text:`${emailFrom} shared a file with you`,
        html: require('../services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000) + 'KB',
            expires:"24 hours"
        })
    })
    res.send({success:true})

})
module.exports = router;

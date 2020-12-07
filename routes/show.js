const router =  require("express").Router()
const File =  require('../models/schema');

router.get('/:uuid',async(req,res)=>{
 
    try{

    const file = await File.findOne({uuid: req.params.uuid});
    if(!file){
        return res.render('dowload',{error:"Link has been expired"});
    }
    return res.render('download',{
        uuid:file.uuid,
        fileName:file.filename,
        fileSize:file.size,
        downloadLink:`${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        //http://localhost:3000/files/download/kjskf-lmlgml-lkmk
    })
   }catch(err){
       return res.render('dowload',{error:"somting went wrong"});
   }
   


})


module.exports = router;

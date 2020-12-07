const router = require('express').Router()
const File = require('../models/schema');

router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) {
            res.render("download", { error: "Link has been expire" })
        }
        const filepath = `${__dirname}/../${file.path}`
        res.download(filepath)
    } catch (err) {
        console.log("somthing went wrong")
    }
})

module.exports = router
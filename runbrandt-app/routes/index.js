const express = require('express');
const router  = express.Router();
const Run = require('../models/Run')
const fileUploader = require('../configs/cloudinary')


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/admin/runs', (req, res, next) => {
  Run.find()
    .then(runDocs => {
      res.render('admin/runs', {runDocs});
    }) 
});

router.post('/admin/runs', fileUploader.single('image'), (req, res, next) => {
    const { name, kilometers, location } = req.body
    console.log(name, kilometers, location)

    Run.create({
      name,
      kilometers,
      location,
      imageUrl: req.file.path
    })
    .then(run => {
      res.redirect('/admin/runs')
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router;

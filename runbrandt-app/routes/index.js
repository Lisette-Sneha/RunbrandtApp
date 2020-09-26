const express = require('express');
const router = express.Router();
const Run = require('../models/Run')
const fileUploader = require('../configs/cloudinary')


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/admin/runs', (req, res, next) => {
  Run.find()
    .then(runDocs => {
      res.render('admin/runs', { runDocs });
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

router.get('/admin/runs/:id', (req, res, next) => {
  const { id } = req.params
  Run.findById(req.params.id)
    .then(run => {
      console.log(run)
      res.render('admin/rundetails', run)
    })
    .catch(err => {
      next(err)
    })
})

router.get('/edit/:id', (req, res, next) => {
  Run.findById(req.params.id)
    .then(run => {
      res.render('admin/rundetails', run)
    })
    .catch(err => {
      next(err)
    })
})

router.post('/edit/:id', (req, res, next) => {
  const { kilometers, name, location } = req.body
  Run.findByIdAndUpdate({ _id: req.params.id }, { $set: { kilometers, name, location } }, { new: true })
    .then(() => {
      res.redirect('/admin/runs')
    })
    .catch(err => {
      next(err)
    })
})

router.get('/delete/:id', (req, res, next) => {
  Run.deleteOne({ _id: req.params.id })
    .then(results => {
      res.redirect('/admin/runs')
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router;

const express = require('express');
const router = express.Router();
const Run = require('../models/Run')
const fileUploader = require('../configs/cloudinary')
const nodemailer = require('nodemailer')
const axios = require('axios');
const Instarun = require('../models/Instarun');
const { findOne } = require('../models/Run');
console.log(process.env.USER)
console.log(process.env.PASS)

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAILUSER,
    pass: process.env.GMAILPASS
  }
})


/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    let postId
    const instaPost = await Instarun.find()
    if (!instaPost[0]) {
      postId = 'CCRRRmPH-Is'
    }
    else {
      postId = instaPost[0].postId
    }
    const responseFromApi = await axios.get(`https://graph.facebook.com/v8.0/instagram_oembed?url=https://www.instagram.com/p/${postId}/&access_token=1748054368676135|OsSRw10IqMrFNC7KD55g6Zr3W5Y`)
    res.render('index', { instaFeed: responseFromApi.data.html })
  }
  catch (error) {
    next(error)
  }
})


router.get('/admin/runs', (req, res, next) => {
  console.log('checking this part')
  console.log(req.session.currentUser)
  if (req.session.user) {
    Run.find()
      .then(runDocs => {
        res.render('admin/runs', { runDocs });
      })
  } else {
    res.redirect('/')
  }
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

router.post('/send-email', (req, res, next) => {
  const { clientname, clientemail, clientphone, message } = req.body;
  console.log(req.body)
  res.render('message', { clientname, clientemail, clientphone, message })
  transporter.sendMail({
    from: '"My Awesome Project " <myawesome@project.com>',
    to: process.env.GMAILUSER,
    subject: `new request from ${clientname}`,
    text: 'texting',
    html: `<b>${message} ${clientname} ${clientemail} ${clientphone}</b>`
  })
    .then(info => res.render('message', { clientname, clientemail, clientphone, message }))
    .catch(error => console.log(error));
});

router.get('/admin/instaposts', (req, res, next) => {
  if (req.session.user) {
    res.render('admin/instaposts');
  } else {
    res.redirect('/')
  }
})

router.post('/admin/instaposts', async (req, res, next) => {
  const { postIdFromUser } = req.body
  try {
    const document = await Instarun.find()
    console.log(document)
    if (document.length == 0) {
      console.log('document does not exist fuck')
      await Instarun.create({
        postId: postIdFromUser
      })
      res.redirect('/')
    }
    else {
      await Instarun.remove()
      await Instarun.create({
        postId: postIdFromUser
      })
      res.redirect('/')
      // console.log(postIdFromUser)
      // await Instarun.findOneAndUpdate({ postId:postIdFromUser }, {postId:postIdFromUser})
      // console.log('the document exists already') 
    }
  }
  catch (error) {
    next(error)
  }
})

module.exports = router;

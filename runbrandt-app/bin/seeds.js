const mongoose = require('mongoose')
const Run = require('../models/Run')

const runDocs = [{
    name: 'Squirrel',
    kilometers: '20,1',
    location: 'Amstelveen'
}]

mongoose
    .connect('mongodb://localhost/runbrandt', { useNewUrlParser: true })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
        return Run.insertMany(runDocs)
    })
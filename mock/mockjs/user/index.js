const router = require('express').Router()
const Mock = require('mockjs')
const utils = require('../utils')

router.get('/login.do', function (req, res) {
  var json = utils.getJsonFile('./data/login.json', __dirname)
  res.json(Mock.mock(json))
})
module.exports = router

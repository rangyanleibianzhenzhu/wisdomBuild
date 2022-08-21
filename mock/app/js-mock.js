/**
 * js方式模拟接口
 * @see http://mockjs.com/0.1/
 * @see http://mockjs.com/examples.html
 */
const router = require('express').Router()
const sysRouter = require('../mockjs/sys')
const userRouter = require('../mockjs/user')

router.use('/sys', sysRouter)
router.use('/user', userRouter)
module.exports = router

const router = require('express').Router()

// 登录
router.post('/login', function (req, res) {
  res.cookie('session_id', 'mock', {
    path: '/',
    maxAge: 30 * 60 * 1000, // 有效期30分（单位为毫秒）
    httpOnly: true
  })
  if (req.body.isRemember) {
    let rememberToken = 'W1s3N10sIiQyYSQxMCRCSm5lM2JK' // 将账号、密码、有效期等信息加密生成token
    res.cookie('remember_token', rememberToken, {
      path: '/',
      maxAge: 3 * 24 * 60 * 60 * 1000, // 有效期3天（单位为毫秒）
      httpOnly: true
    })
  }
  res.json({ code: 200, message: '操作成功' })
})

// 退出
router.post('/logout', function (req, res) {
  res.cookie('session_id', '', {
    maxAge: 0
  })
  res.cookie('remember_token', '', {
    maxAge: 0
  })
  res.json({ code: 200, message: '操作成功' })
})
module.exports = router

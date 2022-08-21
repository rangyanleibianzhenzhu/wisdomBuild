/**
 * 系统数据用例
 * 
 * @date 2020/12/10
 */
const sysCases = {
  // 系统 - 未登录
  'notLogin': {
    '/api/user/getUser': 'unauthorized'
  },
  // 系统 - 管理员登录
  'adminLogin': {
    '/api/user/getUser': 'admin'
  },
  // 系统 - 获取角色异常
  'roleError': {
    '/api/role/$': 'error'
  }
}

module.exports = sysCases

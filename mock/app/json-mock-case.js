/**
 * 数据用例
 */
const sysCases = require('./cases/sysCases.js')

module.exports = {
  // 当前用例
  curCases: [
    /* 'notLogin' */
  ],
  // 数据用例组
  casesGroups: [
    /**
     * key: 用例名称
     * value: 用例对象，示例：{ '/api/role/$': 'error'}
     *    key: 请求路径（如果最后一级是动态参数，用“$”代替，例如：'/api/role/$'）
     *    value: json文件后缀
     *       例如：'error'
     *       说明：返回 /api/role/$_error.json 文件的数据
     */
    sysCases // 系统相关数据用例
  ],
  // 获取指定用例
  getCase (caseName) {
    for (let i = 0; i < this.casesGroups.length; i++) {
      let group = this.casesGroups[i]
      if (group[caseName]) {
        return group[caseName]
      }
    }
    return null
  }
}

// 菜单数组
const menus = [
  {
    id: '01', // 菜单ID
    name: '首页', // 菜单名称
    url: '/layout/home', // 页面路由
    icon: 'home', // 图标名称(即对应 assets/icon 目录下 .svg 文件的名称 )
    exact: true, // 路由是否精确匹配
    cache: true // 是否缓存（默认为：true）
  },
  {
    id: '02',
    name: 'SVG图标',
    url: '/layout/icon',
    icon: 'icon'
  },
  {
    id: '03',
    name: '滚动条',
    url: '/layout/scroll',
    icon: 'info'
  }
]

export default menus

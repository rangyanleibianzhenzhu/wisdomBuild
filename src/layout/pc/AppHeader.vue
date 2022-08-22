<template>
  <header class="app-header">
    <h2 class="title">中核二二党建云平台</h2>
    <ul class="menu-list">
      <template v-for="menu in menus">
        <router-link tag="li" 
          :key="menu.id" 
          :data-id="menu.id"
          :exact="menu.exact"
          :to="menu.url"
          :class="menu.class">
          {{menu.name}}
        </router-link>
      </template>
    </ul>
    <span class="time">{{ todayTime | dateTime}}{{' '+ todayDay}}</span>
  </header>
</template>
<script>
export default {
  name: 'AppHeader',
  components: {},
  props: {
  },
  data () {
    return {
      // 菜单信息
      menus: [
        {
          id: '1', // 菜单ID
          class: 'button1',
          name: '首页', // 菜单名称
          url: '/layout/home', // 页面路由
          exact: true, // 路由是否精确匹配
          cache: true // 是否缓存（默认为：true）
        },
        {
          id: '2',
          class: 'button2',
          name: '党费情况',
          url: '/layout/dangCost',
        },
        {
          id: '3',
          class: 'button3',
          name: '二级单位',
          url: '/layout/secondLevel'
        },
        {
          id: '4',
          class: 'button4',
          name: '党建活动',
          url: '/layout/dangActivity'
        },
      ],
      todayTime: new Date(),
      todayDay: '星期'+"日一二三四五六".charAt(new Date().getDay())
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
@font-face{
  font-family: PangMenZhengDao;
  src: url('../../assets/font/PangMenZhengDao.ttf');
}
.app-header {
  position: absolute;
  left: 0;
  top: 3px;
  right: 0;
  height: 120px;
  background: url("../../assets/img/toubu.png") center 0 no-repeat;
  background-size: cover;
  h2.title{
    font-family: 'PangMenZhengDao';
    font-weight: 400;
    font-size: 65px;
    color: #FFE7B4;
    letter-spacing: 4px;
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .time{
    position: absolute;
    top: 50px;
    right: 20px;
    font-size: 20px;
    color: #FFE7B4;
    letter-spacing: 0;
    line-height: 26px;
    font-weight: 700;
  }
  ul.menu-list {
    height: 100%;
    margin: 0 245px;
    list-style: none;
    li {
      font-size: 40px;
      color: #D1997E;
      line-height: 40px;
      font-weight: 700;
      text-align: center;
      line-height: $app-header-height;
      display: inline-block;
    }
    .button1{
      width: 200px;
      height: 100%;
      background: url("../../assets/img/button1.png") center no-repeat;
      background-size: 113%;
      &.active {
        background: url("../../assets/img/button1checked.png") center no-repeat;
        background-size: 113%;
      }
    }
    .button2{
      width: 200px;
      height: 100%;
      background: url("../../assets/img/button2.png") center no-repeat;
      background-size: 100%;
      margin-right: 520px;
      margin-left: -25px;
      &.active {
        background: url("../../assets/img/button2checked.png") center no-repeat;
        background-size: 100%;
      }
    }
    .button3{
      width: 200px;
      height: 100%;
      background: url("../../assets/img/button3.png") center no-repeat;
      background-size: 100%;
      &.active {
        background: url("../../assets/img/button3checked.png") center no-repeat;
        background-size: 100%;
      }
    }
    .button4{
      width: 200px;
      height: 100%;
      background: url("../../assets/img/button4.png") center no-repeat;
      background-size: 100%;
      margin-left: -30px;
      &.active {
        background: url("../../assets/img/button4checked.png") center no-repeat;
        background-size: 100%;
      }
    }
  }
}
</style>

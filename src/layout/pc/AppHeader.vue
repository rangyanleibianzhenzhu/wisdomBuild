<template>
  <header class="app-header" :class="{'hidden': fullScreen}">
    <ul class="buttonBox">
      <li class="button1">首页</li>
      <li class="button2">党费情况</li>
      <li class="title">中核二二党建云平台</li>
      <li class="button3">二级单位</li>
      <li class="button4">党建活动</li>
    </ul>
  </header>
</template>
<script>
import AppBreadcrumb from './AppBreadcrumb.vue'
import { mapGetters } from 'vuex'
import clientDetect from '@/assets/js/clientDetect.js'
import JSONFormat from '@/assets/js/jsonFormat.js'

export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb
  },
  props: {
    foldMenu: Boolean,
    fullScreen: Boolean
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    // 获取用户姓名
    /* this.$apiPost({
      url: '/user/getUser',
      apiType: 'api'
    }).then(res => {
      this.userName = res.name
    }) */
  },
  methods: {
    // 菜单切换
    menuToggle () {
      this.$eventBus.$emit('fold-menu', !this.foldMenu)
    },
    // 退出
    logout () {
      this.$apiPost({
        url: '/api/sys/logout'
      }).then(res => {
        this.$router.push('/login')
      })
    },
    // 跳转到移动版页面
    goToMobilePage () {
      this.$router.push('/m')
    },
    // 检测客户端信息
    detectClient () {
      const clientInfo = clientDetect()
      this.$popup({
        title: '客户端信息',
        html: new JSONFormat(clientInfo).toString(),
        width: 400,
        height: 500,
        contentWrapperStyle: { padding: '20px' }
      })
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
@font-face{
  font-family: PangMenZhengDao;
  src: url('../../assets/font/PangMenZhengDao.ttf');
}
.app-header {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  min-width: $app-min-width;
  height: $app-header-height;
  background: url("../../assets/img/toubu.png") no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  ul.buttonBox {
    height: 100%;
    li {
      font-size: 22px;
      color: #D1997E;
      line-height: 30px;
      font-weight: 700;
      display: inline-block;
    }
    .title{
      font-family: 'PangMenZhengDao';
      
      font-size: 48px;
      color: #FFE7B4;
      letter-spacing: 4px;
      text-align: center;
    }
    .button1{
      width: 100px;
      height: 100%;
      text-align: center;
      line-height: $app-header-height;
      background: url("../../assets/img/button1.png") center no-repeat;
      background-size: 100%;
    }
    .button2{
      width: 100px;
      height: 100%;
      text-align: center;
      line-height: $app-header-height;
      background: url("../../assets/img/button2.png") center no-repeat;
      background-size: 100%;
    }
    .button3{
      width: 100px;
      height: 100%;
      text-align: center;
      line-height: $app-header-height;
      background: url("../../assets/img/button3.png") center no-repeat;
      background-size: 100%;
    }
    .button4{
      width: 100px;
      height: 100%;
      text-align: center;
      line-height: $app-header-height;
      background: url("../../assets/img/button4.png") center no-repeat;
      background-size: 100%;
    }
  }
  


  
  .left {
    float: left
  }

  .logo {
    @include primary-font-color();
    width: $app-menu-width;
    height: 100%;
    line-height: $app-header-height;
    background-color: #002040;
    font-size: 28px;
    text-align: center;
    box-shadow: 2px 0 6px rgba(0,21,41,.35);
    overflow: hidden;
    transition: width .2s ease;
    transition-delay: .1s;
    .fa-icon {
      vertical-align: -5%;
    }
    .sys-name {
      display: inline-block;
      margin: 0 30px 0 10px;
      padding: 0;
      line-height: $app-header-height;
      vertical-align: 10%;
      color: #FFF;
      font-size: 18px;
      white-space: nowrap;
    }
    &.fold {
      width: $app-menu-fold-width;
    }
  }

  .menu-switch {
    @include primary-font-color();
    display: inline-block;
    width: 50px;
    height: 100%;
    line-height: $app-header-height;
    font-size: 20px;
    text-align: center;
    transition: .2s ease-out;
    transition-delay: .1s;
    >svg {
      vertical-align: -6%;
    }
  }

  .right {
    float: right;
    display: flex;
    .icon-button {
      cursor: default;
      >.icon {
        @include primary-font-color();
      }
      .icon{
        margin: 0 5px;
        width: 1em;
        vertical-align: middle;
      }
      span {
        min-width: 20px;
        font-size: 14px;
        vertical-align: middle;
      }
    }
    .mobile, .client-info {
      position: relative;
      display: inline-block;
      padding: 0;
      margin-right:15px;
      font-size: 20px;
      vertical-align: middle;
      line-height: $app-header-height;
      opacity: 1;
      transition: .1s ease-out;
      transition-delay: .2s;
    }
    .user{
      position: relative;
      display: inline-block;
      padding: 0;
      margin-right:32px;
      font-size: 18px;
      line-height: $app-header-height;
      opacity: 1;
      transition: .1s ease-out;
      transition-delay: .2s;

      .logout {
        padding: 0 10px;
        position: absolute;
        top: 35px;
        right: 0;
        height: 0;
        width: 80px;
        overflow-y: hidden;
        line-height: 40px;
        text-align: center;
        background-color: #FFF;
        color: #666;
        border-radius: 5px;
        box-shadow: 0 0 3px rgba(0, 0, 0, .3);
        opacity: 0;
        z-index: 999;
        cursor: pointer;
      }
      &:hover {
        .logout {
          opacity: 1;
          top: 45px;
          height: auto;
          transition: 300ms;
        }
      }
    }
  }

  &.hidden {
    overflow: hidden;
    height: 0;
    .logo {
      width: 0;
      .sys-name {
        opacity: 0;
      }
    }
    .user, .menu-switch, .mobile, ::v-deep .breadcrumb {
      margin-top: -30px;
      opacity: 0;
      transition-delay: 0s;
    }
  }
}
</style>

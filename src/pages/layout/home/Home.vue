<template>
  <div class="home">
    <div class="top">
      <div class="left">
        <ModuleTit title="党员队伍情况"></ModuleTit>
        <Sex></Sex>
        <Education></Education>
        <Age></Age>
      </div>
      <div class="middle">
        <MapData></MapData>
      </div>
      <div class="right">
        <ModuleTit title="正式党员党龄情况"></ModuleTit>
        <FormalDangAge></FormalDangAge>
        <ModuleTit title="党员发展情况"></ModuleTit>
        <DangDev></DangDev>
      </div>
    </div>
    <div class="bottom">
      <ModuleTit title="党员流动性展示"></ModuleTit>
      <DangFlow></DangFlow>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import ModuleTit from '@/components/pc/moduleTit'
import Sex from './components/Sex.vue'
import Education from './components/Education.vue'
import Age from './components/Age.vue'
import MapData from './components/MapData.vue'
import FormalDangAge from './components/FormalDangAge.vue'
import DangDev from './components/DangDev.vue'
import DangFlow from './components/DangFlow.vue'

/* eslint-disable no-undef */
const indexPath = APP_INDEX_PATH // 项目根路径（由webpack的插件DefinePlugin注入）

export default {
  name: 'Home',
  components: {
    ModuleTit,
    Sex,
    Education,
    Age,
    MapData,
    FormalDangAge,
    DangDev,
    DangFlow,
  },
  data () {
    return {
      content: ''
    }
  },
  created () {
    // this.getContent()
  },
  mounted () {},
  methods: {
    getContent () {
      axios({
        method: 'get',
        url: `${indexPath}static/readme/index.md`
      }).then(
        res => {
          this.content = res.data
        }, e => {
          this.$toast({ type: 'error', message: '获取README.md文件失败！' })
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
.home {
  padding: 30px 50px;
  position: relative;
  background: url('../../../assets/img/mapBg.png') center no-repeat;
  background-size: cover;
  .top{
    display: flex;
  }
  .middle{
    flex: 1;
  }
  .bottom{
    
  }
}
</style>

<template>
  <div class="secondLevel">
		<div class="left">
			<ModuleTit title="党员队伍情况"></ModuleTit>
			<Sex></Sex>
			<Education></Education>
      <Age></Age>
			<ModuleTit title="党员队伍发展情况"></ModuleTit>
      <DangRanks></DangRanks>
		</div>
		<div class="middle">
			<MapData></MapData>
		</div>
		<div class="right">
			<ModuleTit title="党支部具体情况"></ModuleTit>
			<DangDetail></DangDetail>
		</div>
	</div>
</template>
<script>
import axios from 'axios'
import ModuleTit from '@/components/pc/moduleTit'
import Sex from './components/Sex.vue'
import Education from './components/Education.vue'
import Age from './components/Age.vue'
import DangRanks from './components/DangRanks.vue'
import MapData from './components/MapData.vue'
import DangDetail from './components/DangDetail.vue'

/* eslint-disable no-undef */
const indexPath = APP_INDEX_PATH // 项目根路径（由webpack的插件DefinePlugin注入）

export default {
  name: 'secondLevel',
  components: {
		ModuleTit,
		Sex,
		Education,
	  Age,
	  DangRanks,
	  MapData,
		DangDetail,
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
<style lang="scss" scoped>
.secondLevel {
	padding: 30px 50px;
  position: relative;
  background: url('../../../assets/img/chinaMap2-bg.png') center no-repeat;
  background-size: cover;
	display: flex;
  .left{
		
	}
	.middle{
		background: url('../../../assets/img/chinaMap2-ty.png') center 300px no-repeat;
  	background-size: cover;
		width: 1000px;
	}
	.right{

	}
}
</style>
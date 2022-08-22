<template>
  <div class="dangActivity">
		<div class="left">
			<ModuleTit title="党员风采"></ModuleTit>
			<DangFc></DangFc>
		</div>
		<div class="middle">
			<Activity></Activity>
		</div>
		<div class="right">
			<ModuleTit title="党建交流"></ModuleTit>
			<DangExchange></DangExchange>
		</div>
	</div>
</template>
<script>
import axios from 'axios'
import ModuleTit from '@/components/pc/moduleTit'
import DangFc from './components/DangFc.vue'
import Activity from './components/Activity.vue'
import DangExchange from './components/DangExchange.vue'

/* eslint-disable no-undef */
const indexPath = APP_INDEX_PATH // 项目根路径（由webpack的插件DefinePlugin注入）

export default {
  name: 'dangActivity',
  components: {
		ModuleTit,
		DangFc,
		Activity,
		DangExchange,
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
.dangActivity {
	padding: 30px 50px;
  position: relative;
	display: flex;
  .left{
		width: 30%;
	}
	.middle{
		width: 40%;
	}
	.right{
		width: 30%;
	}
}
</style>
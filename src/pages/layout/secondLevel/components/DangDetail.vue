<template>
  <div class="dangDetail">
		<ModuleTit title="各单位党费缴纳情况"></ModuleTit>
		<ul class="titles">
			<li></li>
			<li>党支部名称</li>
			<li>党员人数(人)</li>
			<li>占比</li>
		</ul>
		<ol class="tableDatas">
			<li v-for="[item,i] in 20" :key="i">
				<span>01</span>
				<span>核电维修公司党总</span>
				<span>124</span>
				<span>1%</span>
			</li>
		</ol>
	</div>
</template>
<script>
import ModuleTit from '@/components/pc/moduleTit'

export default {
  name: "dangDetail",
  components: {
		ModuleTit,
	},
  props: {},
  data() {
    return {
      
    };
  },
  computed: {},
  created() {},
  mounted() {
	},
  methods: {
	},
};
</script>
<style lang="scss" scoped>
.dangDetail{
	.titles{
		display: flex;
		width: 100%;
		height: 48px;
		background-image: linear-gradient(180deg, #FFAFAF 0%, #D73738 100%);
		border-radius: 4px 4px 0px 0px;
		li{
			flex: 1;
			font-size: 16px;
			color: #FFFFFF;
			letter-spacing: 0;
			text-align: center;
			font-weight: 700;
			text-align: center;
			line-height: 45px;
		}
	}
	.tableDatas{
		li{
			height: 54px;
			line-height: 54px;
			font-size: 14px;
			color: #FFFFFF;
			letter-spacing: 0;
			font-weight: 400;
			display: flex;
			span{
				flex: 1;
				text-align: center;
			}
		}
	}
}
</style>
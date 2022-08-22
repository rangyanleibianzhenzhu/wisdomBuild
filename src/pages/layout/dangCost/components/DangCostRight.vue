<template>
  <div class="dangCostRight">
		<ModuleTit title="各单位党费缴纳情况"></ModuleTit>
		<ul class="titles">
			<li>缴纳金额</li>
			<li>缴纳金额</li>
			<li>缴纳金额</li>
		</ul>
		<div class="barEchartBox">
			<div id="LEcharts"></div>
			<div id="REcharts"></div>
		</div>
	</div>
</template>
<script>
import * as echarts from 'echarts';
import ModuleTit from '@/components/pc/moduleTit'

export default {
  name: "dangCostRight",
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
		this.initLData()
		this.initRData()
	},
  methods: {
		initLData () {
			let myChart = echarts.init(document.getElementById('LEcharts')), option

			option = {
				title: {
					text: 'World Population'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				legend: {},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'value',
					boundaryGap: [0, 0.01]
				},
				yAxis: {
					type: 'category',
					data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
				},
				series: [
					{
						name: '2011',
						type: 'bar',
						data: [18203, 23489, 29034, 104970, 131744, 630230]
					},
					{
						name: '2012',
						type: 'bar',
						data: [19325, 23438, 31000, 121594, 134141, 681807]
					}
				]
			};

			option && myChart.setOption(option);
		},
		initRData () {
			let myChart = echarts.init(document.getElementById('REcharts')), option

			option = {
				title: {
					text: 'World Population'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				legend: {},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'value',
					boundaryGap: [0, 0.01]
				},
				yAxis: {
					type: 'category',
					data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
				},
				series: [
					{
						name: '2011',
						type: 'bar',
						data: [18203, 23489, 29034, 104970, 131744, 630230]
					},
					{
						name: '2012',
						type: 'bar',
						data: [19325, 23438, 31000, 121594, 134141, 681807]
					}
				]
			};

			option && myChart.setOption(option);
		},
	},
};
</script>
<style lang="scss" scoped>
.dangCostRight{
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
	.barEchartBox{
		display: flex;
		flex: 1;
		#LEcharts,#REcharts{
			width: 100%;
			height: 100vh;
		}
	}
}
</style>
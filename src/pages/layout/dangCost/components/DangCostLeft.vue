<template>
  <div class="dangCostLeft">
		<div class="dfCount" name="党费总金额">
			<span>党费总额（元）</span>
			<span>3,456,789.00</span>
		</div>
		<div id="dfEcharts"></div>
	</div>
</template>
<script>
import * as echarts from 'echarts';

export default {
  name: "dangCostLeft",
  components: {
		// DangCostLeft,
	},
  props: {},
  data() {
    return {
      
    };
  },
  computed: {},
  created() {},
  mounted() {
		this.initCurData();
	},
  methods: {
		initCurData () {
			let myChart = echarts.init(document.getElementById('dfEcharts')), option

			option = {
				title: {
					text: 'Stacked Area Chart'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					}
				},
				legend: {
					data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: 'Email',
						type: 'line',
						stack: 'Total',
						areaStyle: {},
						emphasis: {
							focus: 'series'
						},
						data: [120, 132, 101, 134, 90, 230, 210]
					},
					{
						name: 'Union Ads',
						type: 'line',
						stack: 'Total',
						areaStyle: {},
						emphasis: {
							focus: 'series'
						},
						data: [220, 182, 191, 234, 290, 330, 310]
					},
					{
						name: 'Video Ads',
						type: 'line',
						stack: 'Total',
						areaStyle: {},
						emphasis: {
							focus: 'series'
						},
						data: [150, 232, 201, 154, 190, 330, 410]
					},
					{
						name: 'Direct',
						type: 'line',
						stack: 'Total',
						areaStyle: {},
						emphasis: {
							focus: 'series'
						},
						data: [320, 332, 301, 334, 390, 330, 320]
					},
					{
						name: 'Search Engine',
						type: 'line',
						stack: 'Total',
						label: {
							show: true,
							position: 'top'
						},
						areaStyle: {},
						emphasis: {
							focus: 'series'
						},
						data: [820, 932, 901, 934, 1290, 1330, 1320]
					}
				]
			};

			option && myChart.setOption(option);
		}
	},
};
</script>
<style lang="scss" scoped>
.dangCostLeft{
	height: 100vh;
	background: url('../../../../assets/img/dfzezs.png') center 0  no-repeat;
	background-size: cover;
	.dfCount{
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 30%;
		span{
			&:nth-child(1){
				font-size: 28px;
				color: #FFF2DD;
				letter-spacing: 0;
				text-align: center;
				line-height: 30px;
				font-weight: 700;
			}
			&:nth-child(2){
				font-size: 64px;
				color: #FCB028;
				letter-spacing: 0;
				text-align: center;
				line-height: 40px;
				font-weight: 700;
			}
		}
	}
	#dfEcharts{
		width: 100%;
		height: 500px;
	}
}
</style>
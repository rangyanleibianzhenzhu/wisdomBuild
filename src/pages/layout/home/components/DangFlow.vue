<template>
  <div class="dangFlow">
		<div class="toDatas">
			<div class="header">
				<span class="title">截止到2022年</span>
				<ul class="middle">
					<li>
						<span>流入(人)</span>
						<span>3333</span>
					</li>
					<li>
						<span>流出(人)</span>
						<span>3333</span>
					</li>
					<li>
						<span>内部调转(人)</span>
						<span>1456</span>
					</li>
				</ul>
				<ol class="lengends">
					<li v-for="item in legends" :key="item.age">
						<label class="legend"></label>{{item.name}}
					</li>
				</ol>
			</div>
			<div id="toEcharts"></div>
		</div>
		<div class="curDatas">
			<div class="header">
				<span class="title">2022年数据</span>
				<ul class="middle">
					<li>
						<span>流入(人)</span>
						<span>3333</span>
					</li>
					<li>
						<span>流出(人)</span>
						<span>3333</span>
					</li>
					<li>
						<span>内部调转(人)</span>
						<span>1456</span>
					</li>
				</ul>
				<ol class="lengends">
					<li v-for="item in legends" :key="item.age">
						<label class="legend"></label>{{item.name}}
					</li>
				</ol>
			</div>
			<div id="curEcharts"></div>
		</div>
  </div>
</template>
<script>
import * as echarts from 'echarts';

export default {
  name: "dangFlow",
  components: {},
  props: {},
  data() {
    return {
			personData: [
				{
					title: '入党积极分子(人)',
					number: 455
				},
				{
					title: '入党积极分子(人)',
					number: 455
				},
				{
					title: '入党积极分子(人)',
					number: 455
				},
				{
					title: '入党积极分子(人)',
					number: 455
				},
				{
					title: '入党积极分子(人)',
					number: 455
				},
			],
			legends: [
				{
          name: "流入",
        },
        {
          name: "流出",
        },
        {
          name: "内部调转",
        },
			]
		};
  },
  computed: {},
  created() {},
  mounted() {
    this.initData();
    this.initCurData();
  },
  methods: {
    initData () {
			let myChart = echarts.init(document.getElementById('toEcharts')), option

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
		},
		initCurData () {
			let myChart = echarts.init(document.getElementById('curEcharts')), option

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
.dangFlow {
  width: 100%;
  height: 220px;
  margin-top: 40px;
	position: relative;
	display: flex;
	>div{
		flex:1;
	}
	div.toDatas, div.curDatas{
		.header{
			position: relative;
			display: flex;
			span.title{
				width: 56px;
				font-size: 16px;
				color: #FED29A;
				letter-spacing: 0;
				line-height: 24px;
				font-weight: 700;
    		margin: 0 20px;		
			}
			ul.middle{
				display: flex;
				li{
					display: flex;
					justify-content: space-between;
					width: 180px;
					height: 48px;
					background: rgba(94,13,12,0.80);
					border: 1px solid rgba(255,105,105,1);
					box-shadow: inset 0px 0px 8px 4px rgba(250,70,68,0.5);
					border-radius: 4px;
					padding: 0 16px;
					span{
						&:nth-child(1){
							font-size: 12px;
							color: #FFFFFF;
							letter-spacing: 0;
							text-align: center;
							line-height: 20px;
							font-weight: 400;
						}
						&:nth-child(2){
							font-size: 32px;
							color: #FFE6BB;
							letter-spacing: 0;
							text-align: right;
							line-height: 40px;
							font-weight: 700;
						}
					}			
				}
			}
			ol.lengends{
				position: absolute;
				right: 0;
				top: 10px;
				display: flex;
				li{
					font-size: 12px;
					color: #FFFFFF;
					letter-spacing: 0;
					text-align: right;
					line-height: 20px;
					font-weight: 400;
					margin-right: 16px;
					label.legend{
						display: inline-block;
						width: 12px;
						height: 2px;
						margin-bottom: 3px;
						margin-right: 5px;
					}
					&:nth-child(1) .legend{
						background-image: linear-gradient(270deg, #FFAFAF 0%, #D73738 100%);
						
					}
					&:nth-child(2) .legend{
						background-image: linear-gradient(-59deg, #FFE8BE 0%, #F79D34 100%, #FCAD20 100%);
						
					}
					&:nth-child(3) .legend{
						background-image: linear-gradient(137deg, #4A7EE9 0%, #E7F1FF 100%);
					}
				}
			}
		}
		#toEcharts, #curEcharts{
			width: 100%;
			height: 500px;
		}
	}
}
</style>
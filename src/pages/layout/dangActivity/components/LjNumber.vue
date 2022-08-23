<template>
  <div class="ljNumber">
    <div class="title">累计次数</div>
		<div class="detail">
			<ol class="dangAgelist">
				<li v-for="item in ages" :key="item.age">
					<span>{{ item.age }}</span>
					<div class="percent">
						<div class="chunseColor" :style="{ width: item.percent + '%' }"></div>
						<div class="bycColor"></div>
					</div>
					<span class="ageNum">{{ item.number }}</span>
				</li>
			</ol>
			<div id="ljNumberEcharts"></div>
		</div>
  </div>
</template>
<script>
import * as echarts from "echarts"

export default {
  name: "ljNumber",
  components: {},
  props: {},
  data() {
    return {
      ages: [
        {
          age: "10年",
          number: 10,
        },
        {
          age: "20年",
          number: 30,
        },
        {
          age: "30年",
          number: 10,
        },
      ],
			legends: [
				{
          age: "10",
        },
        {
          age: "20",
        },
        {
          age: "30",
        },
			]
    };
  },
  computed: {},
  created() {
    this.initData();
  },
  mounted() {
		this.initPieData();
	},
  methods: {
    initData() {
      let ages = this.ages,
        count = 0;
      for (let i = 0; i < ages.length; i++) {
        count = count + ages[i].number;
      }
      ages.forEach((item) => {
        item.percent = (item.number / count) * 100;
      });
      this.ages = ages;
    },
		initPieData () {
			let myChart = echarts.init(document.getElementById('ljNumberEcharts')), option

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
  },
};
</script>
<style lang="scss" scoped>
.ljNumber {
  width: 450px;
  height: 220px;
  background: rgba(94, 13, 12, 0.4);
  border: 1px solid rgba(255, 105, 105, 1);
  border-radius: 4px;
  margin-top: 30px;
  overflow: hidden;
  .title {
    height: 32px;
    padding-left: 15px;
    position: relative;
    font-size: 16px;
    color: #fed29a;
    letter-spacing: 0;
    line-height: 32px;
    font-weight: 700;
    z-index: 1;
    &::after {
      display: inline-block;
      content: "";
      width: 120px;
      height: 40px;
      transform: skewX(-30deg);
      background-image: linear-gradient(180deg, #5e0d0c 0%, #971e1c 100%);
      border-radius: 4px 0px 0px 0px;
      position: absolute;
      top: 0;
      left: -10px;
      z-index: -1;
    }
  }
	.detail{
		display: flex;
		ol.dangAgelist {
			width: 200px;
			list-style: none;
			margin-top: 20px;
			li {
				display: flex;
				span {
					font-size: 12px;
					color: #ffffff;
					letter-spacing: 0;
					text-align: right;
					line-height: 24px;
					font-weight: 400;
				}
				div.percent {
					width: 290px;
					height: 16px;
					background-color: #5e0d0c;
					margin: 0 20px;
					position: relative;
					.chunseColor {
						height: 100%;
						background-image: linear-gradient(270deg, #f79d34 0%, #5b8ff9 100%);
					}
					.bycColor {
						width: 100%;
						height: 100%;
						position: absolute;
						left: 0;
						top: 0;
						background: url('../../../../assets/img/bycRed.png') center no-repeat;
          	background-size: cover;
					}
				}
				span.ageNum {
					font-size: 18px;
					color: #ffe7bc;
					letter-spacing: 0;
					text-align: right;
					line-height: 24px;
					font-weight: 700;
				}
			}
		}
		#ljNumberEcharts{
			width: 200px;
			height: 200px;
		}
	}
}
</style>
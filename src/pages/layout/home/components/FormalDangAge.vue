<template>
  <div class="formalDangAge">
    <div class="title">党龄结构</div>
		<ol class="legendData">
			<li v-for="item in legends" :key="item.age">
				<label class="legend"></label>{{item.age}}年
			</li>
		</ol>
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
			<div id="formalDangAge"></div>
		</div>
  </div>
</template>
<script>
import * as echarts from "echarts"

export default {
  name: "formalDangAge",
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
			let myChart = echarts.init(document.getElementById('formalDangAge')), option

			option = {
				// backgroundColor: '#2c343c',
				// title: {
				// 	text: 'Customized Pie',
				// 	left: 'center',
				// 	top: 20,
				// 	textStyle: {
				// 		color: '#ccc'
				// 	}
				// },
				tooltip: {
					trigger: 'item'
				},
				visualMap: {
					show: false,
					min: 80,
					max: 600,
					inRange: {
						colorLightness: [0, 1]
					}
				},
				series: [
					{
						name: 'Access From',
						type: 'pie',
						radius: '55%',
						center: ['50%', '50%'],
						data: [
							{ value: 335, name: 'Direct' },
							{ value: 310, name: 'Email' },
							{ value: 274, name: 'Union Ads' },
						].sort(function (a, b) {
							return a.value - b.value;
						}),
						roseType: 'radius',
						label: {
							color: 'rgba(255, 255, 255, 0.3)'
						},
						labelLine: {
							lineStyle: {
								color: 'rgba(255, 255, 255, 0.3)'
							},
							smooth: 0.2,
							length: 10,
							length2: 20
						},
						itemStyle: {
							color: '#c23531',
							shadowBlur: 200,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						},
						animationType: 'scale',
						animationEasing: 'elasticOut',
						animationDelay: function (idx) {
							return Math.random() * 200;
						}
					}
				]
			};

			option && myChart.setOption(option);
		},
  },
};
</script>
<style lang="scss" scoped>
.formalDangAge {
  width: 442px;
  height: 153px;
  background: rgba(94, 13, 12, 0.4);
  border: 1px solid rgba(255, 105, 105, 1);
  border-radius: 4px;
  margin-top: 30px;
  overflow: hidden;
	position: relative;
  .title {
		width: 102px;
    height: 32px;
		text-align: center;
		padding-right: 10px;
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
      width: 102px;
      height: 32px;
      transform: skewX(-30deg);
      background-image: linear-gradient(180deg, #5e0d0c 0%, #971e1c 100%);
      border-radius: 4px 0px 0px 0px;
      position: absolute;
      top: 0;
      left: -10px;
      z-index: -1;
    }
  }
	ol.legendData{
		display: flex;
		position: absolute;
		right: 0;
		top: 10px;
		li{
			font-size: 12px;
			color: #FFFFFF;
			letter-spacing: 0;
			text-align: right;
			line-height: 20px;
			font-weight: 400;
			margin-right: 24px;
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
	.detail{
		display: flex;
		padding: 0px 15px 0 26px;
		ol.dangAgelist {
			flex: 1;
			li {
				display: flex;
				span {
					font-size: 12px;
					color: #ffffff;
					letter-spacing: 0;
					text-align: right;
					line-height: 24px;
					font-weight: 400;
					margin-bottom: 16px;
				}
				div.percent {
					flex: 1;
					height: 16px;
					background-color: #5e0d0c;
					margin: 0 8px;
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
		#formalDangAge{
			width: 150px;
			height: 150px;
		}
	}
}
</style>
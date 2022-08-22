<template>
  <div class="dangExchange" name="党建交流">
		<ol class="datas">
			<li v-for="(item,i) in personData" :key="i">
				<p>西南区域公司“党建+安全”典型案例：党建+安全 为生产保驾护航</p>
				<div class="moreInfo">
					<div class="LInfo">庞锦绣  |  2022-08-12</div>
					<ul class="RInfo">
						<li>
							<img src="../../../../assets/img/yiyuedu.png" alt="阅读">
							<span>122</span>
						</li>
						<li>
							<img src="../../../../assets/img/pinglun.png" alt="评论">
							<span>1</span>
						</li>
					</ul>
				</div>
			</li>
		</ol>
  </div>
</template>
<script>

export default {
  name: "dangExchange",
  components: {},
  props: {},
  data() {
    return {
			personData: [
				{
					title: '入党积极分子(人)',
					number: 455,
					imgUrl: require('../../../../assets/img/mapBg.png')
				},
				{
					title: '入党积极分子(人)',
					number: 455,
					imgUrl: require('../../../../assets/img/mapBg.png')
				},
				{
					title: '入党积极分子(人)',
					number: 455,
					imgUrl: require('../../../../assets/img/mapBg.png')
				},
				{
					title: '入党积极分子(人)',
					number: 455,
					imgUrl: require('../../../../assets/img/mapBg.png')
				},
				{
					title: '入党积极分子(人)',
					number: 455,
					imgUrl: require('../../../../assets/img/mapBg.png')
				},
			],
			yjdwDatas: [
				{
					name: '党支部',
					number: 455
				},
				{
					name: '党员人数',
					number: 455
				},
				{
					name: '委员职数',
					number: 455
				},
			]
		};
  },
  computed: {},
  created() {},
  mounted() {
    // this.initData();
  },
  methods: {
    
  },
};
</script>
<style lang="scss" scoped>
.dangExchange {
  width: 450px;
  height: 220px;
  margin-top: 30px;
	position: relative;
	.datas{
		background: rgba(94,13,12,0.40);
		border: 1px solid rgba(255,105,105,1);
		border-radius: 4px;
		li{
			p{
				font-size: 16px;
				color: #FFFFFF;
				letter-spacing: 0;
				text-align: justify;
				line-height: 24px;
				font-weight: 400;
			}
			.moreInfo{
				display: flex;
				justify-content: space-between;
				font-size: 12px;
				color: #FFFFFF;
				letter-spacing: 0;
				font-weight: 400;
				.LInfo{
					font-family: MicrosoftYaHei;
				}
				.RInfo{
					display: flex;
					li{
						img{
							width: 15px;
							height: 15px;
						}
					}
				}
			}
		}
	}
}
</style>
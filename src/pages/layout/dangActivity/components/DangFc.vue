<template>
  <div class="dangFc" namw="党员风采">
		<ol class="datas">
			<li v-for="(item,i) in personData" :key="i">
				<img :src="item.imgUrl" :alt="item.title">
				<label>王晓东：立足本职岗位  用心履职尽责</label>
			</li>
		</ol>
  </div>
</template>
<script>

export default {
  name: "dangFc",
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
.dangFc {
  width: 450px;
  height: 220px;
  margin-top: 30px;
	position: relative;
	.datas{
		background: rgba(94,13,12,0.40);
		border: 1px solid rgba(255,105,105,1);
		border-radius: 4px;
		li{
			img{
				width: 100%;
				height: 80px;
			}
			label{
				background: rgba(94,13,12,0.90);
				font-size: 12px;
				color: #FFFFFF;
				letter-spacing: 0;
				font-weight: 400;
			}
		}
	}
}
</style>
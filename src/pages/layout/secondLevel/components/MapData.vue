<template>
  <div class="mapData">
		<div class="yjdwBox">
			<h3>一级党委名称</h3>
			<ol class="yjdwname" name="一级党委名称">
				<li v-for="item in yjdwDatas" :key="item.name">
					<span class="name">{{item.name}}</span>
					<span class="number">{{item.number}}</span>
				</li>
			</ol>
		</div>
  </div>
</template>
<script>

export default {
  name: "mapData",
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
.mapData {
  width: 450px;
  height: 220px;
  margin-top: 30px;
	position: relative;
	.yjdwBox{
		position: absolute;
		top: 50px;
		right: 50px;
		width: 200px;
		height: 126px;
		background: rgba(94,13,12,0.70);
		border: 1px solid rgba(255,105,105,1);
		box-shadow: inset 0px 0px 8px 4px rgba(250,70,68,0.5);
		border-radius: 4px;
		h3{
			font-size: 16px;
			color: #FFE7B4;
			letter-spacing: 0;
			line-height: 20px;
			font-weight: 700;
		}
		ol.yjdwname{
			list-style: none;
			li{
				display: flex;
				justify-content: space-between;
				span.name{
					font-size: 14px;
					color: #FFFFFF;
					letter-spacing: 0;
					line-height: 22px;
					font-weight: 400;
				}
				span.number{
					font-size: 14px;
					color: #FFE6BB;
					letter-spacing: 0;
					text-align: right;
					line-height: 22px;
					font-weight: 700;
				}
			}
		}
	}
}
</style>
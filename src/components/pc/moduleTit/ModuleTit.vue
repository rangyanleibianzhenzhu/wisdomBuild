<template>
  <div class="moduleTit">
		<img src="../../../assets/img/biaoti-icon.png" alt="模块标题">
		<div class="titWrap">
			<label class="tit">{{title}}</label>
			<i class="sign">(人)</i>
		</div>
	</div>
</template>
<script>
// import { defineComponent } from '@vue/composition-api'

export default {
  name: "moduleTit",
  components: {},
  props: {
		title: {
      type: String,
      default: ''
    }
	},
  data() {
    return {
      
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.moduleTit{
	display: flex;
	img{
		width: 40px;
		height: 40px;
		margin-right: 5px;
	}
	.titWrap{
		width: 397px;
		height: 40px;
		background: url('../../../assets/img/biaotikuang.png') center no-repeat;
		background-size: cover;
		padding-left: 23px;
		label.tit{
			font-size: 22px;
			color: #FFFFFF;
			letter-spacing: 0;
			line-height: 40px;
			font-weight: 700;
		}
		i.sign{
			transform: translate(0, -50%);
			font-style: normal;
			font-size: 12px;
			color: #FFFFFF;
			letter-spacing: -0.22px;
			font-weight: 400;
			margin-left: 10px;
		}
	}
}
</style>
<template>
  <div class="activity">
		<h2>三会一课和主题党日活动</h2>
		<div class="bannersBox">
			<BaseBanners :bannerList="imgList" :speed="1000" :interval="5000" :defaultIndex="2" indexType="line"></BaseBanners>
		</div>
		<LjNumber></LjNumber>
  </div>
</template>
<script>
import BaseBanners from '@/components/base/banners/index.vue'
import LjNumber from './LjNumber.vue'

export default {
  name: "activity",
  components: {
		BaseBanners,
		LjNumber,
	},
  props: {},
  data() {
    return {
			imgList: [
        {
          src: 'https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_e835568.png',
          link: 'http://www.baidu.com',
					name:'2324',
        },
        // {
        //   src: 'https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_e835568.png',
        //   link: 'http://www.hao123.com',
				// 	name:'57567',
        // },
        // {
        //   src: 'https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_e835568.png',
				// 	link: 'http://www.hao123.com',
				// 	name:'6879',
        // }
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
.activity {
	position: relative;
	h2{
		width: 100%;
		height: 48px;
		background-image: linear-gradient(180deg, #FFAFAF 0%, #D73738 100%);
		border-radius: 4px 4px 0px 0px;
		font-size: 22px;
		color: #FFFFFF;
		letter-spacing: 0;
		line-height: 30px;
		font-weight: 700;
		text-align: center;
		line-height: 48px;
	}
	.bannersBox{
		width: 700px;
		height: 400px;
		::v-deep .banners-container .nav-wrap .cur{
			font-size: 14px;
			color: #FED29A;
			letter-spacing: 0;
			line-height: 30px;
			font-weight: 700;
		}
	}
}
</style>
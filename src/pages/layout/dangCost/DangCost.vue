<template>
  <div class="dangCost">
		<DangCostLeft></DangCostLeft>
		<DangCostRight></DangCostRight>
	</div>
</template>
<script>
import DangCostLeft from './components/DangCostLeft.vue'
import DangCostRight from './components/DangCostRight.vue'

export default {
  name: "dangCost",
  components: {
		DangCostLeft,
		DangCostRight,
	},
  props: {},
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
.dangCost{
	display: flex;
	>div{
		flex: 1;
	}
}
</style>
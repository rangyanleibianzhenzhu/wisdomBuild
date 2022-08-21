<template>
  <ul class="timeline">
		<slot></slot>
  </ul>
</template>
<script>

export default {
  name: "Timeline",
  components: {
  },
	props: {
	},
  data() {
    return {};
  },
  methods: {
    
  },
};
</script>
<style lang="scss" scoped px2rem="false">
.timeline {
  margin: 0;
  font-size: 14px;
  list-style: none;
}
</style>

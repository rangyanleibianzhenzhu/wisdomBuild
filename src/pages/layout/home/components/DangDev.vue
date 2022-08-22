<template>
  <div class="dangDev">
    <div id="lineEchart"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";

export default {
  name: "dangDev",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      let myChart = echarts.init(document.getElementById("lineEchart")),
        option;

      option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [15, 20, 22, 28, 15, 14, 260],
            type: 'line'
          }
        ]
      };

      option && myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.dangDev {
  width: 450px;
  height: 220px;
  margin-top: 30px;
  #lineEchart {
    width: 100%;
    height: 400px;
  }
}
</style>
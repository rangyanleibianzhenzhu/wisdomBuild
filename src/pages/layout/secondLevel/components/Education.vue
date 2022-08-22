<template>
  <div class="education">
    <div class="title">学历结构</div>
    <div id="pieEchart"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";

export default {
  name: "education",
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
      let myChart = echarts.init(document.getElementById("pieEchart")),
        option;

      option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "20%",
          left: "right",
          width: 50,
          icon: "circle",
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#FFAFAF", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#D73738 ", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            label: {
              show: true,
            },
            labelLine: {
              show: true,
              lineStyle: {
                color: "#000",
              },
            },
            data: [
              { value: 1048, name: "本科" },
              { value: 735, name: "大专以下" },
              { value: 580, name: "研究生" },
            ],
          },
        ],
      };

      option && myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.education {
  width: 450px;
  height: 220px;
  background: rgba(94, 13, 12, 0.4);
  border: 1px solid rgba(255, 105, 105, 1);
  border-radius: 4px;
  margin-top: 30px;
  overflow: hidden;
  .title {
    width: 102px;
    height: 32px;
    text-align: center;
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
  #pieEchart {
    width: 100%;
    height: 200px;
  }
}
</style>
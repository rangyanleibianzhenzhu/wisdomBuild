<template>
  <div class="sex">
    <div class="title">学历结构</div>
    <div class="seData">
      <div class="number">
        <span>男：{{ boy }}人</span>
        <span>女：{{ girl }}人</span>
      </div>
      <div class="percentLine">
        <label
          class="boy"
          :style="{ width: (boy / (boy + girl)) * 100 + '%' }"
        ></label>
        <label
          class="girl"
          :style="{ width: (girl / (boy + girl)) * 100 + '%' }"
        ></label>
      </div>
    </div>
  </div>
</template>
<script>
// import { defineComponent } from '@vue/composition-api'

export default {
  name: "sex",
  components: {},
  props: {},
  data() {
    return {
      boy: 30,
      girl: 70,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.sex {
  width: 450px;
  font-size: 16px;
  color: #fed29a;
  letter-spacing: 0;
  line-height: 30px;
  font-weight: 700;
  margin-top: 30px;
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
  .seData {
    display: inline-block;
    .number {
      width: 400px;
      display: flex;
      justify-content: space-between;
    }
    .percentLine {
      margin-top: 15px;
      label {
        display: inline-block;
      }
      .boy {
        height: 20px;
        background-image: linear-gradient(90deg, #5b8ff9 0%, #ddecff 100%);
        border-radius: 8px 0 0 8px;
      }
      .girl {
        height: 20px;
        background-image: linear-gradient(270deg, #ffafaf 0%, #d73738 100%);
        border-radius: 0 8px 8px 0;
      }
    }
  }
}
</style>
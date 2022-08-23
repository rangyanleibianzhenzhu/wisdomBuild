<template>
  <div class="sex">
    <span>性别结构</span>
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
  font-size: 16px;
  color: #fed29a;
  letter-spacing: 0;
  font-weight: 700;
  margin-top: 21px;
  display: flex;
  align-items: end;
  span {
    padding: 0 10px;
  }
  .seData {
    flex: 1;
    .number {
      display: flex;
      justify-content: space-between;
    }
    .percentLine {
      margin-top: 5px;
      label {
        display: inline-block;
      }
      .boy {
        height: 8px;
        background-image: linear-gradient(90deg, #5b8ff9 0%, #ddecff 100%);
        border-radius: 8px 0 0 8px;
      }
      .girl {
        height: 8px;
        background-image: linear-gradient(270deg, #ffafaf 0%, #d73738 100%);
        border-radius: 0 8px 8px 0;
      }
    }
  }
}
</style>
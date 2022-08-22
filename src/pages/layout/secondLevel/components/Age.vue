<template>
  <div class="age">
    <div class="title">年龄结构</div>
    <ol class="agelist">
      <li v-for="item in ages" :key="item.age">
        <span>{{ item.age }}</span>
        <div class="percent">
          <div class="chunseColor" :style="{ width: item.percent + '%' }"></div>
          <div class="bycColor"></div>
        </div>
        <span class="ageNum">{{ item.number }}</span>
      </li>
    </ol>
  </div>
</template>
<script>
// import { defineComponent } from '@vue/composition-api'

export default {
  name: "age",
  components: {},
  props: {},
  data() {
    return {
      ages: [
        {
          age: "20-30岁",
          number: 10,
        },
        {
          age: "31-40岁",
          number: 30,
        },
        {
          age: "41-50岁",
          number: 10,
        },
        {
          age: "51-60岁",
          number: 50,
        },
      ],
    };
  },
  computed: {},
  created() {
    this.initData();
  },
  mounted() {},
  methods: {
    initData() {
      let ages = this.ages,
        count = 0;
      for (let i = 0; i < ages.length; i++) {
        count = count + ages[i].number;
      }
      ages.forEach((item) => {
        item.percent = (item.number / count) * 100;
      });
      this.ages = ages;
    },
  },
};
</script>
<style lang="scss" scoped>
.age {
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
  ol.agelist {
    list-style: none;
    margin-top: 20px;
    li {
      display: flex;
      span {
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: right;
        line-height: 24px;
        font-weight: 400;
      }
      div.percent {
        width: 290px;
        height: 16px;
        background-color: #5e0d0c;
        margin: 0 20px;
        position: relative;
        .chunseColor {
          height: 100%;
          background-image: linear-gradient(270deg, #f79d34 0%, #5b8ff9 100%);
        }
        .bycColor {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          background: url('../../../../assets/img/bycRed.png') center no-repeat;
          background-size: cover;
        }
      }
      span.ageNum {
        font-size: 18px;
        color: #ffe7bc;
        letter-spacing: 0;
        text-align: right;
        line-height: 24px;
        font-weight: 700;
      }
    }
  }
}
</style>
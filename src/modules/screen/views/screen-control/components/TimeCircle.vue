<template>
  <!-- vue 圆环倒计时组件 -->
  <section>
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" :width="width" :height="width">
      <circle cx="100" cy="100" :r="100 - border / 2" fill="none" opacity="0.4" :stroke="color" :stroke-width="border" />
      <circle
        cx="100"
        cy="100"
        :r="100 - border / 2"
        fill="none"
        transform="rotate(270,100,100)"
        :stroke="changeColor"
        :stroke-width="border"
        :stroke-dasharray="dashLen"
        :stroke-dashoffset="dashOffset"
        style="transition: stroke-dashoffset 0.8s"
      />
      <!-- <text x="100" y="100" text-anchor="middle" :font-size="fontSize + 5" :fill="color">{{ setTimer }}</text>
      <text x="100" y="150" text-anchor="middle" :font-size="fontSize" fill="#d4d4d4">剩余(秒)</text> -->
    </svg>
  </section>
</template>
<script>
export default {
  name: "TimeCircle",
  props: {
    setTimer: {
      type: Number,
      default: 0
    },
    totalTime: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 230
    },
    border: {
      type: Number,
      default: 12
    },
    color: {
      type: String,
      default: "#BA1415"
    },
    fontSize: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      dashLen: (100 - this.border / 2) * Math.PI * 2,
      changeColor: this.color
    };
  },
  computed: {
    dashOffset() {
      let num = this.dashLen - (this.setTimer / -this.totalTime) * this.dashLen;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      if (num < 750) this.changeColor = "#FF0000";
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      else this.changeColor = "#24CC24";
      return num;
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped></style>

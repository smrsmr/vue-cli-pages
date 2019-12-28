<template>
  <section>
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" :width="width" :height="width">
      <circle cx="100" cy="100" :r="100 - border / 2" fill="none" opacity="0.4" :stroke="color" :stroke-width="border" />
      <circle
        cx="100"
        cy="100"
        :r="100 - border / 2"
        fill="none"
        transform="rotate(270,100,100)"
        :stroke="color"
        :stroke-width="border"
        :stroke-dasharray="dashLen"
        :stroke-dashoffset="dashOffset"
        style="transition: stroke-dashoffset 0.4s"
      />
      <text x="100" y="100" text-anchor="middle" :font-size="fontSize + 5" :fill="color">
        {{ countDown }}
      </text>
      <text x="100" y="150" text-anchor="middle" :font-size="fontSize" fill="#d4d4d4">
        剩余
      </text>
    </svg>
  </section>
</template>
<script>
import moment from "moment";
export default {
  name: "CountTime",
  props: {
    auctionBeginTime: {
      type: String
    },
    width: {
      type: Number,
      default: 120
    },
    border: {
      type: Number,
      default: 8
    },
    color: {
      type: String,
      default: "#fcaa55"
    },
    fontSize: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      timeLeft: 0,
      setTimer: 0,
      dashLen: (100 - this.border / 2) * Math.PI * 2
    };
  },
  computed: {
    countDown() {
      let time = this.timeLeft;
      if (time <= 0) {
        return "00:00:00";
      } else {
        let result = [];
        result.push(Math.floor(time / 3.6e6));
        result.push(Math.floor((time % 3.6e6) / 60000));
        result.push(Math.floor((time % 60000) / 1000));
        return result.map(x => (x < 10 ? "0" + x : x)).join(":");
      }
    },
    dashOffset() {
      return this.dashLen - (this.timeLeft / -this.setTimer) * this.dashLen;
    }
  },
  mounted() {
    this.lastDate = Date.now();
    console.log(this.auctionBeginTime);
    let et = moment(this.auctionBeginTime).format("YYYY-MM-DD HH:mm:ss");
    let nowTime = new Date();
    let endTime = new Date(this.auctionBeginTime);
    let t = endTime.getTime() - nowTime.getTime();
    let min = Math.floor((t / 60000) % 60) * 60;
    let sec = Math.floor((t / 1000) % 60) + min;
    this.timeLeft = sec;
    this.setTimer = sec;
    console.log(sec);
    this.interval = setInterval(() => {
      let curDate = Date.now();
      let diff = Math.round((curDate - this.lastDate) / 1000) * 1000;
      this.timeLeft -= diff;
      if (this.timeLeft <= 0) {
        clearInterval(this.interval);
      }
      if (diff >= 1000) {
        this.lastDate = curDate;
      }
    }, 1000);
  }
};
</script>
<style lang="less" scoped></style>

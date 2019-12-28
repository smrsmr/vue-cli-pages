<template>
  <!-- 倒计时组件 -->
  <section class="count-down">
    <section v-loading="loading" element-loading-text="拼命加载中......">
      <span :endTime="endTime" :endText="endText">
        <!-- <slot>{{content}}</slot> -->
        <p v-html="content"></p>
      </span>
    </section>
  </section>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      content: "",
      loading: false
    };
  },
  props: {
    endTime: {
      type: Number
    },
    endText: {
      type: String,
      default: "已结束"
    }
  },
  mounted() {
    this.countdowm(this.endTime);
  },
  methods: {
    countdowm(timestamp) {
      this.loading = true;
      let self = this;
      let timer = setInterval(() => {
        let et = moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
        let nowTime = new Date();
        let endTime = new Date(timestamp);
        let t = endTime.getTime() - nowTime.getTime();
        if (t > 0) {
          this.loading = false;
          let day = Math.floor(t / 86400000);
          let hour = Math.floor((t / 3600000) % 24);
          let min = Math.floor((t / 60000) % 60);
          let sec = Math.floor((t / 1000) % 60);
          hour = hour < 10 && hour > 0 ? "0" + hour : hour;
          min = min < 10 ? "0" + min : min;
          sec = sec < 10 ? "0" + sec : sec;
          let format = "";
          let isDay = day > 0 ? day : "";
          format = `${day > 0 ? day + "<span style='font-size: 16px;color: #333;'>天</span>" : ""}${
            hour > 0 ? hour + "<span style='font-size: 16px;color: #333;'>时</span>" : ""
          }${min}<span style='font-size: 16px;color: #333;'>分</span>${sec}<span style='font-size: 16px;color: #333;'>秒</span>`;
          self.content = format;
        } else {
          this.$emit("updateList");
          this.loading = false;
          clearInterval(timer);
          self.content = self.endText;
        }
      }, 1000);
    }
  }
};
</script>
<style lang="less">
.count-down {
  .el-loading-mask {
    background-color: #f2f2f2;
  }
}
</style>

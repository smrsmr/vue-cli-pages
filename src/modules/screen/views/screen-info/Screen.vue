<template>
  <section v-loading="loading" class="screen" element-loading-text="拼命加载中......">
    <div class="page">
      <screen-page
        :socketData="socketData"
        :noticeData="noticeData"
        :record="record"
        :actionStart="actionStart"
        :recordPrice="recordPrice"
        :actionOver="actionOver"
        :actionStop="actionStop"
        :actionActivate="actionActivate"
      ></screen-page>
    </div>
  </section>
</template>
<script>
import ScreenPage from "./components/ScreenPage";
import Storage from "../../assets/js/Storage.js";
import Stomp from "stompjs";
export default {
  name: "ScreenControlPage",
  components: {
    ScreenPage
  },
  data() {
    return {
      // 初始化stopm
      stompClient: null,
      // 场次id
      meetingId: null,
      // 初始化加载
      loading: false,
      //
      socketData: {},
      actionStart: {},
      // 公告数组
      noticeData: [],
      // 刷新报价记录
      record: {},
      //
      recordPrice: [],
      // 拍卖结束
      actionOver: {},
      // 拍卖暂停
      actionStop: {},
      // 拍卖继续
      actionActivate: {}
    };
  },
  mounted() {
    let socketURL = process.env.VUE_APP_SOCKETEURL;
    // 链接websocket
    this.connection(socketURL);
    const { meetingId } = this.$route.query;
    this.meetingId = meetingId;
    Storage.localGet("noticeData") !== null ? (this.noticeData = Storage.localGet("noticeData")) : Storage.localSet("noticeData", this.noticeData);
    Storage.localGet("recordPrice") !== null
      ? (this.recordPrice = Storage.localGet("recordPrice"))
      : Storage.localSet("recordPrice", this.recordPrice);
  },
  methods: {
    connection(url) {
      // 建立连接对象
      let socket = new WebSocket(url);
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket);
      // 向服务器发起websocket连接
      this.stompClient.connect(
        "guest",
        "guest",
        () => {
          this.stompClient.subscribe(`/exchange/auctionExchange/meeting.id_${this.meetingId}`, result => {
            // 订阅服务端提供的某个topic
            console.log("广播成功");
            // console.log(result);
            let body = JSON.parse(result.body);
            // console.log(body);
            switch (body.type) {
              case "timer":
                // 推送数量、当前价格
                this.socketData = body;
                break;
              case "deal":
                // 推送通知 && 刷新报价记录
                this.record = body;
                this.noticeData.push(body);
                Storage.localSet("noticeData", this.noticeData);
                this.noticeData = Storage.localGet("noticeData");
                break;
              case "start":
                // 场次开始
                this.actionStart = body;
                break;
              case "bid":
                let stoArray = Storage.localGet("recordPrice");
                // stoArray.push(body);
                stoArray.unshift(body);
                Storage.localSet("recordPrice", stoArray);
                this.recordPrice = stoArray;
                break;
              case "stop":
                this.actionStop = body;
                break;
              case "activate":
                this.actionActivate = body;
                break;
              case "over":
                this.actionOver = body;
                break;
              default:
                console.log("请求出错");
                break;
            }
            // if (body.type === "timer") {
            //   this.socketData = body;
            // }
            // if (body.type === "deal") {
            //   // 成交记录
            //   this.noticeData.push(body);
            //   Storage.localSet("noticeData", this.noticeData);
            //   this.noticeData = Storage.localGet("noticeData");
            // }
          });
        },
        err => {
          // 连接发生错误时的处理函数
          console.log("失败");
          console.log(err);
        }
      );
    },
    disconnect() {
      this.stompClient.disconnect(() => {
        console.log("断开socket");
      });
    }
  },
  beforeDestroy() {
    this.disconnect();
  }
};
</script>
<style lang="less" scoped>
.screen {
  width: 100%;
  height: 100%;
  .page {
    height: 100%;
  }
}
</style>

<template>
  <section v-loading="loading" class="screen" element-loading-text="拼命加载中......">
    <div class="page">
      <div>
        <grid-layout
          :layout.sync="layout"
          :col-num="4"
          :row-height="hh"
          :responsive="false"
          :is-draggable="true"
          :is-resizable="true"
          :is-mirrored="false"
          :vertical-compact="true"
          :margin="[15, 15]"
          :use-css-transforms="true"
        >
          <grid-item
            v-for="(item, index) in screenData"
            :x="layout[index].x"
            :y="layout[index].y"
            :w="layout[index].w"
            :h="layout[index].h"
            :i="layout[index].i"
            :key="layout[index].i"
          >
            <screen-page
              v-if="item.type === 'AUCTION'"
              :id="item.id"
              :screen-i-d="item.screenCode"
              :socket="socketData"
              :notice-data="noticeData"
              :auctionPatern="auctionPatern"
              :auctionStatus="auctionStatus"
              :actionStart="actionStart"
            ></screen-page>
            <screen-notice v-if="item.type === 'NOTICE'" :notice="item.notice" style="overflow-y: hidden;"></screen-notice>
          </grid-item>
        </grid-layout>
      </div>
    </div>
  </section>
</template>
<script>
import ScreenPage from "./components/ScreenPage";
import ScreenNotice from "./components/ScreenNotice";
import Storage from "../../assets/js/Storage.js";
import Stomp from "stompjs";
import VueGridLayout from "vue-grid-layout";
export default {
  name: "ScreenControlPage",
  components: {
    ScreenPage,
    ScreenNotice,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data() {
    return {
      // 初始化stopm
      stompClient: null,
      // 场次id
      meetingId: null,
      // 屏幕数据
      screenData: null,
      // 竞价模式
      auctionPatern: null,
      // 初始化加载
      loading: true,
      //
      socketData: {},
      //
      noticeData: [],
      // 拍卖状态
      auctionStatus: {},
      // 拍卖的状态
      actionStart: {},
      hh: 425.5,
      layout: []
    };
  },
  mounted() {
    let socketURL = process.env.VUE_APP_SOCKETEURL;
    // let socketURL = "ws://192.168.100.214:15674/ws";
    // 链接websocket
    this.connection(socketURL);
    const { meetingId } = this.$route.query;
    this.meetingId = meetingId;
    this.$api.SCREEN.queryMeetingConfig(this.meetingId)
      .then(result => {
        if (result.data.retcode === 1) {
          let sortScreenList = this._.sortBy(result.data.data.screenConfigs, ["screenCode"]);
          this.screenData = sortScreenList;
          let screen = window.screen.width;
          this.screenFun(screen);
          let len = this.screenData.length;
          let h = document.body.clientHeight - 45;
          this.hh = h / 2;
          switch (len) {
            case 1:
              this.layout = [{ x: 0, y: 0, w: 2, h: 1, i: "0" }];
              break;
            case 2:
              this.layout = [
                { x: 0, y: 0, w: 2, h: 1, i: "0" },
                { x: 2, y: 0, w: 2, h: 1, i: "1" }
              ];
              break;
            case 3:
              this.layout = [
                { x: 0, y: 0, w: 2, h: 1, i: "0" },
                { x: 2, y: 0, w: 2, h: 1, i: "1" },
                { x: 0, y: 2, w: 2, h: 1, i: "2" }
              ];
              break;
            default:
              this.layout = [
                { x: 0, y: 0, w: 2, h: 1, i: "0" },
                { x: 2, y: 0, w: 2, h: 1, i: "1" },
                { x: 0, y: 2, w: 2, h: 1, i: "2" },
                { x: 2, y: 2, w: 2, h: 1, i: "3" }
              ];
              break;
          }
          this.auctionPatern = result.data.data.auctionPatern;
          this.loading = false;
        } else {
          this.$message.error(result.data.retmsg);
          this.loading = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
    Storage.localGet("noticeData") !== null ? (this.noticeData = Storage.localGet("noticeData")) : Storage.localSet("noticeData", this.noticeData);
  },
  methods: {
    // 屏幕分辨率监听
    screenFun(s) {
      if (s >= 1920 && s <= 2100) {
        document.getElementsByTagName("body")[0].style.zoom = 0.9;
      } else if (s >= 1500 && s < 1920) {
        document.getElementsByTagName("body")[0].style.zoom = 0.8;
      }
    },
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
            console.log(result);
            let body = JSON.parse(result.body);
            console.log(body);
            switch (body.type) {
              case "timer":
                // 推送数量、当前价格
                this.socketData = body;
                break;
              case "deal":
                // 推送通知
                this.noticeData.push(body);
                Storage.localSet("noticeData", this.noticeData);
                this.noticeData = Storage.localGet("noticeData");
                break;
              case "stop":
              case "activate":
              case "over":
                // 暂停 继续 结束 屏幕
                this.auctionStatus = body;
                break;
              case "start":
                // 场次开始
                this.actionStart = body;
                break;
              default:
                console.log("请求出错");
                break;
            }
          });
        },
        err => {
          // 连接发生错误时的处理函数
          console.log("失败");
          console.log(err);
        }
      );
    }
  }
};
</script>
<style lang="less" scoped>
.screen {
  .vue-grid-item {
    // background: black;
    overflow: hidden;
  }
}
</style>

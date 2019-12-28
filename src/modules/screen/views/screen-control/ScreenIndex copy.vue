<template>
  <section v-loading="loading" class="screen" element-loading-text="拼命加载中......">
    <div class="page">
      <div>
        <el-row v-if="screenData.length <= 1">
          <el-col :span="22" v-for="(item, index) in screenData" :key="index" class="one" :style="{ height: hh + 'px' }">
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
          </el-col>
        </el-row>
        <el-row v-else-if="screenData.length <= 2">
          <el-col :span="22" v-for="(item, index) in screenData" :key="index" class="two" :style="{ height: hh + 'px' }">
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
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="11" v-for="(item, index) in screenData" :key="index" class="four" :style="{ height: hh + 'px' }">
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
          </el-col>
        </el-row>
      </div>
    </div>
  </section>
</template>
<script>
import ScreenPage from "./components/ScreenPage";
import ScreenNotice from "./components/ScreenNotice";
import Storage from "../../assets/js/Storage.js";
import Stomp from "stompjs";
export default {
  name: "ScreenControlPage",
  components: {
    ScreenPage,
    ScreenNotice
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
      hh: 500
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
        if (result.status === 200) {
          if (result.data.retcode === 1) {
            let sortScreenList = this._.sortBy(result.data.data.screenConfigs, ["screenCode"]);
            this.screenData = sortScreenList;
            let h = document.documentElement.clientHeight || document.body.clientHeight;
            let len = this.screenData.length;
            switch (len) {
              case 1:
                this.hh = h * 0.915;
                break;
              default:
                this.hh = (h * 0.874) / 2;
                break;
            }
            this.auctionPatern = result.data.data.auctionPatern;
            this.loading = false;
          } else {
            this.$message.error(result.data.retmsg);
            this.loading = false;
          }
        } else {
          this.$message.error("服务端错误!");
        }
      })
      .catch(err => {
        this.$message.error(err.statusText);
        console.log(err);
      });
    Storage.localGet("noticeData") !== null ? (this.noticeData = Storage.localGet("noticeData")) : Storage.localSet("noticeData", this.noticeData);
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
  width: 100%;
  height: 100%;
  .el-col-11 {
    width: 47%;
  }
  .one {
    margin: 2%;
    width: 96%;
  }
  .two {
    margin: 12% 2%;
    width: 47%;
    &:last-child {
      margin-left: 0;
    }
  }
  .four {
    margin: 2%;
    &:nth-child(2),
    &:nth-child(4) {
      margin-left: 0;
    }
    &:nth-child(1),
    &:nth-child(2) {
      margin-bottom: 0;
    }
  }
}
</style>

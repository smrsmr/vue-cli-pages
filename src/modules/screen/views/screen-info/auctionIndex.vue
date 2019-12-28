<template>
  <section class="auction-index" v-loading="loading" element-loading-text="拼命加载中......">
    <el-row>
      <el-col style="background: white;">
        <admin-header></admin-header>
      </el-col>
    </el-row>
    <el-row class="pad-t-30">
      <el-col class="auction-list">
        <ul>
          <li v-for="(item, index) in dataList" :key="index" @click="pushScreen(item)">
            <el-col :span="3" class="times">
              <el-row v-if="item.auctionBeginTime !== null">
                <el-row class="pad-t-54-f">
                  <el-col>{{ switchTime(item.auctionBeginTime, "DD") }}</el-col>
                </el-row>
                <el-row>
                  <el-col>{{ switchTime(item.auctionBeginTime, "YYYY") }}/{{ switchTime(item.auctionBeginTime, "MM") }}</el-col>
                </el-row>
              </el-row>
              <el-row v-else>
                <el-col style="padding: 69px 0;">---</el-col>
              </el-row>
            </el-col>
            <el-col :lg="16" :xl="17" class="notice">
              <div>
                <el-row>
                  <el-col>
                    <span class="meetingName">{{ item.meetingName }}</span>
                    <span class="auction-mode mar-l-5" v-if="item.auctionPatern === 'INCREASE'">增价拍卖模式</span>
                    <span v-else class="auction-mode mar-l-5 auction-mode-min">减价拍卖模式</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="notice-text">
                    <div v-html="item.screenNotice"></div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :lg="5" :xl="4" class="count-down">
              <span class="order" v-if="item.depositCount > 0">已预约</span>
              <el-row class="date-text">
                <el-col>开拍倒计时</el-col>
              </el-row>
              <el-row class="time-num">
                <el-col v-if="item.status === 'DURING_AUCTION'" :key="item.id">竞拍中</el-col>
                <!-- <el-col
                  v-if="item.status==='DURING_AUCTION' && dealWithTime(item.auctionBeginTime)"
                  :key="item.id"
                >竞拍中</el-col>-->
                <el-col v-else-if="item.status === 'END_AUCTION'" :key="item.id">拍卖结束</el-col>
                <el-col v-else-if="item.status === 'PENDING' && timeRange(item.auctionBeginTime)" :key="item.id">准备中</el-col>
                <el-col v-else-if="(item.status === 'AGREE' || item.status === 'PUBLICITY') && timeRange(item.auctionBeginTime)" :key="item.id">
                  <count-down :endTime="item.auctionBeginTime" endText="竞拍中" @updateList="updateList"></count-down>
                </el-col>
                <!-- <el-col
                  v-else-if="item.status==='DURING_AUCTION' && !dealWithTime(item.auctionBeginTime)"
                  :key="item.id"
                >正在处理中</el-col>-->
                <el-col v-else>已过期</el-col>
              </el-row>
            </el-col>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16" :push="7">
        <!-- 分页按钮 -->
        <div class="mar-t-20 mar-b-10 text-right mar-r-30">
          <el-pagination
            background
            @size-change="setAuctionSizeChange"
            @current-change="setAuctionCurrentChange"
            :current-page="currentPage"
            :page-sizes="[4, 10, 20, 30, 40]"
            :page-size="totalPage"
            layout="total,sizes ,prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import AdminHeader from "../../components/AdminHeader";
import CountDown from "./components/CountDown";
import moment from "moment";
import Storage from "../../assets/js/Storage";
export default {
  name: "auctionIndex",
  components: { AdminHeader, CountDown },
  data() {
    return {
      currentPage: 1, // 分页 当前页数
      totalPage: 4, // 分页 每页显示多少条
      total: null,
      dataList: [],
      loading: false
    };
  },
  mounted() {
    // 进入页面自动全屏
    this.fullScreenFun();
    // 列表初始化 清空本地公告缓存数组和竞价数组
    Storage.localSet("noticeData", []);
    Storage.localSet("recordPrice", []);
    let params = {
      auditStatus: "AGREE",
      sortField: "auction_begin_time",
      pageNo: this.currentPage,
      pageSize: this.totalPage
    };
    this.getTable(params);
  },
  methods: {
    // 初始化获取数据
    getTable(params) {
      this.$api.SCREEN.queryPageByMeeting(params)
        .then(result => {
          this.loading = false;
          if (result.data.retcode === 1) {
            // console.log(result.data);
            this.total = result.data.total;
            this.dataList = result.data.rows;
          } else {
            this.$message.error(result.data.retmsg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 全屏方法
    fullScreenFun() {
      let iFullscreen = false; //当前是否全屏状态
      let fullscreenEnabled =
        document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;
      if (fullscreenEnabled) {
        let de = document.documentElement;
        if (iFullscreen) {
          //关闭全屏
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          }
        } else {
          //打开全屏
          if (de.requestFullscreen) {
            de.requestFullscreen();
          } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
          } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
          }
        }
      } else {
        alert("浏览器当前不能全屏");
      }
    },
    // 时间组件触发的
    updateList() {
      console.log("时间组件触发的");
      // let params = {
      //   auditStatus: "AGREE",
      //   sortField: "auction_begin_time",
      //   pageNo: this.currentPage,
      //   pageSize: this.totalPage
      // };
      // this.getTable(params);
    },
    // 设置显示每页多少条数据
    setAuctionSizeChange(currentPage) {
      this.loading = true;
      console.log(`每页 ${currentPage} 条`);
      this.totalPage = currentPage;
      let params = {
        auditStatus: "AGREE",
        sortField: "auction_begin_time",
        pageNo: this.currentPage,
        pageSize: this.totalPage
      };
      this.getTable(params);
    },
    // 设置当前页码
    setAuctionCurrentChange(val) {
      this.loading = true;
      console.log(`当前页: ${val} `);
      this.currentPage = val;
      let params = {
        auditStatus: "AGREE",
        sortField: "auction_begin_time",
        pageNo: this.currentPage,
        pageSize: this.totalPage
      };
      this.getTable(params);
    },
    // 转换时间戳
    switchTime(t, format) {
      return moment(t).format(format);
    },
    // 计算不过期时间的范围
    timeRange(timestamp) {
      let et = moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
      let nowTime = new Date();
      let endTime = new Date(timestamp);
      let range = endTime.getTime() - nowTime.getTime();
      return range >= 0 ? true : false;
    },
    // 计算正在 处理中范围
    dealWithTime(timestamp) {
      // 当天时间
      let nowDate = moment().format("YYYY-MM-DD");
      // 拍卖那天时间
      let auctionDate = moment(timestamp).format("YYYY-MM-DD");
      let auctionDateStart = moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
      let nowDateEnd = `${nowDate} 23:59:59`;
      if (auctionDate === nowDate) {
        //拍卖时间等于当天时间
        return auctionDateStart < nowDateEnd ? true : false;
      }
      return false;
    },
    // 跳转路由
    pushScreen(item) {
      let actionDay = moment(item.auctionBeginTime).format("YYYY-MM-DD HH:mm:ss");
      let nowTime = new Date();
      let endTime = new Date(actionDay);
      let t = endTime.getTime() - nowTime.getTime();
      let day = Math.floor(t / 86400000) * 24;
      let hour = Math.floor((t / 3600000) % 24) + day;
      let min = Math.floor((t / 60000) % 60);
      // 拍卖结束
      if (item.status === "END_AUCTION") {
        this.$alert("本场拍卖已结束", "", {
          confirmButtonText: "确定"
        });
        return;
      }
      // 拍卖中
      if (item.status === "DURING_AUCTION") {
        this.$router.push({
          path: "/screen-info/screen",
          query: {
            meetingId: item.id,
            auctionPatern: item.auctionPatern,
            time: item.auctionBeginTime
          }
        });
        return;
      }
      // 公示中或者同意的状态
      if (item.status === "PUBLICITY") {
        // 只有当倒计时小于五分钟
        if (hour <= 0 && min < 5) {
          this.$router.push({
            path: "/screen-info/screen",
            query: {
              meetingId: item.id,
              auctionPatern: item.auctionPatern,
              time: item.auctionBeginTime
            }
          });
          return;
        } else {
          this.$alert("最多只能提前 5 分钟进场", "", {
            confirmButtonText: "确定"
          });
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.auction-index {
  width: 100%;
  .auction-list {
    padding-left: 121px;
    padding-right: 121px;
    ul {
      li {
        width: 100%;
        height: 200px;
        margin-bottom: 20px;
        border: 2px solid rgba(210, 151, 82, 1);
        box-shadow: 4px 4px 5px 0px rgba(0, 0, 0, 0.07);
        overflow: hidden;
        cursor: pointer;
        background-color: rgba(210, 151, 82, 1);
        .times {
          height: 196px;
          text-align: center;
          background: url("../../assets/images/37bac.png") center center no-repeat;
          background-size: 100% 100%;
          font-size: 32px;
          color: rgba(248, 248, 248, 1);
          box-sizing: border-box;
          letter-spacing: 2px;
          .pad-t-54-f {
            padding-top: 54px;
            font-size: 51px;
          }
        }
        .notice {
          height: 100%;
          overflow: hidden;
          padding-left: 18px;
          padding-top: 12px;
          padding-right: 80px;
          padding-bottom: 10px;
          background-color: rgba(248, 248, 248, 1);
          .meetingName {
            font-size: 24px;
            font-weight: bold;
          }
          .auction-mode,
          .auction-mode-min {
            display: inline-block;
            width: 101px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            font-size: 14px;
            background-color: #ab5d01;
            color: #fff;
            vertical-align: text-bottom;
          }
          .auction-mode-min {
            background-color: darkorange;
          }
          .notice-text {
            padding-top: 18px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 6;
            -webkit-box-orient: vertical;
            color: #777;
          }
        }
        .count-down {
          position: relative;
          height: 100%;
          background-color: rgba(248, 248, 248, 1);
          .order {
            position: absolute;
            right: 0;
            top: 0;
            width: 82px;
            height: 56px;
            background: rgba(210, 151, 82, 1);
            color: rgba(255, 255, 255, 1);
            line-height: 56px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
          }
          .date-text {
            padding-top: 90px;
            font-size: 19px;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            line-height: 44px;
            letter-spacing: 6px;
          }
          .time-num {
            text-align: left;
            font-size: 39px;
            font-weight: bold;
            color: rgba(225, 16, 16, 1);
          }
        }
      }
    }
  }
}
</style>

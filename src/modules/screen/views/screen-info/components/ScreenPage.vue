<template>
  <!-- 屏幕数据显示组件 -->
  <section class="screen-page" v-loading="loading" element-loading-text="数据加载中......">
    <section>
      <el-row>
        <el-col style="background: white;">
          <admin-header></admin-header>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <vue-seamless-scroll :data="noticeArray" :class-option="optionLeft" class="seamless-warp">
            <ul class="item">
              <li v-for="(item, index) in noticeArray" :key="index">
                {{ item.bidderName }} 成交{{ item.productName }} {{ item.ruleName }} {{ item.mass }}KG，成交价 {{ item.price / 100 }} 元 / KG。
              </li>
            </ul>
          </vue-seamless-scroll>
          <el-row class="mar-t-30 mar-l-20 pad-b-30">
            <el-col :span="24" class="tap-num">
              <el-button
                v-for="(item, index) in screenArray"
                :key="index"
                :class="activeScreenNum === index + 1 ? 'active' : ''"
                class="mar-r-30"
                @click.native="activeScreen(item, index)"
                >{{ `00${item.screenCode}` }}</el-button
              >
            </el-col>
          </el-row>
          <el-row class="mark-info">
            <el-col :lg="8" :xl="8" class="mar-r-30">
              <img v-if="auctionInfo['attachPath'] !== null" :src="auctionInfo.attachPath" class="img-border" alt />
              <img v-else src="../../../assets/images/img404.png" class="img-border" alt />
            </el-col>
            <el-col :lg="15" :xl="15">
              <el-row>
                <el-col :span="12">
                  竞价模式:
                  <span class="red font-b">{{ auctionPatern === "INCREASE" ? "增价" : "减价" }}</span>
                </el-col>
                <el-col :span="12">
                  当前拍卖轮数:
                  <span class="red font-b">{{ socketInfoData.index == null ? 0 : socketInfoData.index }}</span>
                </el-col>
              </el-row>
              <el-row class="pad-b-20 pad-t-20">
                <el-col :span="12">场次名称: {{ meetingName }}</el-col>
                <el-col :span="12">本次拍卖数量（kg)：{{ auctionInfo.totalMass == null ? 0 : auctionInfo.totalMass }}</el-col>
              </el-row>
              <el-row class="pad-b-20">
                <el-col :span="12">批次号: {{ auctionInfo.batchCode == null ? "----" : auctionInfo.batchCode }}</el-col>
                <el-col :span="12">
                  本次拍卖剩余数量（kg)：
                  <span class="red font-b">{{ socketInfoData.lessMass == null ? 0 : socketInfoData.lessMass }}</span>
                </el-col>
              </el-row>
              <el-row class="pad-b-20">
                <el-col :lg="5" :xl="12">品种：{{ auctionInfo.productName == null ? "----" : auctionInfo.productName }}</el-col>
                <el-col :lg="6" :xl="12">看货数量 (kg): {{ auctionInfo["depositInfo"] == null ? 0 : auctionInfo["depositInfo"].holdBuyMass }}</el-col>
                <el-col :lg="6" :xl="12" class="hidden-xl-only">规格：{{ auctionInfo.ruleName }}</el-col>
                <el-col :lg="6" :xl="12" class="hidden-xl-only">是否提供发票：{{ auctionInfo.provideInvoice === "N" ? "否" : "是" }}</el-col>
                <el-col :lg="6" :xl="12" class="pad-t-20 hidden-lg-and-down"
                  >规格：{{ auctionInfo.ruleName == null ? "----" : auctionInfo.ruleName }}</el-col
                >
                <el-col :lg="6" :xl="12" class="pad-t-20 hidden-lg-and-down" v-if="auctionInfo.provideInvoice === 'N'">是否提供发票：否</el-col>
                <el-col :lg="6" :xl="12" class="pad-t-20 hidden-lg-and-down" v-else-if="auctionInfo.provideInvoice === 'Y'">是否提供发票：是</el-col>
                <el-col :lg="6" :xl="12" class="pad-t-20 hidden-lg-and-down" v-else>是否提供发票：----</el-col>
              </el-row>
              <el-row class="pad-b-20">
                <el-col :span="12" v-if="auctionInfo.provideProofOrigin === 'N'">是否提供产地证明：否}}</el-col>
                <el-col :span="12" v-else-if="auctionInfo.provideProofOrigin === 'Y'">是否提供产地证明：是</el-col>
                <el-col :span="12" v-else>是否提供产地证明：----</el-col>
                <el-col :span="12" v-if="auctionInfo.qualityPath !== null">
                  <a href="javascript:;" @click="openQuality(auctionInfo.qualityPath)">查看质检报告</a>
                </el-col>
              </el-row>
              <el-row class="pad-b-20">
                <el-col :span="auctionPatern === 'INCREASE' ? 12 : 24" class="font-b">
                  当前价格:
                  <span class="red">{{ (socketInfoData.currentPrice == null ? "0" : socketInfoData.currentPrice) / 100 }}</span> 元/KG
                </el-col>
                <el-col :span="12" v-if="auctionPatern === 'INCREASE'" class="font-b">
                  下次报价:
                  <span class="red">{{ ((socketInfoData.currentPrice == null ? 0 : socketInfoData.currentPrice) + priceChange) / 100 }}</span> 元/KG
                </el-col>
              </el-row>
              <el-row class="pad-b-30">
                <el-col :span="12" class="font-b">
                  <el-col :span="5">距结束:</el-col>
                  <el-col v-if="!activeScreenArray.includes(screenId)" :span="18" class="red text-l-h" :key="auctionInfo.id"
                    >{{ hours }}:{{ minutes }}:{{ seconds }}</el-col
                  >
                  <el-col v-else :span="18" class="red text-l-h" :key="auctionInfo.id">已暂停</el-col>
                </el-col>
                <el-col :span="12" class="order">
                  <el-button @click="bidding" :disabled="activeScreenArray.includes(screenId)">出价</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="pad-l-20">
              <el-button @click="goBack">返回列表</el-button>
            </el-col>
          </el-row>
          <el-row class="pad-l-20 pad-t-20">
            <el-col class="mark-table">
              <el-table :data="tableData" style="width: 100%;" border max-height="147">
                <el-table-column type="index" label="中标记录" width="140"></el-table-column>
                <el-table-column prop="batchCode" label="批次"></el-table-column>
                <el-table-column prop="productName" label="标的名称"></el-table-column>
                <el-table-column prop="ruleName" label="规格"></el-table-column>
                <el-table-column label="数量(KG)">
                  <template slot-scope="scope">{{ scope.row.mass }}</template>
                </el-table-column>
                <el-table-column label="中标价格(元)">
                  <template slot-scope="scope">{{ scope.row.offerAmount / 100 }}</template>
                </el-table-column>
                <el-table-column label="中标时间" width="220">
                  <template slot-scope="scope">{{ switchTime(scope.row.oprTime, "YYYY-MM-DD HH:mm:ss") }}</template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-col>
        <el-col :lg="6" :xl="6" class="mark-table pad-t-30 pad-r-20 pad-l-30" v-if="auctionPatern === 'INCREASE'">
          <el-table
            :data="tableDataRecord"
            style="width: 100%;"
            border
            max-height="580"
            :row-class-name="tableRowClassName"
            v-loading="loadingList"
            element-loading-text="列表数据加载中"
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column type="index" label="出价记录" width="90" :index="indexMethod"></el-table-column>
            <el-table-column label="中标价（元）">
              <template slot-scope="scope">{{ scope.row.price / 100 }}</template>
            </el-table-column>
            <el-table-column label="时间" width="120">
              <template slot-scope="scope">{{ switchTime(scope.row.addTime, "HH:mm:ss") }}</template>
            </el-table-column>
          </el-table>
        </el-col>
        <!-- <el-col class="pad-t-30">
          <time-circle :totalTime="socketInfoData.totalTime" :setTimer="socketInfoData.lessTime"></time-circle>
        </el-col> -->
      </el-row>
      <el-dialog title="" :visible.sync="isQualityDialog" width="80%">
        <section style="height: 600px;">
          <iframe :src="auctionInfo.qualityPath" frameborder="0" width="100%" height="100%"></iframe>
        </section>
      </el-dialog>
    </section>
  </section>
</template>
<script>
import vueSeamlessScroll from "vue-seamless-scroll";
import AdminHeader from "../../../components/AdminHeader";
import moment from "moment";
import Storage from "../../../assets/js/Storage.js";
import "element-ui/lib/theme-chalk/display.css";
export default {
  name: "ScreenPage",
  components: {
    vueSeamlessScroll,
    AdminHeader
  },
  props: {
    // 屏幕编号
    screenID: {
      type: String,
      default: "1"
    },
    //websocket传输的数据
    socketData: {
      type: Object,
      default() {
        return {};
      }
    },
    // 公告数据列表
    noticeData: {
      type: Array,
      default() {
        return [];
      }
    },
    // 刷新报价记录
    record: {
      type: Object,
      default() {
        return {};
      }
    },
    // 增价的时候 侧边栏数组
    recordPrice: {
      type: Array,
      default() {
        return [];
      }
    },
    // 监听socket开始阶段
    actionStart: {
      type: Object,
      default() {
        return {};
      }
    },
    // 监听暂停
    actionStop: {
      type: Object,
      default() {
        return {};
      }
    },
    // 监听继续
    actionActivate: {
      type: Object,
      default() {
        return {};
      }
    },
    // 标的屏幕结束
    actionOver: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    // 公告数据列表
    noticeData: {
      handler(value) {
        let noticeArray = value.filter(v => v.meetingId === parseInt(this.meetingId));
        this.noticeArray = noticeArray;
      }
    },
    // 刷新报价记录
    record: {
      handler(value) {
        if (value.bidderId === this.userId) {
          this.queryBidByMeeting(this.meetingId);
        }
      }
    },
    // 监听暂停
    actionStop: {
      handler(value) {
        // if (value.batchId === this.batchId) {}
        this.activeScreenArray.push(value.screenId);
      }
    },
    // 监听继续
    actionActivate: {
      handler(value) {
        // if (value.batchId === this.batchId) {}
        let index = this.activeScreenArray.indexOf(value.screenId);
        if (index > -1) this.activeScreenArray.splice(index, 1); //存在就删除
      }
    },
    // 获取增价报价记录
    recordPrice: {
      handler(value) {
        let tableDataRecord = value.filter(v => v.batchId === this.batchId);
        this.tableDataRecord = tableDataRecord;
      }
    },
    // 监听socket开始阶段
    actionStart: {
      handler(value) {
        let localArray = Storage.localGet("recordPrice");
        let tableDataRecord = localArray.filter(v => v.batchId === this.batchId);
        this.tableDataRecord = tableDataRecord;
        this.$api.SCREEN.queryLotInfoByMeetingScreen(this.screenId)
          .then(result => {
            if (result.data.retcode === 1) {
              this.auctionInfo = result.data.data;
              this.priceChange = result.data.data.priceChange;
              this.batchId = result.data.data.batchId;
              this.loading = false;
            } else {
              this.auctionInfo = {
                depositInfo: null,
                attachPath: null
              };
              this.$message.error(result.data.retmsg);
              this.loading = false;
            }
          })
          .catch(err => {
            console.log(err);
            this.loading = false;
          });
      }
    },
    // 获取socket数组
    socketData: {
      handler(value) {
        if (value.screenId === this.screenId) {
          this.socketInfoData = value;
          this.batchId = value.batchId;
          let params = {
            batchId: value.batchId,
            index: value.index
          };
          let localArray = Storage.localGet("recordPrice");
          let filterArray = localArray.filter(v => v.batchId === value.batchId && v.index === value.index);
          if (filterArray.length <= 0 && this.idRecordData) {
            this.queryBidByBatch(params);
          }
        }
      }
    },
    // 屏幕结束拍卖监听
    actionOver: {
      handler(value) {
        if (value.screenId === this.screenId) {
          this.socketInfoData = value;
          this.socketInfoData["currentPrice"] = null;
          this.socketInfoData["lessTime"] = null;
          this.socketInfoData["index"] = null;
          // 标的竞价结束清空竞价列表和本地缓存
          this.tableDataRecord = [];
          Storage.localSet("recordPrice", []);
          this.$api.SCREEN.queryLotInfoByMeetingScreen(this.screenId)
            .then(result => {
              if (result.data.retcode === 1) {
                this.auctionInfo = result.data.data;
                this.batchId = result.data.data.batchId;
                this.priceChange = result.data.data.priceChange;
                this.loading = false;
              } else {
                this.auctionInfo = {
                  depositInfo: null,
                  attachPath: null
                };
                this.priceChange = 0;
                this.$message.error(result.data.retmsg);
                this.loading = false;
              }
            })
            .catch(err => {
              console.log(err);
              this.loading = false;
            });
        }
      }
    }
  },
  data() {
    return {
      activeScreenNum: 1,
      auctionPatern: null,
      isPrice: false,
      isTime: true,
      // 屏幕id
      screenId: null,
      // 底部列表数据
      tableData: [],
      // 增价侧边栏数据
      tableDataRecord: [],
      // 场次id
      meetingId: null,
      // 屏幕批次信息数组
      auctionInfo: {
        depositInfo: {},
        qualityPath: null,
        attachPath: null
      },
      loading: true,
      // 屏幕渲染数组
      screenArray: [],
      // 第一屏id
      firstID: null,
      // socket数组
      socketInfoData: {
        currentPrice: null
      },
      // 用户id
      userId: null,
      // 增价价格
      priceChange: 0,
      // 批次id
      batchId: null,
      // 场次名称
      meetingName: null,
      // 看货数量
      holdBuyMass: null,
      // 公告数组
      noticeArray: [],
      loadingList: false,
      // 存放暂停、继续的屏幕id数组
      activeScreenArray: [],
      idRecordData: true,
      isQualityDialog: false,
      auctionBeginTime: null
    };
  },
  computed: {
    // 公告滚动自定义
    optionLeft() {
      return {
        step: 2, // 数值越大速度滚动越快
        limitMoveNum: 1, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 2, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      };
    },
    day() {
      return Math.floor(this.socketInfoData.lessTime / (3600 * 24)) >= 1 ? Math.floor(this.socketInfoData.lessTime / (3600 * 24)) : 0;
    },
    hours() {
      return Math.floor((this.socketInfoData.lessTime % (3600 * 24)) / 3600) >= 1
        ? Math.floor((this.socketInfoData.lessTime % (3600 * 24)) / 3600)
        : 0;
    },
    minutes() {
      return Math.floor((this.socketInfoData.lessTime % 3600) / 60) >= 1 ? Math.floor((this.socketInfoData.lessTime % 3600) / 60) : 0;
    },
    seconds() {
      return Math.floor(this.socketInfoData.lessTime % 60) >= 1 ? Math.floor(this.socketInfoData.lessTime % 60) : 0;
    }
  },
  mounted() {
    const { meetingId, auctionPatern, time } = this.$route.query;
    this.meetingId = meetingId;
    this.auctionPatern = auctionPatern;
    this.auctionBeginTime = time;
    let { id } = Storage.localGet("userInfo");
    this.userId = id;
    // 获取屏幕数据
    this.$api.SCREEN.queryMeetingConfig(this.meetingId)
      .then(result => {
        this.loading = true;
        if (result.data.retcode === 1) {
          let sortScreenList = this._.sortBy(result.data.data.screenConfigs, ["screenCode"]);
          this.screenArray = sortScreenList.filter(v => v.type === "AUCTION");
          this.firstID = this.screenArray[0].id;
          this.screenId = this.screenArray[0].id;
          this.meetingName = result.data.data.meetingName;
          // 默认获取第一屏数据
          if (this.screenArray.length <= 0) return;
          this.$api.SCREEN.queryLotInfoByMeetingScreen(this.firstID)
            .then(result => {
              if (result.data.retcode === 1) {
                this.auctionInfo = result.data.data;
                this.batchId = result.data.data.batchId;
                let localArray = Storage.localGet("recordPrice");
                let tableDataRecord = localArray.filter(v => v.batchId === this.batchId);
                this.tableDataRecord = tableDataRecord;
                this.priceChange = result.data.data.priceChange;
                this.loading = false;
              } else {
                this.auctionInfo = {
                  depositInfo: null,
                  qualityPath: null,
                  attachPath: null
                };
                this.$message.error(result.data.retmsg);
                this.loading = false;
              }
            })
            .catch(err => {
              console.log(err);
              this.loading = false;
            });
        } else {
          this.loading = false;
          this.$message.error(result.data.retmsg);
        }
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      });
    this.queryBidByMeeting(this.meetingId);
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$router.push({ path: "/screen-info/auctionIndex" });
    },
    // 增价的时候出价记录列表id倒叙方法
    indexMethod(index) {
      return this.tableDataRecord.length - index;
    },
    // 打开质检弹框
    openQuality(url) {
      this.isQualityDialog = true;
    },
    // 获取增价报价历史记录
    queryBidByBatch(params) {
      this.loadingList = true;
      this.$api.SCREEN.queryBidByBatch(params)
        .then(result => {
          if (result.data.retcode === 1) {
            let data = result.data.data;
            let localArray = Storage.localGet("recordPrice");
            // 先合并
            let concatArray = this._.concat(data, localArray);
            // 再去重 price相同的
            let uniqByArray = this._.uniqBy(concatArray, "price");
            Storage.localSet("recordPrice", []);
            Storage.localSet("recordPrice", uniqByArray);
            let tableDataRecord = uniqByArray.filter(v => v.batchId === this.batchId);
            this.tableDataRecord = tableDataRecord;
            this.loadingList = false;
            this.idRecordData = false;
          } else {
            this.$message.error(result.data.retmsg);
            this.loadingList = false;
            this.idRecordData = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 屏幕切换方法
    activeScreen(item, index) {
      index += 1;
      this.activeScreenNum = index;
      this.screenId = item.id;
      this.loading = true;
      this.idRecordData = true;
      this.$api.SCREEN.queryLotInfoByMeetingScreen(item.id)
        .then(result => {
          if (result.data.retcode === 1) {
            this.auctionInfo = result.data.data;
            this.batchId = result.data.data.batchId;
            this.tableDataRecord.length = 0;
            let tableDataRecord = Storage.localGet("recordPrice").filter(v => v.batchId === this.batchId);
            this.tableDataRecord = tableDataRecord;
            this.priceChange = result.data.data.priceChange;
            // 切换屏幕重置socket数据
            this.socketInfoData = {};
            setTimeout(() => {
              this.loading = false;
            }, 600);
          } else {
            this.$message.error(result.data.retmsg);
            this.socketInfoData = {};
            this.priceChange = 0;
            this.auctionInfo = {
              depositInfo: null,
              qualityPath: null,
              attachPath: null
            };
            this.tableDataRecord = [];
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 表格高亮
    tableRowClassName({ row, rowIndex }) {
      if (row.bidderId === this.userId) {
        return "warning-row";
      }
      return "";
    },
    // 获取竞价记录
    queryBidByMeeting(meetingId) {
      this.$api.SCREEN.queryBidByMeeting(meetingId)
        .then(result => {
          if (result.data.retcode === 1) {
            this.tableData = result.data.data;
          } else {
            this.$message.error(result.data.retmsg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 转换时间戳
    switchTime(t, ydm) {
      return moment(t).format(ydm);
    },
    // 竞买/报价
    bidding() {
      let types = this.auctionPatern === "INCREASE" ? "up" : "down";
      let params = {
        type: types,
        batchId: this.auctionInfo.batchId
      };
      this.$api.SCREEN.bidding(params)
        .then(result => {
          if (result.data.retcode === 1) {
            this.$message({
              message: result.data.retmsg,
              type: "success"
            });
          } else {
            this.$message.error(result.data.retmsg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="less">
.count-down {
  .el-loading-mask {
    background-color: black;
  }
}
.mark-table {
  .el-table th,
  .el-table tr {
    background-color: black;
    color: #ffffff;
  }
  .warning-row {
    td {
      background-color: red;
      color: white;
    }
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #212e3e !important;
  }
  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
    border-right: 1px solid #ffffff;
  }
  .el-table td,
  .el-table th {
    text-align: center;
    font-size: 20px;
    font-weight: 100;
  }
  .el-table__body-wrapper {
    background-color: black;
    .el-table__empty-text {
      color: white;
    }
  }
}
@media screen and (min-width: 1200px) and (max-width: 1900px) {
  .mark-table {
    .el-table td,
    .el-table th {
      font-size: 16px;
    }
  }
}
</style>
<style lang="less" scoped>
.screen-page {
  width: 96%;
  height: 96%;
  background-color: black;
  overflow-y: auto;
  color: white;
  margin: 0 auto;
  .tap-num {
    button {
      padding: 6px 50px;
      font-size: 20px;
    }
    .active {
      background-color: #ab5d01;
      border: 1px solid #ab5d01;
      color: white;
    }
  }
  .mark-info {
    padding-left: 20px;
    overflow: hidden;
    font-size: 20px;
    a {
      color: #ff0000;
      text-decoration: underline;
    }
    .img-border {
      width: 100%;
      max-width: 300px;
      height: 269px;
      vertical-align: middle;
      box-sizing: border-box;
      overflow: hidden;
      object-fit: cover;
    }
    .text-l-h {
      line-height: 32px;
    }
    .order {
      button {
        padding: 30px 80px;
        font-size: 20px;
      }
    }
  }
  .red {
    color: #ff0000;
  }

  .font-b {
    font-weight: bold;
  }
  .seamless-warp {
    overflow: hidden;
    height: 50px;
    font-size: 30px;
    width: 100%;
    ul.item {
      &:nth-child(2) {
        margin-left: -40px;
      }
      display: flex;
      li {
        float: left;
        width: 1200px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #ff0000;
      }
    }
  }
}
</style>
<style lang="less" scoped>
@media screen and (min-width: 1200px) and (max-width: 1900px) {
  .screen-page {
    .mark-info {
      font-size: 16px;
      .text-l-h {
        line-height: 26px;
      }
      .order {
        button {
          padding: 10px 30px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>

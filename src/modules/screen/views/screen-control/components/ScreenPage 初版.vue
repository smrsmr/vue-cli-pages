<template>
  <!-- 屏幕数据显示组件 -->
  <section class="screen-page">
    <section class="pad-b-30 steps-one pad-t-20" style="width:100%;">
      <el-row>
        <el-col :span="2.5" class="pad-l-20">
          <p class="screen-title text-center">{{ screenID }}</p>
        </el-col>
        <el-col :span="20" class="pad-t-20" :push="1">
          <vue-seamless-scroll :data="screenNoticeData" :class-option="optionLeft" class="seamless-warp">
            <ul class="item">
              <li v-for="(item, index) in screenNoticeData" :key="index">
                {{ item.bidderName }} 成交{{ item.productName }} {{ item.ruleName }} {{ item.mass }}KG，成交价 {{ item.price / 100 }} 元 / KG。
              </li>
            </ul>
          </vue-seamless-scroll>
        </el-col>
      </el-row>
      <el-row class="pad-b-20 pad-l-94 pad-r-30 batch-title">
        <el-col :span="12">
          {{ firstData.batchCode }}
          <span class="ticket" v-if="tableData.length > 0">
            {{ firstData.provideInvoice === "Y" ? "可开票" : "不可开票" }}
          </span>
        </el-col>
        <el-col :span="4">{{ firstData.productName }}</el-col>
        <el-col :span="4" :push="1">{{ firstData.ruleName }}</el-col>
        <el-col :span="3" :push="1">{{ firstData.flawDescribe }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="9" class="mark-image">
          <div class="img-border" v-if="tableData.length > 0">
            <img :src="firstData.attachPath" v-if="firstData.attachPath !== null" />
            <img src="../../../assets/images/img404.png" v-else />
          </div>
        </el-col>
        <el-col :span="7" class="mark-num">
          <el-row>
            <el-col>
              <p class="red">{{ screenData.lessMass || 0 }}</p>
              <p>数量(公斤)</p>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="7" class="mark-num">
          <el-row>
            <el-col>
              <p class="red text-center">{{ (screenData.currentPrice || 0) / 100 }}</p>
              <p class="text-center">当前价格(元/公斤)</p>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="11" class="mark-times" :push="tableData.length > 1 ? 1 : 2">
          <div class="bac">
            <p>距结束：{{ day }}天{{ hours }}时{{ minutes }}分{{ seconds }}秒</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="mark-table">
          <el-table :data="tableData" style="width: 100%;" border>
            <el-table-column type="index" label="即将拍卖" width="140"></el-table-column>
            <el-table-column prop="batchCode" label="批次" width="250"></el-table-column>
            <el-table-column prop="productName" label="标的名称" width="140"></el-table-column>
            <el-table-column prop="ruleName" label="规格" width="100"></el-table-column>
            <el-table-column label="数量">
              <template slot-scope="scope">{{ scope.row.totalMass }}KG</template>
            </el-table-column>
            <el-table-column label="现状及瑕疵">
              <template slot-scope="scope">{{ scope.row.flawDescribe === null ? "无瑕疵" : scope.row.flawDescribe }}</template>
            </el-table-column>
            <el-table-column label="最小起拍量">
              <template slot-scope="scope">{{ scope.row.startMass }}KG</template>
            </el-table-column>
            <el-table-column label="起拍价">
              <template slot-scope="scope">{{ scope.row.startingPrice / 100 }} 元/KG</template>
            </el-table-column>
            <el-table-column label="竞价周期">
              <template slot-scope="scope">{{ scope.row.auctionRoundTime }} 分钟</template>
            </el-table-column>
            <el-table-column v-if="auctionPatern === 'INCREASE'" label="延时周期">
              <template slot-scope="scope">{{ scope.row.auctionDelayedTime }} 分钟/次</template>
            </el-table-column>
            <el-table-column label="竞价模式">
              <template>
                {{ auctionPatern === "INCREASE" ? "增价" : "减价" }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </section>
    <div class="stop-box" v-if="status === 'stop'">
      <img src="../../../assets/images/pause.png" alt />
    </div>
  </section>
</template>
<script>
import vueSeamlessScroll from "vue-seamless-scroll";
export default {
  name: "ScreenPage",
  components: {
    vueSeamlessScroll
  },
  props: {
    // 拍卖状态 暂停 停止 继续
    auctionStatus: {
      type: Object,
      default() {
        return {};
      }
    },
    // 拍卖开始
    actionStart: {
      type: Object,
      default() {
        return {};
      }
    },
    // 竞价模式
    auctionPatern: {
      type: String,
      default: "REDUCTION"
    },
    // 屏幕编号
    screenID: {
      type: String,
      default: "1"
    },
    // 屏幕id
    id: {
      type: Number,
      default: 1
    },
    //websocket传输的数据
    socket: {
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
    }
  },
  data() {
    return {
      tableData: [],
      meetingId: null,
      firstData: {},
      screenData: {},
      screenNoticeData: [],
      status: "activate",
      img: "@/assets/images/img404.png"
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
      return Math.floor(this.screenData.lessTime / (3600 * 24)) >= 1 ? Math.floor(this.screenData.lessTime / (3600 * 24)) : 0;
    },
    hours() {
      return Math.floor((this.screenData.lessTime % (3600 * 24)) / 3600) >= 1 ? Math.floor((this.screenData.lessTime % (3600 * 24)) / 3600) : 0;
    },
    minutes() {
      return Math.floor((this.screenData.lessTime % 3600) / 60) >= 1 ? Math.floor((this.screenData.lessTime % 3600) / 60) : 0;
    },
    seconds() {
      return Math.floor(this.screenData.lessTime % 60) >= 1 ? Math.floor(this.screenData.lessTime % 60) : 0;
    }
  },
  watch: {
    // 拍卖开始
    actionStart: {
      handler(newValue) {
        this.queryAuctionScreenList(this.meetingId, this.id);
      }
    },
    // 父组件传过来的 数量 价格 对此进行筛选
    socket: {
      handler(newVlaue) {
        if (newVlaue.screenId === this.id) {
          this.screenData = newVlaue;
        }
      }
    },
    // 父组件传过来的公告数组 对此进行筛选
    noticeData: {
      handler(newArray) {
        this.screenNoticeData = newArray.filter(v => v.screenId === this.id);
      }
    },
    // 拍卖状态
    auctionStatus: {
      handler(newValue) {
        if (newValue.screenId === this.id) {
          this.status = newValue.type;
          if (newValue.type === "over") {
            this.queryAuctionScreenList(this.meetingId, this.id);
            this.screenData = {};
          }
        }
      }
    }
  },
  mounted() {
    const { meetingId } = this.$route.query;
    this.meetingId = meetingId;
    this.queryAuctionScreenList(this.meetingId, this.id);
  },
  methods: {
    // 获取表格数组
    queryAuctionScreenList(meetingId, screenId) {
      this.$axios
        .post(`/auction/screen/queryAuctionScreenList/${meetingId}/${screenId}`)
        .then(result => {
          if (result.status === 200) {
            if (result.data.retcode === 1) {
              if (result.data.data.length > 0) {
                this.tableData = result.data.data;
                this.firstData = result.data.data[0];
                this.tableData = this.tableData.slice(0, 2);
              } else {
                this.tableData = [];
                this.firstData = {};
              }
            } else {
              this.$message.error(result.data.retmsg);
            }
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error(err.statusText);
        });
    }
  }
};
</script>
<style lang="less">
.mark-table {
  padding: 1% 1% 0 1%;
  .el-table th,
  .el-table tr {
    background-color: black;
    color: #ffffff;
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
    font-size: 26px;
    font-weight: 100;
  }
  .el-table__body-wrapper {
    background-color: black;
    .el-table__empty-text {
      color: white;
    }
  }
}
</style>
<style lang="less" scoped>
.screen-page {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: black;
  color: white;
  .stop-box {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 999999;
    background-color: rgba(0, 0, 0, 0.9);
    img {
      max-width: 100%;
      vertical-align: middle;
    }
  }
  .screen-title {
    border: solid 8px #ffffff;
    width: 80px;
    height: 80px;
    line-height: 70px;
    box-sizing: border-box;
    font-size: 60px;
  }
  .font-w-b {
    font-weight: bold;
    font-size: 20px;
  }
  .pad-l-33 {
    padding-left: 33px;
  }
  .batch-title {
    padding-top: 2%;
    padding-left: 5%;
    font-size: 34px;
    .ticket {
      display: inline-block;
      height: 44px;
      padding: 0 6px;
      height: 44px;
      background-color: #111111;
      border-radius: 10px;
      border: solid 4px #ff1919;
      font-size: 24px;
      font-weight: 100;
      line-height: 39px;
      vertical-align: bottom;
    }
  }
  .mark-image {
    padding-top: 6px;
    padding-left: 3%;
    overflow: hidden;
    .img-border {
      width: 400px;
      max-width: 100%;
      border-radius: 10px;
      border: solid 8px #ffffff;
    }
    img {
      width: 100%;
      height: 100%;
      vertical-align: middle;
      box-sizing: border-box;
      overflow: hidden;
    }
  }
  .mark-num {
    padding-top: 74px;
    p {
      &:nth-child(1) {
        font-size: 130px;
        line-height: 68px;
        color: #de1818;
      }
      &:nth-child(2) {
        padding-top: 26px;
        padding-left: 17px;
        font-size: 40px;
        line-height: 68px;
        color: #ffffff;
      }
    }
  }
  .mark-times {
    padding-top: 5%;
    .bac {
      width: 584px;
      height: 59px;
      background-color: #ffffff;
      border-radius: 6px;
      p {
        font-size: 30px;
        line-height: 60px;
        color: #111111;
        text-align: center;
        font-weight: bold;
      }
    }
  }
  .red {
    color: #ff0000;
  }
  .seamless-warp {
    overflow: hidden;
    height: 40px;
    font-size: 40px;
    width: 100%;
    max-width: 2304px;
    ul.item {
      &:nth-child(2) {
        margin-left: -40px;
      }
      display: flex;
      li {
        float: left;
        width: 1200px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #ff0000;
      }
    }
  }
}
</style>

<template>
  <section class="navigation">
    <section class="admin-header mar-l-121 mar-r-30">
      <div class="logo-box">
        <div class="logo-box mar-r-30">
          <a href="http://www.paohe.cn" target="_blank" class="logo">
            <img src="../assets/images/admin-logo.png" alt="跑合网" />
          </a>
          <div class="logo-info mar-r-30 pad-l-15">中药材拍卖管理系统-竞价系统</div>
        </div>
      </div>
      <!--<div class="search-wrapper">
			<form class="search-form mar-l-30">
				<el-input
					class="search-input"
					v-model="input10"
					placeholder="输入服务或您需要的功能"
					clearable>
				</el-input>
				<button type="submit" class="search-btn">
					<i class="iconfont icon-f-search"></i>
				</button>
			</form>
      </div>-->
      <div class="header-right">
        <ul>
          <!-- <router-link to="/home/setting" tag="li" class="list-item mar-r-30">
					<i class="iconfont icon-f-setting mar-r-5"></i>个人设置
          </router-link>-->
          <!-- <router-link to tag="li" class="list-item mar-r-30">用户: {{user}}</router-link> -->
          <a class="mar-r-30" style="cursor: pointer;" @click="setRules">
            <img src="../assets/images/rules.png" alt style="vertical-align: bottom;width: 18px;" />
            拍卖规则
          </a>
          <a class="mar-r-30">
            <img src="../assets/images/user.png" alt style="vertical-align: bottom;width: 18px;" />
            用户: {{ user }}
          </a>
          <!--当前用户：{{ user }}-->
          <a @click="logout()" style="cursor: pointer;">
            <img src="../assets/images/ico_over.png" alt class="mar-r-5" style="vertical-align: middle;" />退出
          </a>
          <!--<router-link to="/login" tag="li" class="list-item mar-l-25 mar-r-30">
					<i class="iconfont icon-f-kefu mar-r-5"></i>客服
				</router-link>
				<router-link to="/home/feedback" tag="li" class="list-item mar-l-25">
					<i class="iconfont icon-f-fankui mar-r-5"></i>意见反馈
          </router-link>-->
        </ul>
      </div>
    </section>
    <el-row v-show="isRules">
      <!-- 背景 -->
      <div class="backdrop"></div>
      <!-- 规则 -->
      <div class="rules">
        <div class="title-img">
          <img src="../assets/images/title-img.png" alt />
        </div>
        <div class="text-main">
          <p>1. 自觉遵守国家、行业主管部门、行业协会有关法律、法规、行规，按照《文物艺术品拍卖规程》规范运作。</p>
          <p>2. 不超范围经营。</p>
          <p>3. 不将企业经营资质出租、出借或转让给其他机构和个人。</p>
          <p>4. 不拍卖国家禁止流通的物品。</p>
          <p>5. 不拍卖被盗或非法出境的其他国家文物。</p>
          <p>6. 不从事经营性鉴定业务。</p>
          <p>7. 不于拍卖前向委托人收取任何费用。</p>
          <p>8. 不知假拍假。</p>
          <p>9. 不以任何形式对拍卖标的进行虚假宣传。</p>
          <p>10. 及时公布企业经营情况和有关数据，自愿接受媒体等社会各界的监督。</p>
          <p>11. 坚决杜绝“假拍”行为。</p>
        </div>
      </div>
      <div>
        <p class="confirm" @click="confirm">我已知晓</p>
      </div>
    </el-row>
  </section>
</template>
<script>
import Storage from "../assets/js/Storage";
export default {
  name: "adminHeader",
  computed: {
    //当前用户
    user() {
      return JSON.parse(localStorage.getItem("userInfo")).userName;
    }
  },
  data() {
    return {
      input10: "",
      isRules: true
    };
  },
  mounted() {
    Storage.localGet("isRules") !== null ? Storage.localGet("isRules") : Storage.localSet("isRules", true);
    this.isRules = Storage.localGet("isRules");
  },
  methods: {
    //退出
    logout() {
      //定义token退出值
      localStorage.removeItem("token"); //清除token
      localStorage.removeItem("userInfo"); //清除userName
      localStorage.removeItem("isRules"); //清除userName
      this.$router.push("/login"); //跳转
    },
    // 设置规则
    setRules() {
      this.isRules = true;
      Storage.localSet("isRules", true);
    },
    // 确认规则
    confirm() {
      this.isRules = false;
      Storage.localSet("isRules", false);
    }
  }
};
</script>
<style lang="less">
.navigation {
  border-bottom: 2px solid #e7e7e7;
}
.mar-l-121 {
  margin-left: 121px;
}
.admin-header {
  display: flex;
  padding: 18px 0;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  .logo-box {
    display: flex;
    align-content: center;
    align-items: center;
    .logo {
      display: block;
      width: 72px;
      height: 23px;
    }
    .logo-info {
      font-size: 18px;
      font-weight: bold;
      color: #ab5d01;
      line-height: 1;
    }
  }
  .search-wrapper {
    margin: 0 auto;
    height: 36px;
    line-height: 36px;
    overflow: hidden;
    .search-form {
      overflow: hidden;
    }
    .search-input {
      float: left;
      width: 234px;
      height: 36px;
      line-height: 36px;
      input {
        height: 36px;
        line-height: 36px;
        border-radius: 0;
      }
    }
    .search-btn {
      float: left;
      width: 36px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background: #ddd;
      border: 1px solid #ccc;
      border-left: 0;
      &:hover {
        background: #eee;
        cursor: pointer;
      }
      .iconfont {
        font-size: 20px;
        color: #999;
      }
    }
  }
  .header-right {
    display: flex;
    .list-item {
      display: inline-block;
      font-size: 13px;
      cursor: pointer;
      height: 36px;
      line-height: 36px;
      color: #666;
      &:hover {
        color: #ab5d01;
      }
      &.router-link-exact-active {
        color: #ab5d01;
      }
      .iconfont {
        display: inline-block;
        font-size: 20px;
      }
    }
  }
}
.backdrop {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.6);
}
.rules {
  position: fixed;
  left: 50%;
  top: 42%;
  transform: translate(-50%, -50%);
  width: 764px;
  height: 524px;
  z-index: 9999991;
  background-color: #ffffff;
  border-radius: 12px;
  color: black;
  .title-img {
    position: relative;
    width: 100%;
    height: 147px;
    border-radius: 12px 12px 0 0;
    background-image: linear-gradient(149deg, #dabe88 0%, #cfae6d 100%), linear-gradient(#e8e8e8, #e8e8e8);
    background-blend-mode: normal, normal;
    img {
      position: absolute;
      left: 50%;
      top: -64px;
      transform: translateX(-50%);
      max-width: 100%;
      vertical-align: middle;
    }
  }
  .text-main {
    padding: 15px 25px;
    height: 377px;
    overflow: auto;
    p {
      font-size: 14px;
      line-height: 30px;
    }
  }
}
.confirm {
  position: fixed;
  left: 50%;
  top: 82%;
  transform: translate(-50%, -50%);
  width: 328px;
  height: 60px;
  z-index: 9999991;
  background-image: linear-gradient(185deg, #dabe88 0%, #cfae6d 100%), linear-gradient(#e2d19e, #e2d19e);
  background-blend-mode: normal, normal;
  border-radius: 14px;
  text-align: center;
  line-height: 60px;
  cursor: pointer;
  font-size: 23px;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  text-shadow: 1px 3px 0px rgba(141, 110, 51, 0.56);
}
@media screen and (min-width: 1200px) and (max-width: 1900px) {
  .rules {
    top: 47%;
  }
  .confirm {
    top: 88%;
  }
}
</style>

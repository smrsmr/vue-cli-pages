<template>
  <header class="site-header">
    <div class="container">
      <div class="logo-box">
        <a href="http://www.paohe.cn" target="_blank">
          <img src="../assets/images/logo.png" alt="跑合网" />
        </a>
        <span class="line"></span>
        <div class="logo-info">
          <router-link to="/" tag="span">{{slogan}}</router-link>
        </div>
      </div>
      <div class="message-box">
        {{message}}
        <span class="en">{{info}}</span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "siteHeader",
  props: ["slogan", "message", "info"],
  data() {
    return {};
  }
};
</script>


<style scoped lang="less">
.site-header {
  padding: 24px 0;
  width: 100%;
  .container {
    display: flex;
    align-content: center;
    align-items: center;
    overflow: hidden;
    .logo-box {
      display: block;
      display: flex;
      align-content: center;
      align-items: center;
      .line {
        margin: 4px 20px;
        width: 1px;
        height: 40px;
        background: #ccc;
      }
      img {
        width: 144px;
        height: 48px;
      }
      .logo-info {
        margin: 4px auto;
        font-size: 30px;
        color: #ab5d01;
        cursor: pointer;
      }
    }
    .message-box {
      flex: 1;
      text-align: right;
      display: block;
      padding: 5px 150px 4px 0;
      height: 40px;
      font-size: 24px;
      .en {
        font-size: 16px;
        color: #999;
      }
    }
  }
}
</style>
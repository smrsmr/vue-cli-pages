<template>
  <section class="forgotPassword">
    <el-row>
      <el-col :span="17" class="login-left"></el-col>
      <el-col :span="7" class="login-right">
        <i class="logo-bac-r">
          <img src="../../assets/images/logo-r.png" alt />
        </i>
        <el-row>
          <el-col :span="9" :push="2" class="mar-t-170">
            <p class="logo"></p>
          </el-col>
          <el-col :span="15" class="mar-t-170">
            <p class="title">中药材拍卖竞价系统</p>
          </el-col>
          <el-row>
            <el-col class="pad-t-65 tap-nav" :push="3" :span="21">
              <section class="box">
                <div>
                  <div class="form-container" style="width: 390px;">
                    <p class="pass-text">找回密码</p>
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="mar-t-20">
                      <el-form-item label prop="account">
                        <el-input type="text" maxlength="20" v-model="ruleForm.account" autocomplete="off" placeholder="请输入账号">
                          <i slot="prefix" class="icon-img">
                            <img src="../../assets/images/icon_User.png" alt />
                          </i>
                        </el-input>
                      </el-form-item>
                      <el-form-item label prop="mobile">
                        <el-input type="text" v-model="ruleForm.mobile" autocomplete="off" placeholder="请输入手机号">
                          <i slot="prefix" class="icon-img">
                            <img src="../../assets/images/icon_Phone.png" alt />
                          </i>
                        </el-input>
                      </el-form-item>
                      <el-form-item label prop="code" class="mar-b-20 form-item form-item-code">
                        <el-input v-model="ruleForm.code" placeholder="验证码" autocomplete="off" clearable>
                          <i slot="prefix" class="icon-img">
                            <img src="../../assets/images/icon_Code.png" alt />
                          </i>
                        </el-input>
                        <el-button
                          type="button"
                          v-model="codeText"
                          @click="sendCode()"
                          class="link-box code"
                          :disabled="isDisabledCode"
                          :class="{ disabled: isDisabledCode }"
                          >{{ codeText }}</el-button
                        >
                      </el-form-item>
                      <el-form-item label prop="newPass">
                        <el-input type="password" v-model="ruleForm.newPass" autocomplete="off" placeholder="请输入新密码">
                          <i slot="prefix" class="icon-img">
                            <img src="../../assets/images/icon_Key.png" alt />
                          </i>
                        </el-input>
                      </el-form-item>
                      <el-form-item label prop="checkPass">
                        <el-input
                          @keyup.enter.native="submitForm('ruleForm')"
                          type="password"
                          v-model="ruleForm.checkPass"
                          autocomplete="off"
                          placeholder="请再次输入密码"
                        >
                          <i slot="prefix" class="icon-img">
                            <img src="../../assets/images/icon_Key.png" alt />
                          </i>
                        </el-input>
                      </el-form-item>
                      <div class="text-center mar-t-30 mar-b-20">
                        <router-link to="/login">
                          <el-button type="default" class="mar-r-20" style="width: 160px;padding: 16px 20px;font-size: 16px;">返回</el-button>
                        </router-link>
                        <el-button
                          type="primary"
                          @click="submitForm('ruleForm')"
                          :loading="loadingBtn"
                          style="width: 160px;padding: 16px 20px;font-size: 16px;"
                          >确定</el-button
                        >
                      </div>
                    </el-form>
                  </div>
                </div>
              </section>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import "../../assets/less/index.less";
export default {
  name: "forgotPassword",
  data() {
    //验证手机号
    let checkMobile = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号不能为空"));
      } else {
        if (value !== "") {
          let reg = /^1[3456789]\d{9}$/;
          if (!reg.test(value)) {
            callback(new Error("请输入有效的手机号码"));
          }
        }
        callback();
      }
    };
    //验证新密码
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (value.length < 6) {
        callback(new Error("请输入6-20位密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("editPassword2");
        }
        callback();
      }
    };
    //验证再次输入密码
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("再次输入密码不能为空"));
      } else if (value.length < 6) {
        callback(new Error("请输入6-20位密码"));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      SUCCESS_CODE: 1, //请求成功的值
      SSXT: "server37", //系统名称
      isDisabledCode: false, //发送验证码是否可点击
      time: 0, //验证码倒计时时间
      loadingBtn: false, //登录按钮loading
      codeText: "获取验证码", //验证码文字
      //表单数据
      ruleForm: {
        account: "",
        mobile: "",
        code: "",
        newPass: "",
        checkPass: ""
      },
      //表单规则
      rules: {
        account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        mobile: [{ required: true, validator: checkMobile, max: 11, trigger: "blur" }],
        code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
        newPass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [{ required: true, validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.ruleForm.code = "";
  },
  methods: {
    //获取验证码
    sendCode() {
      this.time = 10; //设置倒计时时长
      const mobile = this.ruleForm.mobile;
      //验证后发送请求
      if (mobile) {
        let reg = /^1[3456789]\d{9}$/;
        if (reg.test(mobile)) {
          //请求验证码接口
          this.$api.SCREEN.sendCode(mobile, 2) //用途 1注册2找回密码3登录
            .then(res => {
              if (res.data.retcode === this.SUCCESS_CODE) {
                this.$message({
                  type: "success",
                  message: res.data.retmsg
                });
                this.timer();
              }
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err.data.retmsg
              });
            });
        } else {
          this.$message({
            type: "error",
            message: "请输入有效的手机号码"
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "手机号和账号不能为空"
        });
      }
    },
    //倒计时
    timer() {
      if (this.time > 1) {
        this.time--;
        this.isDisabledCode = true;
        this.codeText = this.time + "s后重新获取";
        console.log(this.time);
        setTimeout(this.timer, 1000);
      } else {
        this.isDisabledCode = false;
        this.time = 0;
        this.codeText = "重新获取验证码";
      }
    },
    //确定找回密码
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //后台要求传的参数
          let params = {
            account: this.ruleForm.account, //用户名
            mobile: this.ruleForm.mobile, //手机号
            code: this.ruleForm.code, //验证码
            pwd: this.ruleForm.newPass, //密码
            rePwd: this.ruleForm.checkPass, //二次密码
            ssxt: "server37", //系统名称
            type: 2 //传给后台写死的固定值 类型 1为修改密码，2为忘记密码
          };
          this.loadingBtn = true;
          this.$api.SCREEN.changePassword(params)
            .then(res => {
              if (res.data.retcode === this.SUCCESS_CODE) {
                this.loadingBtn = false;
                this.$message({
                  type: "success",
                  message: res.data.retmsg
                });
                this.$router.push("/login");
              } else {
                this.$message({
                  type: "error",
                  message: res.data.retmsg
                });
                this.loadingBtn = false;
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less">
// 去除谷歌浏览器默认记住密码的填充样式
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  border: 1px solid #ccc !important;
}
.tap-nav {
  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  .el-tabs__header {
    margin-left: 37px;
  }
  .el-tabs__item {
    padding: 0;
    font-size: 24px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }
  .el-tabs--top .el-tabs__item.is-top:last-child {
    padding-left: 99px;
  }
  .el-tabs__item.is-active {
    color: rgba(171, 93, 1, 1);
  }
  .el-input__inner {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    padding-left: 58px;
  }
}
</style>
<style lang="less" scoped>
.forgotPassword {
  .login-left {
    height: 100vh;
    background: url("../../assets/images/banner.png") center center no-repeat;
    background-size: 100%;
  }
  .login-right {
    position: relative;
    height: 100vh;
    background-color: #ededed;
    .logo-bac-r {
      position: absolute;
      right: 0;
      top: 0;
      width: 258px;
      height: 305px;
    }
    .mar-t-170 {
      margin-top: 170px;
    }
    .pad-t-65 {
      padding-top: 25px;
    }
    .pad-t-49 {
      padding-top: 49px;
    }
    .pad-t-51 {
      padding-top: 51px;
    }
    .logo {
      width: 167px;
      height: 48px;
      background: url("../../assets/images/logox1.png") center center no-repeat;
      background-size: 100% 100%;
    }
    .title {
      font-size: 26px;
      font-weight: bold;
      color: rgba(171, 93, 1, 1);
      line-height: 60px;
      padding-left: 19px;
      vertical-align: text-bottom;
    }
    .tap-nav {
      .icon-img {
        img {
          padding: 12px 14px 14px 15px;
        }
      }
      .form-item {
        position: relative;
        .forgotPassword {
          position: absolute;
          right: 0;
          top: 50%;
          width: 80px;
          height: 50px;
          color: #ab5d01;
          outline: none;
        }
        .link-box.code {
          right: 1px;
          top: 6px;
          background: #fff;
          color: #ce9f66;
          border: none;
          font-size: 16px;
        }
      }
      .scan-code {
        text-align: center;
        font-size: 24px;
        font-weight: 400;
        color: rgba(119, 119, 119, 1);
      }
    }
  }
  .form-container {
    padding: 10px 30px 0 0;
    border-radius: 6px;
    box-sizing: border-box;
    .pass-text {
      text-align: center;
      font-size: 24px;
      font-weight: 400;
      color: rgba(171, 93, 1, 1);
    }
  }
  .link-box.disabled {
    background: #ddd;
    cursor: no-drop;
  }
}
</style>

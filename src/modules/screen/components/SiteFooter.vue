<template>
  <footer class="site-footer">
    <div class="content">
      <div class="img-list">
        <a href="http://www.creditchina.gov.cn/" class="img-item" rel="nofollow">
          <img
            src="https://www.paohe.cn/static/resources/view/images/1xinyong.jpg"
            class="min"
            alt="信用中国"
          />
        </a>
        <a
          href="http://www.gdda.gov.cn/publicfiles/business/htmlfiles/jsjzz/index.htm"
          class="img-item"
          rel="nofollow"
        >
          <img
            src="https://www.paohe.cn/static/resources/view/images/2gdsyappin.jpg"
            class="min"
            alt="广东省食品药品监督管理局"
          />
        </a>
        <a href="http://www.gzjd.gov.cn/" class="img-item" rel="nofollow">
          <img
            src="https://www.paohe.cn/static/resources/view/images/3gonganju.jpg"
            class="min"
            alt="网络警察报警平台"
          />
        </a>
        <a
          href="http://netadreg.gzaic.gov.cn/ntmm/WebSear/WebLogoPub.aspx?logo=f43f7cfb88aa456d8d648fb5da28e6e4"
          class="img-item"
          rel="nofollow"
        >
          <img
            src="https://www.paohe.cn/static/resources/view/images/foot-ico2.jpg"
            class="min"
            alt="工商网监电子标识"
          />
        </a>
        <a href="http://www.12377.cn/" class="img-item" rel="nofollow">
          <img
            src="https://www.paohe.cn/static/resources/view/images/4zhonguo.jpg"
            class="min"
            alt="违法和不良信息举报中心"
          />
        </a>
        <a
          href="http://report.12377.cn:13225/toreportinputNormal_anis.do"
          class="img-item"
          rel="nofollow"
        >
          <img
            src="https://www.paohe.cn/static/resources/view/images/5jubaozhuanqu.jpg"
            alt="网上有害信息举报专区"
          />
        </a>
        <a href="http://www.gdjubao.cn/" class="img-item" rel="nofollow">
          <img
            src="https://www.paohe.cn/static/resources/view/images/6jubaozhongxin.jpg"
            alt="广东互联网违法和不良信息举报中心"
          />
        </a>
        <a
          href="https://credit.szfw.org/CX20180505080132300160.html"
          class="img-item"
          rel="nofollow"
          target="_blank"
        >
          <img
            src="https://www.paohe.cn/static/resources/view/images/7chengxinwangzhan.jpg"
            alt="诚信网站"
          />
        </a>
        <a
          href="https://v.pinpaibao.com.cn/cert/site/?site=www.paohe.cn&amp;at=realname"
          class="img-item"
          rel="nofollow"
          target="_blank"
        >
          <img
            src="https://www.paohe.cn/static/resources/view/images/8shimingyanzheng.jpg"
            alt="实名认证"
          />
        </a>
        <a
          href="https://ss.knet.cn/verifyseal.dll?sn=e180518440100739414ljq000000&amp;comefrom=trust&amp;trustKey=dn&amp;trustValue=www.paohe.cn"
          class="img-item"
          rel="nofollow"
          target="_blank"
        >
          <img
            src="https://www.paohe.cn/static/resources/view/images/9kexinwangzhan.jpg"
            alt="可信网站身份认证"
          />
        </a>
      </div>
      <div class="mar-b-5">
        <a href="https://www.paohe.cn/wechat/index.html" target="_blank" style="color:red;">查看手机版</a> |
        <a
          href="https://www.paohe.cn/view/help/certificate"
          target="_blank"
        >互联网药品信息服务资格证： (粤)-经营性-2017-0043</a> |
        <a
          href="https://www.paohe.cn/view/help/certificate"
          target="_blank"
        >信息系统安全等级保护备案证明： 4401181334900001</a>
      </div>
      <div>
        <a
          href="https://www.paohe.cn/view/help/certificate"
          target="_blank"
        >增值电信业务经营许可证： 粤B2-20170438</a> |
        <a href="https://www.paohe.cn/view/help/softwareTestReport" target="_blank">B2B-A证软件评估报告</a> |
        <a
          href="https://www.paohe.cn/view/help/certificate"
          target="_blank"
        >食品经营许可证：JY14401030195308</a>
      </div>
      <div class="text-height">
        <a
          target="_blank"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010302000320"
          style="display:inline-block;"
        >
          <img
            src="https://www.paohe.cn/static/resources/view/images/gaba01.png"
            style="float:left;"
          />
          <span style="color:#939393;">&nbsp;&nbsp;粤公网安备 44010302000320号</span>
        </a>
      </div>
      <div class="text-height">
        电话：020-81686869 地址：广东省广州市荔湾区东沙大道16号
        <a
          href="http://www.miitbeian.gov.cn"
          target="_blank"
        >粤ICP备17022914号</a>
      </div>
      <div class="text-height">Copyright©2008-2018 跑合网</div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "siteFooter",
  data() {
    return {};
  }
};
</script>

<style scoped lang="less">
.site-footer {
  padding: 39px 0 34px;
  text-align: center;
  color: #666;
  font-size: 13px;
  .content {
    overflow: hidden;
    .img-list {
      margin-bottom: 5px;
    }
    a {
      color: #666;
    }
    .img-item {
      margin: 0 5px;
      display: inline-block;
      color: #666;
      img {
        margin-left: -7px;
        width: 114px;
        height: 32px;
        border: 1px solid rgb(209, 209, 209);
        &.min {
          width: 90px;
          height: 32px;
        }
      }
    }
    .text-height {
      margin: 5px 0;
    }
  }
}
</style>
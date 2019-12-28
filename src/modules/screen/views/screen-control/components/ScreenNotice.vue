<template>
  <section class="notice-main">
    <el-row>
      <el-col>
        <div class="mar-l-10 mar-r-30" v-html="notice"></div>
      </el-col>
    </el-row>
  </section>
</template>
<script>
export default {
  name: "ScreenNotice",
  props: {
    notice: {
      type: String,
      default: "公告通知"
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
.notice-main {
  width: 100%;
  height: 100%;
  max-width: 1920px;
  font-size: 60px !important;
}
</style>

<template>
  <div class="app-container">
    <div class="search-wrap wrap">
      <p class="label">邀请码 :</p>
      <p class="copy_value" id="copy_value">{{ inviteCode }}</p>
      <el-button class="copy_btn" type="primary" @click="copyFunction()"
        >Copy</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inviteCode: "http://www.spiderexpro.com/register?invite=" + localStorage.getItem('invite_code'),
    };
  },
  created() {},
  methods: {
    copyFunction() {
      var copyText = document.getElementById("copy_value");

      navigator.clipboard.writeText(copyText.innerHTML);

      alert("Copied the text: " + copyText.innerHTML);
    },
  },
};
</script>

<style  lang="scss" scoped>
.wrap {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  .label {
    color: #606266;
    display: inline-block;
    font-size: 16px;
    line-height: 30px;
  }
  .copy_value {
    display: inline-block;
    font-size: 16px;
    line-height: 30px;
    margin-left: 10px;
  }
  .copy_btn {
    height: 40px;
    margin-left: 20px;
    display: inline-block;
  }
}
</style>
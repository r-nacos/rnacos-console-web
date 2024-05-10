<template>
  <div class="page-not-found">
    <div class="img">
      <img src="@//assets/images/prod/404.jpg" />
    </div>
    <div class="back">
      <NButton
        type="info"
        @click="goBack"
        class="btn"
      >
        返回
      </NButton>
    </div>
  </div>
</template>
<script lang="ts" setup title="404">
import { NButton } from 'naive-ui'
let router = useRouter()
const goBack = () => {
  router.go(-1)
}
</script>
<style lang="scss" scoped>
.page-not-found {
  background-color: #fff;
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
  .img {
    text-align: center;
    padding-top: 50px;

    img {
      display: inline-block;
      width: 500px;
      border-radius: 10px;
    }
  }

  .back {
    text-align: center;
    padding-top: 50px;
    padding-bottom: 100px;

    .btn {
      width: 150px;
    }
  }
}
</style>

<template>
<div>
  <n-upload
    action="/nacos/v1/console/config/import"
    :headers="{
      'tenant': 'from-header'
    }"
    :data="{
      'tenant': 'public'
    }"
    :show-file-list="false"
  >
    <n-button>上传文件</n-button>
  </n-upload>
</div>

</template>

<script>
</script>

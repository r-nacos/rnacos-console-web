<template>
  <div>
    <div class="diff-wrap">
      <div class="diff-item">
        <p>src:</p>
        <div>
          <textarea v-model="model.src" />
        </div>
      </div>
      <div class="diff-item">
        <p>dst:</p>
        <div>
          <textarea v-model="model.dst" />
        </div>
      </div>
    </div>
    <div>
      <button @click="doDiff">diff</button>
    </div>
    <div>
      <DiffComponent :src="model.src" :dst="model.dst" />
    </div>
  </div>
</template>

<script>
import {defineComponent,ref} from 'vue'

import DiffComponent from '@/components/config/DiffComponent.vue';

export default defineComponent({
  components:[
    DiffComponent
  ],
  setup() {
    var srcRef=ref('abc');
    var dstRef=ref('123');
    var modelRef = ref({
      src:'abc',
      dst:'123'
    })
    var doDiff=()=>{

    };
    return {
      doDiff,
      model:modelRef,
      "src":srcRef,
      "dst":dstRef,
    }
  }


})

</script>

<style scoped>
.diff-wrap {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 5px;
}
.diff-item {
  flex-grow: 1;
  padding: 5px;
}

.diff-item textarea {
  width: 100%;
  height: 100px;
}

</style>
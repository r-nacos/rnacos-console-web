<template>
    <n-select
    class='popselect'
    v-model:value="value.namespaceId"
    :options="optionList"
    size="medium"
    @update:value="update"
    scrollable
  >
    <n-button style="margin-right: 8px">
      {{ value.namespaceName || 'public' }}
    </n-button>
  </n-select>
    
</template>

<script lang="ts">
import {defineComponent} from 'vue'

import {namespaceStore} from '../../data/namespace'

export default defineComponent({
    emits:[
        "change"
    ],
    setup() {
    },
    data(){
        /*
        var obj={
            namespaceId:namespaceStore.current.namespaceId,
            namespaceName:namespaceStore.current.namespaceName,
        };
        */
        return {
            value:namespaceStore.current,
            optionList:namespaceStore.optionList,
        }
    },
    methods:{
        update(v:string){
            for(var item of this.optionList){
                if(item.value===v){
                    let obj ={
                        namespaceId:item.value,
                        namespaceName: item.label
                    }
                    this.value = obj;
                    namespaceStore.setCurrent(obj);
                    this.$emit("change");
                }
            }
        }
    },
    created(){
        namespaceStore.initLoad();
    }
})

</script>

<style scoped>

.popselect{
    width: 200px;
}

</style>

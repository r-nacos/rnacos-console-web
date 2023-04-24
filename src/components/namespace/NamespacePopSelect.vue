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

<script>
import {defineComponent} from 'vue'

import {namespaceStore} from '../../data/namespace'

export default defineComponent({
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
        update(v){
            console.log(v)
            for(var item of this.optionList){
                if(item.value===v){
                    var obj = {
                        namespaceId : item.value,
                        namespaceName : item.label,
                    };
                    this.value = obj;
                    namespaceStore.setCurrent(obj);
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
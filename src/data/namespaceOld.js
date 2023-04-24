import {reactive} from 'vue'
import namespaceApi from '../api/namespace'


export const namespaceStore = reactive({
    'current':{
        'namespaceId':'',
        'namespaceName':'public',
    },
    load:false,
    'lastList':[
        {
            'namespaceId':'',
            'namespaceName':'public',
        }
    ],
    optionList:[
        {
            label: 'public',
            value: '',
        },
    ],
    setCurrent(current) {
        this.current = current;
    },
    setLastList(list) {
        console.log(list,this);
        return;
        var optionList = [];
        for(var item of list){
            var obj = {
                label: item.namespaceName,
                value: item.namespaceId,
            }
            optionList.push(obj);
        }
        this.lastList= list;
        this.optionList = optionList;
        this.load=true;
    },
    initLoad(){
        if(!this.load){
            namespaceApi.queryList().then(res=>{
                if(res.status==200 && res.data.data.length>0){
                    this.setLastList(res.data.data);
                }
            })
        }
    }
});
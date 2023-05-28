import {defineComponent} from 'vue'

import styles from './SubContentPage.module.css'
import {NIcon,NButton,NPopconfirm} from 'naive-ui'
import {Close} from '@vicons/ionicons5';
import {useLayoutSize} from '@/data/appdata';

export default defineComponent({
    props:[
        "title",
        "closeName",
        "submitName",
        "usePopSubmit",
        "submitPopTitle",
    ],
    emits:[
        "close",
        "submit",
    ],
    setup(props,content){
        let layoutSize = useLayoutSize();
        return {
            layoutSize:layoutSize,
        }
    },
    data() {
        let layoutSize = useLayoutSize();
        return {
            layoutSize:layoutSize,
        }
    },
    methods: {
        
    },
    render () {
        const submitView = ()=>{
            if (this.$props['usePopSubmit']) {
                const submitSlot = {
                    trigger: ()=> {
                        return <NButton type="primary" round>{this.$props['submitName'] || "确认"}</NButton>
                    }
                }
                return (
                    <NPopconfirm onPositiveClick={()=>this.$emit("submit")} v-slots={submitSlot} >
                        <span>{this.$props['submitPopTitle'] ||'是否确认操作?'}</span>
                    </NPopconfirm>
                )
            }
            else{
                return (
                    <NButton
                        type="primary"
                        round
                        onClick={()=>this.$emit("submit")}
                    >
                        {this.$props['submitName'] || "确认"}
                    </NButton>
                )
            }
        };
        return (
<div className={styles.fullWrap} style={{
    width:this.layoutSize.contentWidth+"px",
    height:this.layoutSize.contentHeight+"px",
}}>

<div className={styles.subContentTop} style={{"border-left-width":"0px"}}>
    <div className={styles.fullHeader}>
        <div className={styles.title}>
            <span>
                {this.$props['title'] || "标题"}
            </span>
        </div>
        <div className={styles.headerClose} onClick={()=>this.$emit("close")} >
                <NIcon size="25" >
                    <Close/>
                </NIcon>
        </div>
    </div>
    <div className={styles.content}>
        {this.$slots['default']?.()}
    </div>
    <div className={styles.footer}>
        <div style="display: flex; justify-content: flex-end">
            <NButton
                round
                onClick={()=>this.$emit("close")}
            >
                {this.$props['closeName'] || "返回"}
            </NButton>
            {submitView()}
        </div>
    </div>
</div>
</div>
        )
    }
})
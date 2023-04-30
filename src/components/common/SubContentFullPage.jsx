import {defineComponent} from 'vue'

import styles from './SubContentPage.module.css'
import {NIcon,NH2,NRow,NButton} from 'naive-ui'
import {Close} from '@vicons/ionicons5';
import {useLayoutSize} from '@/data/appdata';

export default defineComponent({
    props:[
        "title",
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
                返回
            </NButton>
            <NButton
                type="primary"
                round
                onClick={()=>this.$emit("submit")}
            >
                确认
            </NButton>
        </div>
    </div>
</div>
</div>
        )
    }
})
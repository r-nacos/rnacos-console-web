import {defineComponent} from 'vue'

import styles from './SubContentPage.module.css'
import {NIcon,NH2,NRow,NButton} from 'naive-ui'
import {Close} from '@vicons/ionicons5';

export default defineComponent({
    props:[
        "title",
    ],
    emits:[
        "close",
        "submit",
    ],
    setup(props,content){
        return {

        }
    },
    data() {
        return {
        }
    },
    methods: {

    },
    render () {
        return (
<div className={styles.wrap}>

<div className={styles.subContentTop}>
    <div className={styles.header}>
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
import { defineComponent } from 'vue'

import styles from './SubContentPage.module.css'
import { NIcon, NButton, NPopconfirm } from 'naive-ui'
import { Close } from '@vicons/ionicons5'

export default defineComponent({
  props: ['title', 'closeName', 'submitName', 'usePopSubmit', 'submitPopTitle'],
  emits: ['close', 'submit'],
  setup(props, content) {
    return {}
  },
  data() {
    return {}
  },
  methods: {},
  render() {
    const submitView = () => {
      if (this.$props['usePopSubmit']) {
        const submitSlot = {
          trigger: () => {
            return (
              <NButton
                type="primary"
                round
              >
                {this.$props['submitName'] || '确认'}
              </NButton>
            )
          },
        }
        return (
          <NPopconfirm
            onPositiveClick={() => this.$emit('submit')}
            v-slots={submitSlot}
          >
            <span>{this.$props['submitPopTitle'] || '是否确认操作?'}</span>
          </NPopconfirm>
        )
      } else {
        return (
          <NButton
            type="primary"
            round
            onClick={() => this.$emit('submit')}
          >
            {this.$props['submitName'] || '确认'}
          </NButton>
        )
      }
    }
    return (
      <div className={styles.wrap}>
        <div className={styles.subContentTop}>
          <div className={styles.header}>
            <div className={styles.title}>
              <span>{this.$props['title'] || '标题'}</span>
            </div>
            <div
              className={styles.headerClose}
              onClick={() => this.$emit('close')}
            >
              <NIcon size="25">
                <Close />
              </NIcon>
            </div>
          </div>
          <div className={styles.content}>{this.$slots['default']?.()}</div>
          <div className={styles.footer}>
            <div style="display: flex; justify-content: flex-end">
              <NButton
                round
                onClick={() => this.$emit('close')}
              >
                {this.$props['closeName'] || '返回'}
              </NButton>
              {submitView()}
            </div>
          </div>
        </div>
      </div>
    )
  },
})

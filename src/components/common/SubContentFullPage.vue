<template>
  <div
    class="fixed bg-white z-50"
    :style="`width: ${layoutSize.contentWidth}px; height: ${layoutSize.contentHeight}px`"
  >
    <div class="flex flex-col h-full relative border-l-1 border-gray-300">
      <div
        class="flex-none h-10 border-b border-gray-300 flex flex-row items-center bg-white px-4"
      >
        <div class="flex-1 text-sm leading-[30px] pl-4 truncate">
          <span>{{ title || t('common.title') }}</span>
        </div>
        <n-button quaternary circle @click="handleClose">
          <n-icon size="22">
            <Close />
          </n-icon>
        </n-button>
      </div>
      <div class="flex-auto relative overflow-auto p-3">
        <slot></slot>
      </div>
      <div class="flex-none p-1 relative border-t border-gray-300 bg-white">
        <div class="flex gap-4 justify-end">
          <n-button text @click="handleClose">
            {{ closeName || t('common.return') }}
          </n-button>
          <template v-if="usePopSubmit">
            <n-popconfirm @positive-click="handleSubmit" :show-icon="false">
              <template #trigger>
                <n-button type="primary">
                  {{ submitName || t('common.confirm') }}
                </n-button>
              </template>
              <template #default>
                {{ submitPopTitle || t('common.confirm_action') }}
              </template>
            </n-popconfirm>
          </template>
          <template v-else>
            <n-button type="primary" @click="handleSubmit">
              {{ submitName || t('common.confirm') }}
            </n-button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NIcon, NButton, NPopconfirm } from 'naive-ui';
import { Close } from '@vicons/ionicons5';
import { useI18n } from 'vue-i18n';
import { useLayoutSize } from '@/data/appdata';
import { onMounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  closeName: {
    type: String,
    default: ''
  },
  submitName: {
    type: String,
    default: ''
  },
  usePopSubmit: {
    type: Boolean,
    default: false
  },
  submitPopTitle: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'submit']);
const { t } = useI18n();
const layoutSize = useLayoutSize();
const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  emit('submit');
};
</script>

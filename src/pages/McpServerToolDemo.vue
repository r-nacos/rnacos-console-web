<template>
  <div class="mcp-server-tool-demo">
    <n-card title="McpServerTool 组件演示" :bordered="false">
      <template #header-extra>
        <n-space>
          <n-text depth="3">共 {{ mockTools.length }} 个工具</n-text>
          <n-button size="small" @click="refreshTools">
            <template #icon>
              <n-icon><refresh-outline /></n-icon>
            </template>
            刷新
          </n-button>
        </n-space>
      </template>

      <div class="tools-container">
        <mcp-server-tool-item
          v-for="tool in mockTools"
          :key="tool.id"
          :tool="tool"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NCard, NSpace, NText, NButton, NIcon } from 'naive-ui';
import { RefreshOutline } from '@vicons/ionicons5';
import McpServerToolItem from '@/components/mcpserver/McpServerToolItem.vue';
import { McpTool } from '@/types/mcpserver';

// Mock 数据
const mockTools = ref<McpTool[]>([
  {
    id: 1,
    toolName: 'UserService',
    toolKey: {
      namespace: 'user',
      group: 'service',
      toolName: 'UserService'
    },
    toolVersion: 1,
    spec: {
      name: 'getUserInfo',
      description: '获取用户信息',
      parameters: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: '用户ID'
          },
          includeDetails: {
            type: 'boolean',
            description: '是否包含详细信息',
            default: false
          }
        },
        required: ['userId']
      }
    },
    routeRule: {
      protocol: 'HTTP',
      url: 'https://api.example.com/user/{userId}',
      method: 'GET',
      additionHeaders: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json'
      },
      convertType: 'NONE',
      serviceNamespace: 'user',
      serviceGroup: 'service',
      serviceName: 'UserService'
    }
  },
  {
    id: 2,
    toolName: 'OrderService',
    toolKey: {
      namespace: 'order',
      group: 'service',
      toolName: 'OrderService'
    },
    toolVersion: 2,
    spec: {
      name: 'createOrder',
      description: '创建订单',
      parameters: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: '用户ID'
          },
          products: {
            type: 'array',
            description: '商品列表',
            items: {
              type: 'object',
              properties: {
                productId: {
                  type: 'string',
                  description: '商品ID'
                },
                quantity: {
                  type: 'integer',
                  description: '数量'
                }
              },
              required: ['productId', 'quantity']
            }
          },
          address: {
            type: 'object',
            description: '收货地址',
            properties: {
              province: {
                type: 'string',
                description: '省份'
              },
              city: {
                type: 'string',
                description: '城市'
              },
              detail: {
                type: 'string',
                description: '详细地址'
              }
            },
            required: ['province', 'city', 'detail']
          }
        },
        required: ['userId', 'products', 'address']
      }
    },
    routeRule: {
      protocol: 'HTTP',
      url: 'https://api.example.com/orders',
      method: 'POST',
      additionHeaders: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
        'X-Request-Source': 'web'
      },
      convertType: 'FORM_TO_JSON',
      serviceNamespace: 'order',
      serviceGroup: 'service',
      serviceName: 'OrderService'
    }
  },
  {
    id: 3,
    toolName: 'PaymentService',
    toolKey: {
      namespace: 'payment',
      group: 'service',
      toolName: 'PaymentService'
    },
    toolVersion: 1,
    spec: {
      name: 'processPayment',
      description: '处理支付',
      parameters: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            description: '订单ID'
          },
          paymentMethod: {
            type: 'string',
            description: '支付方式',
            enum: ['alipay', 'wechat', 'credit_card']
          },
          amount: {
            type: 'number',
            description: '支付金额'
          },
          currency: {
            type: 'string',
            description: '货币类型',
            default: 'CNY'
          }
        },
        required: ['orderId', 'paymentMethod', 'amount']
      }
    },
    routeRule: {
      protocol: 'HTTP',
      url: 'https://api.example.com/payment/process',
      method: 'POST',
      additionHeaders: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
        'X-Payment-Provider': 'stripe'
      },
      convertType: 'CUSTOM',
      serviceNamespace: 'payment',
      serviceGroup: 'service',
      serviceName: 'PaymentService'
    }
  },
  {
    id: 4,
    toolName: 'NotificationService',
    toolKey: {
      namespace: 'notification',
      group: 'service',
      toolName: 'NotificationService'
    },
    toolVersion: 3,
    spec: {
      name: 'sendNotification',
      description: '发送通知',
      parameters: {
        type: 'object',
        properties: {
          recipient: {
            type: 'string',
            description: '接收者'
          },
          type: {
            type: 'string',
            description: '通知类型',
            enum: ['email', 'sms', 'push']
          },
          title: {
            type: 'string',
            description: '通知标题'
          },
          content: {
            type: 'string',
            description: '通知内容'
          },
          templateId: {
            type: 'string',
            description: '模板ID'
          }
        },
        required: ['recipient', 'type', 'content']
      }
    },
    routeRule: {
      protocol: 'HTTP',
      url: 'https://api.example.com/notification/send',
      method: 'POST',
      additionHeaders: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
        'X-Notification-Priority': 'high'
      },
      convertType: 'NONE',
      serviceNamespace: 'notification',
      serviceGroup: 'service',
      serviceName: 'NotificationService'
    }
  },
  {
    id: 5,
    toolName: 'FileService',
    toolKey: {
      namespace: 'file',
      group: 'service',
      toolName: 'FileService'
    },
    toolVersion: 1,
    spec: {
      name: 'uploadFile',
      description: '上传文件',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: '文件内容'
          },
          filename: {
            type: 'string',
            description: '文件名'
          },
          fileType: {
            type: 'string',
            description: '文件类型',
            enum: ['image', 'document', 'video', 'audio', 'other']
          },
          visibility: {
            type: 'string',
            description: '可见性',
            enum: ['public', 'private', 'shared'],
            default: 'private'
          }
        },
        required: ['file', 'filename']
      }
    },
    routeRule: {
      protocol: 'HTTP',
      url: 'https://api.example.com/file/upload',
      method: 'POST',
      additionHeaders: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'multipart/form-data'
      },
      convertType: 'NONE',
      serviceNamespace: 'file',
      serviceGroup: 'service',
      serviceName: 'FileService'
    }
  }
]);

// 刷新工具列表
const refreshTools = () => {
  // 这里可以添加刷新逻辑，目前只是简单的重新赋值以触发响应式更新
  mockTools.value = [...mockTools.value];
};
</script>

<style scoped>
.mcp-server-tool-demo {
  padding: 16px;
}

.tools-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .tools-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 767px) {
  .mcp-server-tool-demo {
    padding: 8px;
  }
}
</style>
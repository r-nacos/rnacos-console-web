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

      <n-space vertical :size="16">
        <!-- 模式选择器 -->
        <n-card title="模式选择" size="small">
          <n-radio-group v-model:value="currentMode" name="mode-select">
            <n-radio-button value="detail">详情模式</n-radio-button>
            <n-radio-button value="update">编辑模式</n-radio-button>
            <n-radio-button value="create">创建模式</n-radio-button>
          </n-radio-group>
        </n-card>

        <!-- 工具列表 -->
        <div class="tools-container">
          <mcp-server-tool-item
            v-for="tool in mockTools"
            :key="tool.id"
            :tool="tool"
            :mode="currentMode"
            @update:tool="handleToolUpdate"
            @save="handleSingleToolSave"
          />
        </div>

        <!-- 创建新工具示例 -->
        <n-card
          v-if="currentMode === 'create'"
          title="创建新工具示例"
          size="small"
        >
          <n-alert type="info" :show-icon="false">
            <template #header>
              <n-space align="center">
                <n-icon><information-circle-outline /></n-icon>
                <span>创建模式说明</span>
              </n-space>
            </template>
            <p>
              在创建模式下，您可以点击任意工具卡片上的编辑图标来创建新的工具副本。
            </p>
            <p>编辑完成后，参数将显示在下方控制台输出区域。</p>
          </n-alert>
        </n-card>
      </n-space>
    </n-card>

    <!-- 控制台输出区域 -->
    <n-card title="控制台输出" :bordered="false" class="console-output">
      <template #header-extra>
        <n-button size="small" @click="clearConsole">
          <template #icon>
            <n-icon><trash-outline /></n-icon>
          </template>
          清空
        </n-button>
      </template>

      <n-log :lines="consoleOutput" :rows="10" :trim="false" language="json" />
    </n-card>

    <!-- ToolSpecSelector 测试验证区域 -->
    <n-card
      title="ToolSpecSelector 测试验证区域"
      :bordered="false"
      class="toolspec-selector-test-area"
    >
      <template #header-extra>
        <n-space>
          <n-text depth="3"
            >已选择:
            {{ selectedToolSpec ? selectedToolSpec.toolName : '无' }}</n-text
          >
          <n-button size="small" @click="showToolSpecSelector = true">
            <template #icon>
              <n-icon><add-outline /></n-icon>
            </template>
            选择 ToolSpec
          </n-button>
        </n-space>
      </template>

      <div class="toolspec-selector-content">
        <n-space vertical>
          <n-alert v-if="selectedToolSpec" type="success" :show-icon="false">
            <template #header>
              <n-space align="center">
                <n-icon><checkmark-circle-outline /></n-icon>
                <span>已选择的 ToolSpec</span>
              </n-space>
            </template>
            <div>
              <p><strong>命名空间:</strong> {{ selectedToolSpec.namespace }}</p>
              <p><strong>组:</strong> {{ selectedToolSpec.group }}</p>
              <p><strong>工具名称:</strong> {{ selectedToolSpec.toolName }}</p>
              <p><strong>名称:</strong> {{ selectedToolSpec.name }}</p>
              <p><strong>描述:</strong> {{ selectedToolSpec.description }}</p>
              <p><strong>版本:</strong> {{ selectedToolSpec.version }}</p>
            </div>
          </n-alert>

          <n-empty v-else description="请点击上方按钮选择 ToolSpec">
            <template #extra>
              <n-button type="primary" @click="showToolSpecSelector = true">
                选择 ToolSpec
              </n-button>
            </template>
          </n-empty>
        </n-space>
      </div>
    </n-card>

    <!-- ToolSpecSelector 组件 -->
    <tool-spec-selector
      v-model:visible="showToolSpecSelector"
      :selected-tool-specs="selectedToolSpecs"
      @select="handleToolSpecSelect"
      @cancel="handleToolSpecCancel"
    />

    <!-- McpServerValue 组件演示区域 -->
    <n-card
      title="McpServerValue 组件演示"
      :bordered="false"
      class="mcp-server-value-demo-area"
    >
      <template #header-extra>
        <n-space>
          <n-text depth="3"
            >工具数量: {{ mockServerValue.tools.length }}</n-text
          >
          <n-button size="small" @click="refreshServerValue">
            <template #icon>
              <n-icon><refresh-outline /></n-icon>
            </template>
            刷新
          </n-button>
        </n-space>
      </template>

      <div class="server-value-container">
        <n-space vertical :size="16">
          <n-card title="模式选择" size="small">
            <n-radio-group
              v-model:value="currentServerValueMode"
              name="server-value-mode"
            >
              <n-radio-button value="detail">详情模式</n-radio-button>
              <n-radio-button value="update">编辑模式</n-radio-button>
            </n-radio-group>
          </n-card>

          <mcp-server-value-component
            :server-value="mockServerValue"
            :mode="currentServerValueMode"
            @update:value="handleServerValueUpdate"
            @tool-change="handleToolChange"
            @tool-save="handleToolSave"
            @tool-delete="handleToolDelete"
            @tool-add="handleToolAdd"
          />
        </n-space>
      </div>
    </n-card>

    <!-- McpServerDetailComponent 组件演示区域 -->
    <n-card
      title="McpServerDetailComponent 组件演示"
      :bordered="false"
      class="mcp-server-detail-demo-area"
    >
      <template #header-extra>
        <n-space>
          <n-text depth="3"
            >ID: {{ mockServerDto.id }} - {{ mockServerDto.name }}</n-text
          >
          <n-button size="small" @click="refreshServerDetail">
            <template #icon>
              <n-icon><refresh-outline /></n-icon>
            </template>
            刷新
          </n-button>
        </n-space>
      </template>

      <div class="server-detail-container">
        <n-space vertical :size="16">
          <n-card title="模式选择" size="small">
            <n-radio-group
              v-model:value="currentServerDetailMode"
              name="server-detail-mode"
            >
              <n-radio-button value="detail">详情模式</n-radio-button>
              <n-radio-button value="update">编辑模式</n-radio-button>
              <n-radio-button value="create">创建模式</n-radio-button>
            </n-radio-group>
          </n-card>

          <mcp-server-detail-component
            :server-data="mockServerDto"
            :mode="currentServerDetailMode"
            @update:server-data="handleServerDetailUpdate"
            @save:success="handleServerDetailSave"
            @create:success="handleServerDetailCreate"
            @cancel="handleServerDetailCancel"
          />
        </n-space>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  NCard,
  NSpace,
  NText,
  NButton,
  NIcon,
  NAlert,
  NEmpty,
  NRadioGroup,
  NRadioButton,
  NLog
} from 'naive-ui';
import {
  RefreshOutline,
  AddOutline,
  CheckmarkCircleOutline,
  InformationCircleOutline,
  TrashOutline
} from '@vicons/ionicons5';
import McpServerToolItem from '@/components/mcpserver/McpServerToolItem.vue';
import ToolSpecSelector from '@/components/mcpserver/ToolSpecSelector.vue';
import McpServerValueComponent from '@/components/mcpserver/McpServerValueComponent.vue';
import McpServerDetailComponent from '@/components/mcpserver/McpServerDetailComponent.vue';
import {
  McpTool,
  ToolSpecInfo,
  McpSimpleToolParams,
  McpServerValue,
  McpServerDto
} from '@/types/mcpserver';

// 当前模式
const currentMode = ref<'detail' | 'update' | 'create'>('detail');
const currentServerValueMode = ref<'detail' | 'update'>('detail');
const currentServerDetailMode = ref<'detail' | 'update' | 'create'>('detail');

// 控制台输出
const consoleOutput = ref<string[]>([]);

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
      inputSchema: {
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
        Authorization: 'Bearer {token}',
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
      inputSchema: {
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
        Authorization: 'Bearer {token}',
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
      inputSchema: {
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
        Authorization: 'Bearer {token}',
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
      inputSchema: {
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
        Authorization: 'Bearer {token}',
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
      inputSchema: {
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
        Authorization: 'Bearer {token}',
        'Content-Type': 'multipart/form-data'
      },
      convertType: 'NONE',
      serviceNamespace: 'file',
      serviceGroup: 'service',
      serviceName: 'FileService'
    }
  }
]);

// McpServerValue mock数据
const mockServerValue = ref<McpServerValue>({
  id: 1,
  description: '数学运算服务器',
  tools: [
    {
      id: 101,
      toolName: '加法工具',
      toolKey: {
        namespace: 'math',
        group: 'operation',
        toolName: 'add'
      },
      toolVersion: 1,
      spec: {
        name: 'add',
        description: '执行两个数字的加法运算',
        inputSchema: {
          type: 'object',
          properties: {
            a: {
              type: 'number',
              description: '第一个数字'
            },
            b: {
              type: 'number',
              description: '第二个数字'
            }
          },
          required: ['a', 'b']
        }
      },
      routeRule: {
        protocol: 'HTTP',
        url: 'https://api.example.com/math/add',
        method: 'POST',
        additionHeaders: {
          'Content-Type': 'application/json'
        },
        convertType: 'NONE',
        serviceNamespace: 'math',
        serviceGroup: 'operation',
        serviceName: 'MathService'
      }
    },
    {
      id: 102,
      toolName: '减法工具',
      toolKey: {
        namespace: 'math',
        group: 'operation',
        toolName: 'subtract'
      },
      toolVersion: 1,
      spec: {
        name: 'subtract',
        description: '执行两个数字的减法运算',
        inputSchema: {
          type: 'object',
          properties: {
            a: {
              type: 'number',
              description: '被减数'
            },
            b: {
              type: 'number',
              description: '减数'
            }
          },
          required: ['a', 'b']
        }
      },
      routeRule: {
        protocol: 'HTTP',
        url: 'https://api.example.com/math/subtract',
        method: 'POST',
        additionHeaders: {
          'Content-Type': 'application/json'
        },
        convertType: 'NONE',
        serviceNamespace: 'math',
        serviceGroup: 'operation',
        serviceName: 'MathService'
      }
    },
    {
      id: 103,
      toolName: '乘法工具',
      toolKey: {
        namespace: 'math',
        group: 'operation',
        toolName: 'multiply'
      },
      toolVersion: 1,
      spec: {
        name: 'multiply',
        description: '执行两个数字的乘法运算',
        inputSchema: {
          type: 'object',
          properties: {
            a: {
              type: 'number',
              description: '第一个乘数'
            },
            b: {
              type: 'number',
              description: '第二个乘数'
            }
          },
          required: ['a', 'b']
        }
      },
      routeRule: {
        protocol: 'HTTP',
        url: 'https://api.example.com/math/multiply',
        method: 'POST',
        additionHeaders: {
          'Content-Type': 'application/json'
        },
        convertType: 'NONE',
        serviceNamespace: 'math',
        serviceGroup: 'operation',
        serviceName: 'MathService'
      }
    },
    {
      id: 104,
      toolName: '除法工具',
      toolKey: {
        namespace: 'math',
        group: 'operation',
        toolName: 'divide'
      },
      toolVersion: 1,
      spec: {
        name: 'divide',
        description: '执行两个数字的除法运算',
        inputSchema: {
          type: 'object',
          properties: {
            a: {
              type: 'number',
              description: '被除数'
            },
            b: {
              type: 'number',
              description: '除数'
            }
          },
          required: ['a', 'b']
        }
      },
      routeRule: {
        protocol: 'HTTP',
        url: 'https://api.example.com/math/divide',
        method: 'POST',
        additionHeaders: {
          'Content-Type': 'application/json'
        },
        convertType: 'NONE',
        serviceNamespace: 'math',
        serviceGroup: 'operation',
        serviceName: 'MathService'
      }
    }
  ],
  opUser: 'admin',
  updateTime: Date.now(),
  createTime: Date.now() - 86400000, // 创建时间为一天前
  isRelease: true
});

// McpServerDto mock数据
const mockServerDto = ref<McpServerDto>({
  id: 1001,
  uniqueKey: 'math-server-demo-001',
  namespace: 'demo',
  name: '数学运算服务器',
  description: '一个提供基础数学运算功能的MCP服务器，包含加减乘除四个工具',
  authKeys: ['demo-key-001', 'demo-key-002', 'internal-key'],
  createTime: Date.now() - 86400000 * 2, // 2天前创建
  lastModifiedMillis: Date.now() - 3600000, // 1小时前修改
  currentValue: {
    id: 1,
    description: '数学运算服务器当前版本',
    tools: [
      {
        id: 101,
        toolName: '加法工具',
        toolKey: {
          namespace: 'math',
          group: 'operation',
          toolName: 'add'
        },
        toolVersion: 1,
        spec: {
          name: 'add',
          description: '执行两个数字的加法运算',
          inputSchema: {
            type: 'object',
            properties: {
              a: {
                type: 'number',
                description: '第一个数字'
              },
              b: {
                type: 'number',
                description: '第二个数字'
              }
            },
            required: ['a', 'b']
          }
        },
        routeRule: {
          protocol: 'HTTP',
          url: 'https://api.example.com/math/add',
          method: 'POST',
          additionHeaders: {
            'Content-Type': 'application/json'
          },
          convertType: 'NONE',
          serviceNamespace: 'math',
          serviceGroup: 'operation',
          serviceName: 'MathService'
        }
      },
      {
        id: 102,
        toolName: '减法工具',
        toolKey: {
          namespace: 'math',
          group: 'operation',
          toolName: 'subtract'
        },
        toolVersion: 1,
        spec: {
          name: 'subtract',
          description: '执行两个数字的减法运算',
          inputSchema: {
            type: 'object',
            properties: {
              a: {
                type: 'number',
                description: '被减数'
              },
              b: {
                type: 'number',
                description: '减数'
              }
            },
            required: ['a', 'b']
          }
        },
        routeRule: {
          protocol: 'HTTP',
          url: 'https://api.example.com/math/subtract',
          method: 'POST',
          additionHeaders: {
            'Content-Type': 'application/json'
          },
          convertType: 'NONE',
          serviceNamespace: 'math',
          serviceGroup: 'operation',
          serviceName: 'MathService'
        }
      },
      {
        id: 103,
        toolName: '乘法工具',
        toolKey: {
          namespace: 'math',
          group: 'operation',
          toolName: 'multiply'
        },
        toolVersion: 1,
        spec: {
          name: 'multiply',
          description: '执行两个数字的乘法运算',
          inputSchema: {
            type: 'object',
            properties: {
              a: {
                type: 'number',
                description: '第一个乘数'
              },
              b: {
                type: 'number',
                description: '第二个乘数'
              }
            },
            required: ['a', 'b']
          }
        },
        routeRule: {
          protocol: 'HTTP',
          url: 'https://api.example.com/math/multiply',
          method: 'POST',
          additionHeaders: {
            'Content-Type': 'application/json'
          },
          convertType: 'NONE',
          serviceNamespace: 'math',
          serviceGroup: 'operation',
          serviceName: 'MathService'
        }
      },
      {
        id: 104,
        toolName: '除法工具',
        toolKey: {
          namespace: 'math',
          group: 'operation',
          toolName: 'divide'
        },
        toolVersion: 1,
        spec: {
          name: 'divide',
          description: '执行两个数字的除法运算',
          inputSchema: {
            type: 'object',
            properties: {
              a: {
                type: 'number',
                description: '被除数'
              },
              b: {
                type: 'number',
                description: '除数'
              }
            },
            required: ['a', 'b']
          }
        },
        routeRule: {
          protocol: 'HTTP',
          url: 'https://api.example.com/math/divide',
          method: 'POST',
          additionHeaders: {
            'Content-Type': 'application/json'
          },
          convertType: 'NONE',
          serviceNamespace: 'math',
          serviceGroup: 'operation',
          serviceName: 'MathService'
        }
      }
    ],
    opUser: 'system',
    updateTime: Date.now() - 3600000, // 1小时前更新
    createTime: Date.now() - 86400000 * 2, // 2天前创建
    isRelease: true
  }
});

// ToolSpecSelector 相关变量和函数
const showToolSpecSelector = ref(false);
const selectedToolSpec = ref<ToolSpecInfo | null>(null);
const selectedToolSpecs = ref<ToolSpecInfo[]>([]);

// 处理工具更新
const handleToolUpdate = (updatedTool: McpTool) => {
  const index = mockTools.value.findIndex((tool) => tool.id === updatedTool.id);
  if (index !== -1) {
    mockTools.value[index] = updatedTool;
  }
};

// 处理工具保存
const handleSingleToolSave = (params: McpSimpleToolParams) => {
  // 添加到控制台输出
  const timestamp = new Date().toLocaleTimeString();
  consoleOutput.value.unshift(`[${timestamp}] 保存工具参数:`);
  consoleOutput.value.unshift(JSON.stringify(params, null, 2));
  consoleOutput.value.unshift('---');

  // 在浏览器控制台也输出
  console.log('McpSimpleToolParams:', params);
};

// 清空控制台
const clearConsole = () => {
  consoleOutput.value = [];
};

// 处理 ToolSpec 选择
const handleToolSpecSelect = (toolSpec: ToolSpecInfo) => {
  selectedToolSpec.value = toolSpec;
  selectedToolSpecs.value = [toolSpec];
  showToolSpecSelector.value = false;
};

// 处理 ToolSpec 选择取消
const handleToolSpecCancel = () => {
  showToolSpecSelector.value = false;
};

// 刷新工具列表
const refreshTools = () => {
  // 这里可以添加刷新逻辑，目前只是简单的重新赋值以触发响应式更新
  mockTools.value = [...mockTools.value];
};

// 刷新McpServerValue
const refreshServerValue = () => {
  // 这里可以添加刷新逻辑，目前只是简单的重新赋值以触发响应式更新
  mockServerValue.value = { ...mockServerValue.value };
};

// 刷新McpServerDetailComponent
const refreshServerDetail = () => {
  // 这里可以添加刷新逻辑，目前只是简单的重新赋值以触发响应式更新
  mockServerDto.value = { ...mockServerDto.value };
};

// 监听模式变化
watch(currentMode, (newMode) => {
  consoleOutput.value.unshift(
    `[${new Date().toLocaleTimeString()}] 切换到${
      newMode === 'detail' ? '详情' : newMode === 'update' ? '编辑' : '创建'
    }模式`
  );
});

watch(currentServerDetailMode, (newMode) => {
  consoleOutput.value.unshift(
    `[${new Date().toLocaleTimeString()}] McpServerDetailComponent 切换到${
      newMode === 'detail' ? '详情' : newMode === 'update' ? '编辑' : '创建'
    }模式`
  );
});

// 处理McpServerValue组件的事件
const handleServerValueUpdate = (value: McpServerValue) => {
  mockServerValue.value = value;
  const timestamp = new Date().toLocaleTimeString();
  consoleOutput.value.unshift(`[${timestamp}] ServerValue 已更新`);
  consoleOutput.value.unshift(`工具数量: ${value.tools.length}`);
  consoleOutput.value.unshift('---');
};

const handleToolChange = (toolIndex: number, tool: McpTool) => {
  const timestamp = new Date().toLocaleTimeString();
  consoleOutput.value.unshift(`[${timestamp}] 工具 ${toolIndex} 已变更`);
  consoleOutput.value.unshift(`工具名称: ${tool.toolName}`);
  consoleOutput.value.unshift('---');
};

const handleToolSave = (toolIndex: number, params: McpSimpleToolParams) => {
  const timestamp = new Date().toLocaleTimeString();
  consoleOutput.value.unshift(`[${timestamp}] 工具 ${toolIndex} 已保存`);
  consoleOutput.value.unshift(JSON.stringify(params, null, 2));
  consoleOutput.value.unshift('---');
};

const handleToolDelete = (toolIndex: number) => {
  const timestamp = new Date().toLocaleTimeString();
  consoleOutput.value.unshift(`[${timestamp}] 工具 ${toolIndex} 已删除`);
  consoleOutput.value.unshift('---');
};

const handleToolAdd = (params: McpSimpleToolParams) => {
  const timestamp = new Date().toLocaleTimeString();
  consoleOutput.value.unshift(`[${timestamp}] 新工具已添加`);
  consoleOutput.value.unshift(JSON.stringify(params, null, 2));
  consoleOutput.value.unshift('---');
};

// 处理McpServerDetailComponent组件的事件
const handleServerDetailUpdate = (data: McpServerDto) => {
  mockServerDto.value = data;
  const timestamp = new Date().toLocaleTimeString();
  consoleOutput.value.unshift(`[${timestamp}] ServerDetailComponent 已更新`);
  consoleOutput.value.unshift(`服务器名称: ${data.name}`);
  consoleOutput.value.unshift('---');
};

const handleServerDetailSave = (data: McpServerDto) => {
  const timestamp = new Date().toLocaleTimeString();
  consoleOutput.value.unshift(`[${timestamp}] 服务器已保存`);
  consoleOutput.value.unshift(
    JSON.stringify(
      {
        id: data.id,
        name: data.name,
        namespace: data.namespace,
        description: data.description,
        authKeys: data.authKeys
      },
      null,
      2
    )
  );
  consoleOutput.value.unshift('---');
};

const handleServerDetailCreate = (data: McpServerDto) => {
  const timestamp = new Date().toLocaleTimeString();
  consoleOutput.value.unshift(`[${timestamp}] 服务器已创建`);
  consoleOutput.value.unshift(
    JSON.stringify(
      {
        id: data.id,
        name: data.name,
        namespace: data.namespace,
        description: data.description,
        authKeys: data.authKeys
      },
      null,
      2
    )
  );
  consoleOutput.value.unshift('---');
};

const handleServerDetailCancel = () => {
  const timestamp = new Date().toLocaleTimeString();
  consoleOutput.value.unshift(`[${timestamp}] 服务器编辑已取消`);
  consoleOutput.value.unshift('---');
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

.console-output {
  margin-top: 24px;
}

.toolspec-selector-test-area {
  margin-top: 24px;
}

.mcp-server-value-demo-area {
  margin-top: 24px;
}

.server-value-container {
  padding: 8px 0;
}

.mcp-server-detail-demo-area {
  margin-top: 24px;
}

.server-detail-container {
  padding: 8px 0;
}

.toolspec-selector-content {
  min-height: 200px;
}

.toolspec-selector-content .n-alert {
  margin-bottom: 16px;
}

.toolspec-selector-content .n-alert p {
  margin: 4px 0;
}

.toolspec-selector-content .n-empty {
  padding: 40px 0;
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

  .toolspec-selector-test-area {
    margin-top: 16px;
  }
}
</style>

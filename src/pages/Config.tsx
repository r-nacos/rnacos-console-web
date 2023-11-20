import { defineComponent } from "vue";

import {
  configApi,
  IConfig,
  IConfigKey,
  IConfigQueryParam
} from "@/api/config";
import { AxiosError } from "axios";

export default defineComponent({
  name: "Config",
  data() {
    return {
      tenant: "",
      group: "foo",
      dataId: "001",
      content: "",
      message: ""
    };
  },
  methods: {
    setConfig() {
      console.log("setConfig", this.group, this.dataId);
      let config: IConfig = {
        tenant: this.tenant,
        group: this.group,
        dataId: this.dataId,
        content: this.content
      };
      configApi
        .setConfig(config)
        .then((res) => {
          console.log("response", res.request.responseText);
          if (res.status == 200) {
            this.content = "";
          }
        })
        .catch((err: AxiosError) => {
          console.log("response err", err.message);
        });
    },
    getConfig() {
      console.log("getConfig", this.group, this.dataId);
      let configKey: IConfigKey = {
        tenant: this.tenant,
        group: this.group,
        dataId: this.dataId
      };
      configApi
        .getConfig(configKey)
        .then((res) => {
          console.log("response", res.request.responseText);
          if (res.status == 200) {
            this.content = res.request.responseText;
          }
        })
        .catch((err: AxiosError) => {
          console.log("response err", err.message);
        });
    }
  },
  render() {
    return (
      <div>
        <div>
          <div>
            <span>tenant:</span>
            <input
              type="text"
              value={this.tenant}
              onChange={(e) => {
                console.log("tenant change");
                this.tenant = (e.target as HTMLInputElement).value;
              }}
            />
          </div>
          <div>
            <span>group:</span>
            <input
              type="text"
              value={this.group}
              onChange={(e) => {
                this.group = (e.target as HTMLInputElement).value;
              }}
            />
          </div>
          <div>
            <span>dataId:</span>
            <input
              type="text"
              value={this.dataId}
              onChange={(e) => {
                this.dataId = (e.target as HTMLInputElement).value;
              }}
            />
          </div>
          <div>
            <span>content:</span>
            <input
              type="text"
              value={this.content}
              onChange={(e) => {
                this.content = (e.target as HTMLInputElement).value;
              }}
            />
          </div>
          <div>
            <button onClick={() => this.setConfig()}> 设置</button>
            <button onClick={() => this.getConfig()}> 获取</button>
          </div>
        </div>
      </div>
    );
  }
});

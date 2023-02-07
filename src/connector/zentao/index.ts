import type { RequestArtifactory } from '../request/index.d';
import type { UserInfo, PlatformSetting } from '../../types/connector.d';
import type { TaskDetail } from './zentao.d';

import { requestFactory } from '../request';
import { SimpleStore } from '../../utils/store';
import { PlatformConnector } from "../platformConnector";
import { getExtensionConfiguration, showInfoAndNavigationBtn } from '../../utils';

export class ZentaoConnector extends PlatformConnector {
  static _instance: ZentaoConnector;
  private requestInstance!: RequestArtifactory;
  private zentaoStore!: SimpleStore;
  
  constructor(platformSetting: PlatformSetting, userInfo: UserInfo) {
    if (ZentaoConnector._instance) {
      return ZentaoConnector._instance;
    }
    super(platformSetting, userInfo);
    ZentaoConnector._instance = this;
    this.zentaoStore = new SimpleStore('zentao');
    this.generateRequest();
  }

  private generateRequest() { 
    const { zentao } = getExtensionConfiguration();
    const prefix = (zentao.address || '') + '/api.php/v1';

    this.requestInstance = requestFactory(
      prefix,
      {
        request: (req) => {
          const zentaoStore = new SimpleStore('zentao');
          return {
            ...req,
            headers: {
              'Token': zentaoStore.getValue('token') || ''
            }
          };
        },
        response: (resp) => {
          return resp;
        }
      }
    );
  }

  async resetState() { 
    this.generateRequest();
    await this.connect();
  }

  async connect() {
    const prepared = this.prepareConnection();
    if (prepared) {
      const { account, pwd } = this.userInfo;
      const { name, address } = this.platformInfo;

      const res = await this.loginWithAccountInfo(account, pwd).
        catch((err: any) => {
          showInfoAndNavigationBtn(`需求请求插件发生错误！：${err}`, '', 'danger');
          return undefined;
        });

      if (!res || !res.token) {
        const tip = `无法从 ${name} 获取数据，请检查地址 ${address} 是否正确`;
        showInfoAndNavigationBtn(tip, 'zentao.address', 'warn');
      } else {
        this.zentaoStore.setValue('token', res.token);
      }
    }
  }

  // #region [services]
  async loginWithAccountInfo(account: string, pwd: string) { 
    return this.requestInstance.post<any, { token?: string }>(
      '/tokens',
      {
        account: account,
        password: pwd
      }
    );
  }

  async getTaskInfo(taskId: string) { 
    return this.requestInstance.get<any, TaskDetail>(`/tasks/${taskId}`);
  }
  // #endregion
}
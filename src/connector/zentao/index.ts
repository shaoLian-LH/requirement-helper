import { SimpleStore } from '../../utils/store';
import type { UserInfo, PlatformSetting } from '../../types/connector';
import { PlatformConnector } from "../index";
import { loginWithAccountInfo } from './service/auth';
import { showInfoAndNavigationBtn } from '../../utils';

const zentaoStore = new SimpleStore('zentao');

export class ZentaoConnector extends PlatformConnector { 
  static _instance: ZentaoConnector;
  constructor(platformSetting: PlatformSetting, userInfo: UserInfo) {
    if (ZentaoConnector._instance) {return ZentaoConnector._instance;}
    super(platformSetting, userInfo);
    ZentaoConnector._instance = this;
  }

  async connect() {
    const prepared = this.prepareConnection();
    if (prepared) { 
      const { account, pwd, token } = this.userInfo;
      const { name, address } = this.platformInfo;
      if (token) {
        // TODO: 对 token 进行校验
        zentaoStore.setValue('token', token);
      } else { 
        const res = await loginWithAccountInfo(account, pwd).
          catch((err: any) => {
              showInfoAndNavigationBtn(`需求请求插件发生错误！：${err}`, '', 'danger');
              return undefined;
            });
          if (!res || !res.token) {
            const tip = `无法从 ${name} 获取数据，请检查地址 ${address} 是否正确`;
            showInfoAndNavigationBtn(tip, 'zentao.address', 'warn');
          } else { 
            zentaoStore.setValue('token', res.token);
          }
      }
    } 
  }
}
import type { UserInfo, PlatformSetting } from '../types/connector';
import { showInfoAndNavigationBtn } from '../utils';

export class PlatformConnector { 
  private _userInfo: UserInfo;
  private _platform: PlatformSetting;
  private _maybeValid: boolean;

  private connectionInfoIsValid() { 
    const { account, pwd, token } = this._userInfo;
    const addressIsValid = () => { 
      const { address } = this._platform;
      if (!address) {
        return false;
      }
      const addressSimpleCheck = /^(http(s)?:\/\/)/.test(address) || !(address.endsWith('/'));
      if (!addressSimpleCheck) { 
        const tip = `平台 ${this._platform.name} 的地址错误，请检查！参考地址为：https://example.com/`;
        showInfoAndNavigationBtn(tip, `${this._platform.name}.address`);
      }

      return Boolean(addressSimpleCheck);
    };
    const isValid = (Boolean(token) || (Boolean(account) && Boolean(pwd))) && addressIsValid();
    this._maybeValid = isValid;
    return isValid;
  }

  constructor(platformSetting: PlatformSetting, userInfo: UserInfo) { 
    this._platform = platformSetting;
    this._userInfo = userInfo;
    this._maybeValid = false;
    this.connectionInfoIsValid();
  }

  updateUserInfo(newInfo: UserInfo) { 
    this._userInfo = newInfo;
    return this.connectionInfoIsValid();
  }

  updatePlatformSetting(platformSetting: PlatformSetting) { 
    this._platform = platformSetting;
    return this.connectionInfoIsValid();
  }

  updateAllSetting(platformSetting: PlatformSetting, newInfo: UserInfo) { 
    this._platform = platformSetting;
    this._userInfo = newInfo;
    return this.connectionInfoIsValid();
  }

  prepareConnection() { 
    this.connectionInfoIsValid();
    if (!this._maybeValid) {
      const tip = `平台 ${this._platform.name} 缺少地址或用户信息，请进行填写！`;
      showInfoAndNavigationBtn(tip, this._platform.name);
      return false;
    }
    return true;
  }

  get userInfo() { 
    return this._userInfo;
  }

  get platformInfo() { 
    return this._platform;
  }

  get maybeValid() { 
    return this._maybeValid;
  }
}
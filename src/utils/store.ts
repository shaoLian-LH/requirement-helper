import { Requirement } from '../types/connector';
import { get, set } from 'lodash';

export class SimpleStore { 
  private static _instancesRecord: Record<string, SimpleStore>;
  private _store: Record<any, any>;
  private _defaultScope: string | undefined;

  constructor(defaultScope: string) { 
    const preRecord = this.getInstanceRecord(defaultScope);
    if (preRecord) { 
      this._store = preRecord.store;
      this._defaultScope = preRecord.defaultScope;
      return preRecord;
    }

    this._store = {};
    this._defaultScope = defaultScope;
    this.setInstanceRecord(defaultScope, this);
  }

  private getInstanceRecord(key: string):  SimpleStore | undefined { 
    return (SimpleStore._instancesRecord || {})[key];
  }

  private setInstanceRecord(key: string, _this: SimpleStore) { 
    if (this.getInstanceRecord(key)) { return; } 
    if (!SimpleStore._instancesRecord) {SimpleStore._instancesRecord = {};}
    SimpleStore._instancesRecord[key] = _this;
  }

  setValue(key: string, value: any, scope: string | undefined = this._defaultScope) { 
    let targetKey = scope ? `${scope}.${key}` : key;
    return set(this._store, targetKey, value);
  }

  getValue(key: string, scope: string | undefined = this._defaultScope) { 
    let targetKey = scope ? `${scope}.${key}` : key;
    return get(this._store, targetKey);
  }

  updateTagInfos(requirements: Requirement[]) {
    const rangeSettings: Requirement[] = [];
    requirements.forEach(setting => { 
      const { type, id } = setting;
      const hasExisted = this.getValue(`${type}.${id}`);
      if (hasExisted) { return; }
      this.setValue(`${type}.${id}`, {});
      // TODO: 这个地方应该做一层比对，节点位置会发生改变，此时应该通知其他模块产生了什么变化
      rangeSettings.push(setting);
    });
    return rangeSettings;
  }

  reset() { 
    this._store = {}; 
  }

  get store() { 
    return this._store;
  }

  get defaultScope() { 
    return this._defaultScope;
  }
}
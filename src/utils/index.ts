import * as vscode from 'vscode';
import { NAVIGATE_TO_CONFIGURATION } from '../enums/tips';
import { EXTENSION_FLAG } from '../enums/const';
import type { MessageType, PlatformBaseSetting } from '../types/common';
import { ZentaoConnector } from '../connector/zentao';

export const openExtensionSetting = (ext: string | null | undefined) => { 
  let options = EXTENSION_FLAG;
  if (ext) { 
    options += `.${ext}`;
  }
  vscode.commands.executeCommand('workbench.action.openSettings', options);
};

export const showInfoWithBtn = (
  msg: string,
  btnInfos: string[],
  resolver: (selection: any) => any,
  type: MessageType = 'info'
) => { 
  switch (type) { 
    case 'info':
      vscode.window
        .showInformationMessage(msg, ...btnInfos)
        .then(resolver);
      break;
    case 'warn':
      vscode.window
        .showWarningMessage(msg, ...btnInfos)
        .then(resolver);
      break;  
    case 'danger':
      vscode.window
        .showErrorMessage(msg, ...btnInfos)
        .then(resolver);
      break;
  }
  
};

export const showInfoAndNavigationBtn = (tip: string, ext?: string | null, type: MessageType = 'info') => { 
  showInfoWithBtn(tip, [NAVIGATE_TO_CONFIGURATION], (selection) => { 
    if (selection === NAVIGATE_TO_CONFIGURATION) { 
      openExtensionSetting(ext);
    }
  }, type);
};

export const getExtensionConfiguration = () => { 
	const config = vscode.workspace.getConfiguration(EXTENSION_FLAG);
	const defaultRequirementManager = config.get<string>('defaultRequirementManager') as string;
	const defaultPlatformSetting = config.get<PlatformBaseSetting>(defaultRequirementManager) as PlatformBaseSetting;
	
	const platformInfo = {
		name: defaultRequirementManager || '',
		address: defaultPlatformSetting.address || ''
	};

	const userInfo = {
		account: defaultPlatformSetting.account || '',
		pwd: defaultPlatformSetting.pwd || ''
  };
  
  const zentaoSetting = config.get<PlatformBaseSetting>('zentao') as PlatformBaseSetting;
  const zentao = {
    address: zentaoSetting.address || '',
    account: zentaoSetting.account || '',
		pwd: zentaoSetting.pwd || ''
  };

	return { platformInfo, userInfo, zentao };
};

export const commandRegister = (
  context: vscode.ExtensionContext,
  cmd: string,
  action: (...items: any) => any
) => { 
  let disposable = vscode.commands.registerCommand(`${EXTENSION_FLAG}.${cmd}`, action);
	context.subscriptions.push(disposable);
};

export const subscribeDisposables = (
  context: vscode.ExtensionContext,
  ...disposables: vscode.Disposable[]
) => { 
  context.subscriptions.push(...disposables);
};
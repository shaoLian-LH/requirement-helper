// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { EXTENSION_FLAG } from './enums/const';
import { SimpleStore } from './utils/store';
import { getExtensionConfiguration, commandRegister, showInfoWithBtn } from './utils';
import { addRequirementDiagnostics, addSaveScanner } from './initial';
import { getDefaultConnector } from './connector/utils';

export function activate(context: vscode.ExtensionContext) {
	const defaultPlatformConnector = getDefaultConnector();
	const store = new SimpleStore(defaultPlatformConnector.platformInfo.name);
	const { enable } = getExtensionConfiguration();

	const extensionInitial = () => { 
		const requirementDiagnostics = addRequirementDiagnostics(context);
		addSaveScanner(context, requirementDiagnostics);
		
		vscode.workspace.onDidChangeConfiguration((event) => { 
			const extensionSettingChanged = event.affectsConfiguration(EXTENSION_FLAG);
			if (extensionSettingChanged) { 
				const { platformInfo, userInfo } = getExtensionConfiguration();
				const isValid = defaultPlatformConnector.updateAllSetting(platformInfo, userInfo);
				if (!isValid) { return; }
				store.reset();
				defaultPlatformConnector.connect();
			}
		});

		defaultPlatformConnector.connect();
		store.setValue('started', true, 'global');
	};

	if (enable) { 
		extensionInitial();
	}

	commandRegister(context, 'enable', async () => {
		const hasStarted = store.getValue('started', 'global');
		if (!hasStarted) { 
			extensionInitial();
			await defaultPlatformConnector.connect();
		}
		showInfoWithBtn('需求助手已经启动！', ['我知道了'], () => { });
	});

	commandRegister(context, 're-connect', async () => {
		await defaultPlatformConnector.connect();
		showInfoWithBtn('需求助手已经重新连接！', ['我知道了'], () => { });
	});
}

export function deactivate() {
	const store = new SimpleStore('global');
	store.reset();
}

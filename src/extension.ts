// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { EXTENSION_FLAG } from './enums/const';
import { SimpleStore } from './utils/store';
import { getExtensionConfiguration, commandRegister } from './utils';
import { getDefaultConnector } from './connector/utils';
import { extensionInitial } from './initial';

export function activate(context: vscode.ExtensionContext) {
	const defaultPlatformConnector = getDefaultConnector();
	const store = new SimpleStore(defaultPlatformConnector.platformInfo.name);

	extensionInitial(context);

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
	

	commandRegister(context, 'enable', async () => { 
		await defaultPlatformConnector.connect();
	});
}

export function deactivate() {
	const store = new SimpleStore('global');
	store.reset();
}

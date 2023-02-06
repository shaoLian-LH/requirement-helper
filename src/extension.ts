// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { EXTENSION_FLAG } from './enums/const';
import { SimpleStore } from './utils/store';
import { getExtensionConfiguration, commandRegister, subscribeDisposables } from './utils';
import { scanText } from './utils/scanner';
import { addDiagnostics, highlightRequirementArea } from './utils/decoration';
import { getDefaultConnector } from './connector/utils';

export function activate(context: vscode.ExtensionContext) {
	const defaultPlatformConnector = getDefaultConnector();
	const store = new SimpleStore(defaultPlatformConnector.platformInfo.name);

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

	const requirementDiagnostics = vscode.languages.createDiagnosticCollection("requirementDiagnostics");
	context.subscriptions.push(requirementDiagnostics);
	store.setValue('requirementDiagnosticArr', []);

	const scanAfterSaving = vscode.workspace.onDidSaveTextDocument((textDocument) => { 
		const requirementSettings = scanText(textDocument);
		const newAffected = store.updateTagInfos(requirementSettings);
		const targetEditor = vscode.window.activeTextEditor;
		
		if (!targetEditor) { return; }
		
		const affectedRanges = highlightRequirementArea(
			targetEditor,
			newAffected
		);
		addDiagnostics(targetEditor, affectedRanges, requirementDiagnostics);
	});

	subscribeDisposables(context, scanAfterSaving);

	commandRegister(context, 'enable', async () => { 
		await defaultPlatformConnector.connect();
	});
}

export function deactivate() {
	const store = new SimpleStore('global');
	store.reset();
}

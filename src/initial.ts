import * as vscode from 'vscode';

import { scanText } from './utils/scanner';
import { subscribeDisposables } from './utils';
import { addDiagnosticsForCollection, highlightRequirementArea } from './utils/decoration';
import { fillTagInfosFromServer, updateTagInfos } from './utils/tagOperations';
import { getDefaultConnector } from './connector/utils';

export const addRequirementDiagnostics = (context: vscode.ExtensionContext) => { 
	const requirementDiagnostics = vscode.languages.createDiagnosticCollection("requirementDiagnostics");
	subscribeDisposables(context, requirementDiagnostics);
	vscode.workspace.onDidCloseTextDocument((doc) => { 
		requirementDiagnostics.delete(doc.uri);
	});
	return requirementDiagnostics;
};

export const addSaveScanner = (
	context: vscode.ExtensionContext,
	requirementDiagnostics: vscode.DiagnosticCollection
) => { 
	const scanAfterSaving = vscode.workspace.onDidSaveTextDocument((textDocument) => { 
		const defaultConnector = getDefaultConnector();
		const scopeName = defaultConnector.platformInfo.name;
	
		const requirementSettings = scanText(textDocument);
		const affectedSettings = updateTagInfos(
			requirementSettings,
			scopeName
		);
		const targetEditor = vscode.window.activeTextEditor;
		
		if (!targetEditor) { return; }
		
		highlightRequirementArea(targetEditor, affectedSettings);
		fillTagInfosFromServer(affectedSettings, scopeName)
			.then((pressedInfos) => { 
				addDiagnosticsForCollection(targetEditor, pressedInfos, requirementDiagnostics);
			});
	});

	subscribeDisposables(context, scanAfterSaving);
};
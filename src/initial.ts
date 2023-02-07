import * as vscode from 'vscode';

import { scanText } from './utils/scanner';
import { subscribeDisposables } from './utils';
import { addDiagnosticsForCollection, highlightRequirementArea } from './utils/decoration';
import { updateTagInfos } from './utils/tagOperations';

const initRequirementDiagnostics = (context: vscode.ExtensionContext) => { 
	const requirementDiagnostics = vscode.languages.createDiagnosticCollection("requirementDiagnostics");
	subscribeDisposables(context, requirementDiagnostics);
	return requirementDiagnostics;
};

const addSaveScanner = (
	context: vscode.ExtensionContext,
	requirementDiagnostics: vscode.DiagnosticCollection
) => { 
	const scanAfterSaving = vscode.workspace.onDidSaveTextDocument((textDocument) => { 
		const requirementSettings = scanText(textDocument);
		const affectedSettings = updateTagInfos(requirementSettings);
		const targetEditor = vscode.window.activeTextEditor;
		
		if (!targetEditor) { return; }
		
		highlightRequirementArea(targetEditor, affectedSettings);
		addDiagnosticsForCollection(targetEditor, affectedSettings, requirementDiagnostics);
	});

	subscribeDisposables(context, scanAfterSaving);
};

export const extensionInitial = (context: vscode.ExtensionContext) => { 
  const requirementDiagnostics = initRequirementDiagnostics(context);
  addSaveScanner(context, requirementDiagnostics);
};
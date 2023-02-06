import * as vscode from 'vscode';
import { Requirement } from '../types/connector';
import * as path from 'path';
import { getDefaultConnector } from '../connector/utils';
import { SimpleStore } from './store';

export const highlightRequirementArea = (
  targetEditor: vscode.TextEditor,
  newAffected: Requirement[]
) => { 
  const ranges = newAffected.map((setting) => { 
    const { position } = setting;
    
    return new vscode.Range(
      position.typeCharStart,
      position.codeCharEnd
    );
  });

  const iconPath = path.join(__dirname, '..', 'resources', 'zentao.png');

  const defaultDecoration = vscode.window.createTextEditorDecorationType({
    color: '#cfedbd',
    rangeBehavior: vscode.DecorationRangeBehavior.OpenClosed,
    gutterIconPath: iconPath,
    gutterIconSize: 'contain'
  });

  targetEditor.setDecorations(defaultDecoration, ranges);
  return ranges;
};

export const addDiagnostics = (
  targetEditor: vscode.TextEditor,
  ranges: vscode.Range[],
  requirementDiagnostics: vscode.DiagnosticCollection
) => { 
  const platformInstance = getDefaultConnector();
  const diagnosticsProviders = ranges.map(range => new vscode.Diagnostic(
    range, `点击查看 ${platformInstance.platformInfo.name} 需求`, vscode.DiagnosticSeverity.Information
  ));

  const store = new SimpleStore('global');
  const preArr = store.getValue('requirementDiagnosticArr') as Array<vscode.Diagnostic>;
  const newRequirementDiagnosticArr = [...preArr, ...diagnosticsProviders];
  store.setValue('requirementDiagnosticArr', newRequirementDiagnosticArr);

  requirementDiagnostics.set(
    targetEditor.document.uri,
    []
  );

  requirementDiagnostics.set(
    targetEditor.document.uri,
    newRequirementDiagnosticArr
  );
};
import type { Requirement } from '../types/connector';

import * as vscode from 'vscode';
import * as path from 'path';
import { getDefaultConnector } from '../connector/utils';

const ZENTAO_ICON_PATH = path.join(__dirname, '..', 'resources', 'zentao.png');
const ZENTAO_DECORATION = vscode.window.createTextEditorDecorationType({
  color: '#cfedbd',
  rangeBehavior: vscode.DecorationRangeBehavior.OpenClosed,
  gutterIconPath: ZENTAO_ICON_PATH,
  gutterIconSize: 'contain'
});

const makeRange = (requirement: Requirement) => { 
  const { position } = requirement;
  return new vscode.Range(
    position.typeCharStart,
    position.codeCharEnd
  );
};

export const highlightRequirementArea = (
  targetEditor: vscode.TextEditor,
  affectedSettings: Requirement[]
) => { 
  const ranges = affectedSettings.map(setting => makeRange(setting));

  targetEditor.setDecorations(ZENTAO_DECORATION, ranges);
};

export const addDiagnosticsForCollection = (
  targetEditor: vscode.TextEditor,
  affectedSettings: Requirement[],
  requirementDiagnostics: vscode.DiagnosticCollection
) => { 
  const platformInstance = getDefaultConnector();

  const diagnosticsProviders = affectedSettings.map(
    requirement => new vscode.Diagnostic(
      makeRange(requirement),
      `点击查看 ${platformInstance.platformInfo.name} 需求`,
      vscode.DiagnosticSeverity.Information
    )
  );

  requirementDiagnostics.set(
    targetEditor.document.uri,
    diagnosticsProviders
  );
};
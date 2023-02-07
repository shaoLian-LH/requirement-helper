import type { PressedRequirementInfo, Requirement } from '../types/connector';

import * as vscode from 'vscode';
import * as path from 'path';

const ZENTAO_ICON_PATH = path.join(__dirname, '..', 'resources', 'zentao.png');
const ZENTAO_DECORATION = vscode.window.createTextEditorDecorationType({
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

const simpleTranslator = (text: string) => { 
  return text
    .replace('zentao', '禅道')
    .replace('story', '需求')
    .replace('task', '任务')
    .replace(/<br\s?\/>/gmi, '');
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
  pressedInfos: PressedRequirementInfo[],
  requirementDiagnostics: vscode.DiagnosticCollection
) => { 
  const targetUri = targetEditor.document.uri;

  const diagnostics = pressedInfos.map(
    pressedInfo => { 
      const { title, desc, ref: requirement } = pressedInfo;
      const { type, id } = requirement;
      const range = makeRange(requirement);

      const diagnostic = new vscode.Diagnostic(
        range,
        simpleTranslator(`${type}#${id} \n标题：${title} \n描述：${desc}`),
        vscode.DiagnosticSeverity.Hint
      );
      return diagnostic;
    }
  );

  requirementDiagnostics.set(targetUri, diagnostics);
};
import { Requirement, RequirementType } from "../types/connector";
import * as vscode from 'vscode';

const COMMENT_REGEX = /(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+)|(\/\/.*)/igm;
const REQUIREMENT_TAG_REGEX = /\[(story|bug|case|task)\]\s?#([1-9]*)/igm;

const getAllComment = (text: string) => { 
  return text.match(COMMENT_REGEX);
};

const maybeRequirementTag = (text: string): boolean => { 
  return !!text.match(REQUIREMENT_TAG_REGEX);
};

const extractRequirementTagGroups = (
  textDocument: vscode.TextDocument,
  requirementComment: string
) => { 
  const fullText = textDocument.getText();
  let group = REQUIREMENT_TAG_REGEX.exec(requirementComment);
  const tagGroups: Requirement[] = [];
  while (group) { 
    if (!group || group.length < 2) { return null; }
    const codeNumber = group[2];
    const currentFound = group.input.replace(/\s*$/, '');
    const match = fullText.indexOf(currentFound);

    // 整条注释（// or /** */）的位置
    const startPos = textDocument.positionAt(match);
    const endPos = textDocument.positionAt(match + currentFound.length);

    // 类型（[story|...]）的位置
    const typeCharStartIndex = match + group.input.indexOf('[');
    const typeCharEndIndex = match + group.input.indexOf(']') + 1;

    // 编号（#xxx）开始的位置
    const codeCharStartIndex = match + group.input.indexOf('#') + 1;
    const commendCharEnd = textDocument.positionAt(match + typeCharStartIndex);

    tagGroups.push({
      type: group[1] as RequirementType,
      id: group[2] as string,
      position: {
        commendCharStart: startPos,
        commendCharEnd: commendCharEnd,
        typeCharStart: textDocument.positionAt(typeCharStartIndex),
        typeCharEnd: textDocument.positionAt(typeCharEndIndex),
        codeCharStart: textDocument.positionAt(codeCharStartIndex),
        codeCharEnd: textDocument.positionAt(codeCharStartIndex + codeNumber.length),
        start: startPos,
        end: endPos,
      }
    });
    group = REQUIREMENT_TAG_REGEX.exec(requirementComment);
  }
  
  return tagGroups;
};

export const scanText = (textDocument: vscode.TextDocument) => { 
  const text = textDocument.getText();
  const comments = getAllComment(text) || [];

  const requirementSettings = comments
    .filter(maybeRequirementTag)
    .flatMap((requirementComment) => extractRequirementTagGroups(textDocument, requirementComment))
    .filter((strShouldNotBeNull) => strShouldNotBeNull) as Requirement[];

  return requirementSettings;
};
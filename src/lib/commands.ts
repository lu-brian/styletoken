import * as vscode from 'vscode';

import { 
  getActiveEditorURI,
  getPositionAfter,
  getPositionBefore,
  getTextSelection,
} from './commons';
import { getPhraseMatches } from './patterns';
import { Token } from './models';

export const addStyle = (
  token: Token,
): void => {
  const activeEditor = vscode.window.activeTextEditor;
  const text = getTextSelection();
  if (activeEditor == null || text == null) { 
    return; 
  };

  const cachedRanges = token.path?.[`${activeEditor?.document.uri.path}`]?.ranges ?? [];
  const ranges = [...cachedRanges ,...getPhraseMatches(activeEditor, text)];
  const positions = ranges
    .map(range => range.start)
    .sort((a, b) => activeEditor.document.offsetAt(a) - activeEditor.document.offsetAt(b));
  const path = activeEditor.document.uri.path;
  token.path = {
    ...token.path,
    [path]: {
      ranges,
      positions,
    },
  };
  activeEditor.setDecorations(token.decorator, ranges);
};

export const setStyle = (
  token: Token,
): void => {
  const activeEditor = vscode.window.activeTextEditor;
  const text = getTextSelection();
  if (activeEditor == null || text == null) {
    return;
  };

  const ranges = getPhraseMatches(activeEditor, text);
  const positions = ranges.map( range => range.start);
  const path = activeEditor.document.uri.path;
  token.path = {
    ...token.path,
    [path]: {
      ranges,
      positions,
    },
  };
  activeEditor.setDecorations(token.decorator, ranges);
};

export const refreshStyle = (
  token: Token,
): void => {
  const activeEditor = vscode.window.activeTextEditor;
  const ranges = token.path?.[`${activeEditor?.document.uri.path}`]?.ranges; 
  if (activeEditor == null || ranges == null) {
    return;
  }
  activeEditor.setDecorations(token.decorator, ranges);
};

export const removeStyle = (
  token: Token,
): void => {
  const activeEditor = vscode.window.activeTextEditor;
  if (
    activeEditor != null &&
    token.path?.[activeEditor?.document.uri.path] != null
  ) {
    activeEditor.setDecorations(token.decorator,[]);
    delete token.path[activeEditor.document.uri.path];
  }
};

export const findPreviousStyle = async (
  token: Token,
): Promise<void> => {
  const activeEditor = vscode.window.activeTextEditor;
  const cachedEditor = token.path?.[`${activeEditor?.document.uri.path}`]; 
  if (activeEditor == null || cachedEditor == null) {
    return;
  }

  await vscode.commands.executeCommand(
    'editor.action.goToLocations',
    getActiveEditorURI(),
    getPositionBefore(activeEditor, cachedEditor),
    [],
    'goto',
  );
};

export const findNextStyle = async (
  token: Token,
): Promise<void> => {
  const activeEditor = vscode.window.activeTextEditor;
  const cachedEditor = token.path?.[`${activeEditor?.document.uri.path}`];
  if (activeEditor == null || cachedEditor == null) {
    return;
  }

  await vscode.commands.executeCommand(
    'editor.action.goToLocations',
    getActiveEditorURI(),
    getPositionAfter(activeEditor, cachedEditor),
    [],
    'goto',
  );
};

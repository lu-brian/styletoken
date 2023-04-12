import * as vscode from 'vscode';

import {
  getActiveEditorURI,
  getPositionAfter,
  getPositionBefore,
  getRanges,
  getTextSelection,
} from '../commons';
import { getPhraseMatches } from '../patterns';
import { Token } from '../token';

export const addStyle = (
  activeEditor: vscode.TextEditor,
  token: Token,
): void => {
  const text = getTextSelection();
  if (text == null) {
    return;
  }
  const cachedRange = token.getCachedEditor(activeEditor)?.ranges ?? [];
  const ranges = [
    ...cachedRange,
    ...getRanges(activeEditor, getPhraseMatches(activeEditor, token.options, text)),
  ];
  const positions = ranges
    .map((range) => range.start)
    .sort((a, b) => activeEditor.document.offsetAt(a) - activeEditor.document.offsetAt(b));
  token.addCachedEditor(activeEditor, [], positions, ranges, text);
  activeEditor.setDecorations(token.decorator, ranges);
};

export const setStyle = (
  activeEditor: vscode.TextEditor,
  token: Token,
): void => {
  const text = getTextSelection();
  if (text == null) {
    return;
  }
  const ranges = getRanges(activeEditor, getPhraseMatches(activeEditor, token.options, text));
  const positions = ranges.map((range) => range.start);
  token.setCachedEditor(activeEditor, [], positions, ranges, text);
  activeEditor.setDecorations(token.decorator, ranges);
};

export const removeStyle = (
  activeEditor: vscode.TextEditor,
  token: Token,
): void => {
  token.removeCachedEditor(activeEditor);
  activeEditor.setDecorations(token.decorator, []);
};

export const findPreviousStyle = async (
  activeEditor: vscode.TextEditor,
  token: Token,
): Promise<void> => {
  const cachedEditor = token.getCachedEditor(activeEditor);
  if (cachedEditor == null) {
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
  activeEditor: vscode.TextEditor,
  token: Token,
): Promise<void> => {
  const cachedEditor = token.getCachedEditor(activeEditor);
  if (cachedEditor == null) {
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

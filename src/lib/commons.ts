import * as vscode from 'vscode';

import {
  CachedEditor,
  FlatRange,
} from './models';

/**
 * Gets the active editor URI if available
 */
export const getActiveEditorURI = (): vscode.Uri | undefined => {
  if (vscode.window.activeTextEditor == null) {
    return;
  }
  return vscode.window.activeTextEditor.document.uri;
};

/**
 * Gets either the selection, or the text boundary of the cursor position
 */
export const getTextSelection = (): string | undefined => {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor == null) {
    return;
  }
  const cursor = activeEditor.selection.start;
  const selection = activeEditor.selection.isEmpty ?
    activeEditor.document.getWordRangeAtPosition(cursor) :
    activeEditor.selection;
  if (selection == null) {
    return;
  }
  return activeEditor.document.getText(selection);
};

/**
 * Gets next position
 *
 * @param activeEditor
 * @param cachedEditor
 */
export const getPositionAfter = (
  activeEditor: vscode.TextEditor,
  cachedEditor: CachedEditor,
): vscode.Position => {
  const positions = cachedEditor.positions;
  return positions.find(position => {
    return position.isAfter(activeEditor.selection.start);
  }) ?? positions[0];
};

/**
 * Gets previous position
 *
 * @param activeEditor
 * @param cachedEditor
 */
export const getPositionBefore = (
  activeEditor: vscode.TextEditor,
  cachedEditor: CachedEditor,
): vscode.Position => {
  const positions = cachedEditor.positions;
  const positionIndex = positions.findIndex(position => {
    return position.isAfterOrEqual(activeEditor.selection.start);
  });
  return positionIndex === -1 ? 
    positions.slice(positionIndex)[0] : positions.slice(positionIndex - 1)[0];
};

/**
 * Gets a vscode.Range value from flatRange
 *
 * @param flatRange
 * @param activeEditor
 */
export const getRange = (
  flatRange: FlatRange,
  activeEditor: vscode.TextEditor,
  ): vscode.Range => {
  return new vscode.Range(
    getPosition(flatRange.startOffset, activeEditor), 
    getPosition(flatRange.endOffset, activeEditor)
  );
};

/**
 * Gets a vscode.Position value from offset
 *
 * @param offset
 * @param activeEditor
 */
export const getPosition = (
  offset: number,
  activeEditor: vscode.TextEditor,
  ): vscode.Position => {
  return activeEditor.document.positionAt(offset);
};

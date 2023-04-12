import * as vscode from 'vscode';

import { getTokens } from './configuration';
import {
  addStyle,
  setStyle,
  removeStyle,
  findPreviousStyle,
  findNextStyle,
} from './lib/disposables/commands';
import {
  refreshStyleActive,
  refreshStyleCached,
} from './lib/disposables/listeners';
import { Token } from './lib/token';

/**
 * Main registration function for commands and listeners
 */
export const registration = (extensionId: string): vscode.Disposable[] => {
  const tokens = getTokens(extensionId);
  const disposables: vscode.Disposable[] = [];
  for (const [key, value] of Object.entries(tokens)) {
    const token = new Token(
      vscode.window.createTextEditorDecorationType(value.decorator),
      value.option,
    );

    disposables.push(...getListenerDisposables(token));
    disposables.push(...getCommandDisposables(extensionId, token, key));
  }
  return disposables;
};

const getListenerDisposables = (
  token: Token,
): vscode.Disposable[] => {
  const disposables: vscode.Disposable[] = [];
  disposables.push(vscode.window.onDidChangeVisibleTextEditors(() => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor != null) {
      refreshStyleCached(activeEditor, token);
    }
  }));
  disposables.push(vscode.workspace.onDidChangeTextDocument(() => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor != null) {
      refreshStyleActive(activeEditor, token);
    }
  }));
  return disposables;
};

const getCommandDisposables = (
  extensionId: string,
  token: Token,
  tokenName: string,
): vscode.Disposable[] => {
  const functions = [
    addStyle,
    setStyle,
    removeStyle,
    findPreviousStyle,
    findNextStyle,
  ];
  const disposables: vscode.Disposable[] = [];
  functions.forEach((fn) => {
    disposables.push(
      vscode.commands.registerCommand(`${extensionId}.${tokenName}.${fn.name}`, () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor != null) {
          fn(activeEditor, token);
        }
      }),
    );
  });
  return disposables;
};

import * as vscode from 'vscode';

import { getTokens } from './configuration';
import {
  addStyle,
  setStyle,
  removeStyle,
  removeStyles,
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
  const vscodeTokens = getTokens(extensionId);
  const tokens: Token[] = [];

  const disposables: vscode.Disposable[] = [];
  for (const [key, value] of Object.entries(vscodeTokens)) {
    const token = new Token(
      vscode.window.createTextEditorDecorationType(value.decorator),
      value.option,
    );

    tokens.push(token);
    disposables.push(...getListenerDisposables(token));
    disposables.push(...getCommandDisposables(extensionId, token, key));
  }
  disposables.push(...getGlobalDisposables(extensionId, tokens));

  return disposables;
};

const getGlobalDisposables = (
  extensionId: string,
  tokens: Token[],
): vscode.Disposable[] => {
  const functions = [
    removeStyles,
  ];

  const disposables: vscode.Disposable[] = [];
  functions.forEach((fn) => {
    disposables.push(
      vscode.commands.registerCommand(`${extensionId}.${fn.name}`, () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor != null) {
          fn(activeEditor, tokens);
        }
      }),
    );
  });
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

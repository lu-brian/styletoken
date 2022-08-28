import * as vscode from 'vscode';

import {
  addStyle,
  setStyle,
  refreshStyle,
  removeStyle,
  findPreviousStyle,
  findNextStyle,
} from './lib/commands';
import { getTokens } from './configuration';
import { Token } from './lib/models';

/**
 * Main registration function for commands and listeners
 */
export const registration = (extensionId: string): vscode.Disposable[] => {
  const tokens = getTokens(extensionId);
  const disposables: vscode.Disposable[] = [];
  for (let [key, value] of Object.entries(tokens)) {
    const token = new Token(
      vscode.window.createTextEditorDecorationType(value.decorator),
      value.option,
    );
    disposables.push(getListenerDisposables(token));
    disposables.push(...getCommandDisposables(extensionId, token, key));
    // test
    // disposables.push(vscode.commands.registerCommand(`${extensionId}.token1.test`, () => {
    //   vscode.window.activeTextEditor?.setDecorations()
    // }))
  };
  return disposables;
};

const getListenerDisposables = (
  token: Token,
): vscode.Disposable => {  
  return vscode.window.onDidChangeVisibleTextEditors(() => refreshStyle(token));
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
  functions.map(fn => {
    disposables.push(
      vscode.commands.registerCommand(`${extensionId}.${tokenName}.${fn.name}`, () => {
        fn(token);
      })
    );
  });
  return disposables;
};

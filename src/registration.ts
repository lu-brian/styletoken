import * as vscode from 'vscode';

import {
  addStyle,
  setStyle,
  refreshStyle,
  removeStyle,
  findPreviousStyle,
  findNextStyle,
} from './lib/commands';
import { ALPHA_MAP } from './lib/constants';
import {
  Token,
  Decorator,
} from './lib/models';

/**
 * Main registration function for commands and listeners
 */
export const registration = (extensionId: string): vscode.Disposable[] => {
  const tokens = getTokens(extensionId);
  const disposables: vscode.Disposable[] = [];
  for (let [key, value] of Object.entries(tokens)) {
    const token = new Token(createDecoration(value));
    disposables.push(getListenerDisposables(token));
    disposables.push(...getCommandDisposables(extensionId, token, key));
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

/**
 * Used to force Decoration limits
 */
const createDecoration = (
  {...style }: Decorator
): vscode.TextEditorDecorationType => {
  return vscode.window.createTextEditorDecorationType({
    backgroundColor: style.backgroundColor,
		borderWidth: style.borderWidth,
		borderStyle: style.borderStyle,
		overviewRulerColor: style.overviewRulerColor,
		overviewRulerLane: style.overviewRulerLane,
		light: {
			borderColor: style.light?.borderColor,
		},
		dark: {
			borderColor: style.dark?.borderColor,
		},
	});
};

/**
 * Main functions to gather Token configurations
 */
const getTokens = (extensionId: string): { [key: string]: Decorator } => {
  const tokenNames = getTokenNames(extensionId);
  const tokenDecorators = getTokenDecorators(tokenNames, extensionId);
  return tokenNames.reduce((accumulator, tokenName, index) => {
    return {...accumulator, [tokenName]: tokenDecorators[index]};
  }, {});
};

const getTokenNames = (extensionId: string): string[] => {
  return Object
    .keys(vscode.workspace.getConfiguration(extensionId))
    .filter((key => {
      return /^token\d$/.test(key);
    }));
};

const getTokenDecorators = (
  tokenNames: string[],
  extensionId: string
): Decorator[] => {
  let decorators: Decorator[] = [];
  tokenNames.map(token => {
    const decorations = vscode.workspace.getConfiguration(`${extensionId + '.' + token}`);
    const decoration: Decorator = {
      backgroundColor: getHexWithAlpha(decorations.get("backgroundColor")),
      borderWidth: decorations.get("borderWidth") ?? undefined,
      borderStyle: decorations.get("borderStyle") ?? undefined,
      overviewRulerColor: getHexWithAlpha(decorations.get("overviewRulerColor")),
      overviewRulerLane: decorations.get("overviewRulerLane") ?? undefined,
      light: {
          borderColor: getHexWithAlpha(decorations.get("borderColor")),
      },
      dark: {
          borderColor: getHexWithAlpha(decorations.get("borderColor")),
      },
    };
    decorators.push(decoration);
  });
  return decorators;
};

const getHexWithAlpha = (hex: unknown): string | undefined => {
  if (typeof(hex) === 'string') {
    const base = hex.split('.');
    const color = base[0];
    const alpha = Number(base[1]);

    switch (true) {
      case (isNaN(alpha)):
      case (alpha > 100):
        return color + ALPHA_MAP[100];
      case (alpha < 0):
        return color + ALPHA_MAP[0];
      default:
        return color + ALPHA_MAP[alpha];
    }
  }
  return;
};

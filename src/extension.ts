import * as vscode from 'vscode';

import { EXTENSION_ID } from './lib/constants';
import { registration } from './registration';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(...registration(EXTENSION_ID));
};

export function deactivate(){};

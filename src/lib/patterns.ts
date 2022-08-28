import * as vscode from 'vscode';

import {
  FlatRange,
  TokenOptions,
} from './models';
import { getRange } from './commons';

export const getPhraseMatches = (
  activeEditor: vscode.TextEditor,
  options: TokenOptions,
  phrase: string,
): vscode.Range[] => {
  const documentText = options.isCaseSensitive === true ?
    activeEditor.document.getText() : activeEditor.document.getText().toLowerCase();
  phrase = options.isCaseSensitive === true ?
    phrase : phrase.toLowerCase();
  const location = {
    flatRanges: [] as FlatRange[],
    lastOffset: 0
  };
  const textInFrontOfSelectedText = documentText
    .split(phrase)
    .slice(0, -1);
	const locations = textInFrontOfSelectedText.reduce((location, textInFront) => {
    const startOffset = location.lastOffset + textInFront.length;
    const endOffset = startOffset + phrase.length;
    return {
      flatRanges: location.flatRanges.concat({startOffset, endOffset}),
      lastOffset: endOffset
    };
  }, location);
  return locations.flatRanges.map(flatRange => getRange(flatRange, activeEditor));
};

// regex

// references
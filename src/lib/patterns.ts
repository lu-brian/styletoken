import * as vscode from 'vscode';

import {
  FlatRange,
  TokenOptions,
} from './models';

export const getPhraseMatches = (
  activeEditor: vscode.TextEditor,
  options: TokenOptions,
  phrase: string,
): FlatRange[] => {
  phrase = options.isCaseSensitive === true
    ? phrase
    : phrase.toLowerCase();

  const documentText = options.isCaseSensitive === true
    ? activeEditor.document.getText()
    : activeEditor.document.getText().toLowerCase();
  const location = {
    flatRanges: [] as FlatRange[],
    lastOffset: 0,
  };

  const textInFrontOfSelectedText = documentText
    .split(phrase)
    .slice(0, -1);
  const locations = textInFrontOfSelectedText.reduce((loc, textInFront) => {
    const startOffset = loc.lastOffset + textInFront.length;
    const endOffset = startOffset + phrase.length;
    return {
      flatRanges: loc.flatRanges.concat({ startOffset, endOffset }),
      lastOffset: endOffset,
    };
  }, location);
  return locations.flatRanges;
};

// regex

// references

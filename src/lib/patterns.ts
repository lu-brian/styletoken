import * as vscode from 'vscode';

import { FlatRange } from './models';
import { getRange } from './commons';

export const getPhraseMatches = (
  activeEditor: vscode.TextEditor,
  phrase: string,
): vscode.Range[] => {
  const documentText = activeEditor.document.getText();
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
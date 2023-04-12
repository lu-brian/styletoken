import * as vscode from 'vscode';

import { FlatRange } from '../models';
import { getRanges } from '../commons';
import { getPhraseMatches } from '../patterns';
import { Token } from '../token';

export const refreshStyleCached = (
  activeEditor: vscode.TextEditor,
  token: Token,
): void => {
  const ranges = token.getCachedEditor(activeEditor)?.ranges;
  if (ranges == null) {
    return;
  }
  activeEditor.setDecorations(token.decorator, ranges);
};

export const refreshStyleActive = (
  activeEditor: vscode.TextEditor,
  token: Token,
): void => {
  const texts = token.getCachedEditor(activeEditor)?.texts;
  if (texts == null) {
    return;
  }

  const flatRanges: FlatRange[] = [];
  texts.forEach((text) => {
    flatRanges.push(...getPhraseMatches(activeEditor, token.options, text));
  });

  const ranges = getRanges(activeEditor, flatRanges);
  const offsets = flatRanges
    .map((range) => range.startOffset)
    .sort((a, b) => a - b);
  const positions = offsets.map((offset) => activeEditor.document.positionAt(offset));

  token.addCachedEditor(activeEditor, offsets, positions, ranges, '');
  activeEditor.setDecorations(token.decorator, ranges);
};

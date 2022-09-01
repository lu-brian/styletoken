import * as vscode from 'vscode';

import {
  CachedEditor,
  Path,
  TokenOptions,
} from './models';

/**
 * Style Token containing the location of highlights,
 * decorations, and options.
 */
 export class Token {
  paths: Path | undefined;

  constructor(
    public decorator: vscode.TextEditorDecorationType,
    public options: TokenOptions,
  ){}

  getCachedEditor(
    activeEditor: vscode.TextEditor
  ): CachedEditor | undefined {
    return this.paths?.[`${activeEditor.document.uri.path}`];
  };

  setCachedEditor(
    activeEditor: vscode.TextEditor,
    offsets: number[],
    positions: vscode.Position[],
    ranges: vscode.Range[],
    text: string,
  ): void {
    const path = activeEditor.document.uri.path;
    this.paths = {
      ...this.paths,
      [path]: {
        offsets,
        positions,
        ranges,
        texts: [text],
      }
    };
  };

  addCachedEditor(
    activeEditor: vscode.TextEditor,
    offsets: number[],
    positions: vscode.Position[],
    ranges: vscode.Range[],
    text: string,
  ): void {
    const path = activeEditor.document.uri.path;
    if (this.paths?.[path] != null) {
      this.paths[path].offsets = offsets === [] ?
        this.paths[path].offsets : offsets;
      this.paths[path].positions = positions;
      this.paths[path].ranges = ranges;
      this.paths[path].texts = text === '' ?
        this.paths[path].texts : this.paths[path].texts.concat(text);
    } else {
      this.setCachedEditor(activeEditor, offsets, positions, ranges, text);
    };
  };

  removeCachedEditor(
    activeEditor: vscode.TextEditor,
  ): void {
    const path = activeEditor.document.uri.path;
    if (this.paths?.[path] != null) {
      delete this.paths[path];
    };
  };
};

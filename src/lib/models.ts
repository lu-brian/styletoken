import * as vscode from 'vscode';

/**
 * Highlight configurations. The `decorator` nomenclature
 * is interchangable with `style`. However, `style` is 
 * user facing while `decorator` is internal.
 */
export interface Decorator {
  backgroundColor?: string;
  borderWidth?: '1px' | '2px' | '3px' | string;
  borderStyle?: 'dotted' | 'dashed' | 'solid';
  // scrollbar
  overviewRulerColor?: string;
  overviewRulerLane?: vscode.OverviewRulerLane;
  light?: {
      borderColor?: string;
  },
  dark?: {
      borderColor?: string;
  },
}

/**
 * Style Token containing the location of highlights,
 * decorations, and functions.
 */
 export class Token {
  // using URI as the key for faster lookup
  path: Path | undefined;
  configurations?: {
    isCaseSensitive?: boolean;
    isMatchWholeWords?: boolean;
  };

  constructor(
    public decorator: vscode.TextEditorDecorationType,
  ){}
}

export interface Path extends Record<string, CachedEditor> {
}

/**
 * A set of ranges and positions for a particular URI
 * used to track decorated locations. All params are
 * in `vscode` values.
 */
export interface CachedEditor {
  ranges: vscode.Range[];
  positions: vscode.Position[];
  texts?: [{
    text: string;
    count: number;
  }];
}

/**
 * A range created from two offsets
 *
 * @param startOffset An offset.
 * @param endOffset An offset.
 */
export interface FlatRange {
  startOffset: number;
  endOffset: number;
}
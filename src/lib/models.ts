import * as vscode from 'vscode';

type Size = '1px' | '2px' | '3px';
type BorderStyle = 'dotted' | 'dashed' | 'solid';

/**
 * Highlight configurations. The `decorator` nomenclature
 * is interchangable with `style`. However, `style` is 
 * user facing while `decorator` is internal.
 */
export interface Decorator {
  backgroundColor?: string;
  borderWidth?: Size | string;
  borderStyle?: BorderStyle;
  // scrollbar
  overviewRulerColor?: string;
  overviewRulerLane?: vscode.OverviewRulerLane;
  light?: {
      borderColor?: string;
  },
  dark?: {
      borderColor?: string;
  },
  rangeBehavior: vscode.DecorationRangeBehavior;
};

/**
 * Style Token containing the location of highlights,
 * decorations, and options.
 */
 export class Token {
  // using URI as the key for faster lookup
  path: Path | undefined;

  constructor(
    public decorator: vscode.TextEditorDecorationType,
    public options: TokenOptions,
  ){}
};

export interface Path extends Record<string, CachedEditor> {
}

export interface TokenOptions {
  isCaseSensitive: boolean;
  // "Option to turn on/off entire word match. E.g. when set to true, `car` will not match `racecar`"
  isMatchWholeWord: boolean;
};

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
};

/**
 * A range created from two offsets
 *
 * @param startOffset An offset.
 * @param endOffset An offset.
 */
export interface FlatRange {
  startOffset: number;
  endOffset: number;
};

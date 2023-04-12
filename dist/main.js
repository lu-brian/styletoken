"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);

// src/lib/constants.ts
var vscode = __toESM(require("vscode"));
var EXTENSION_ID = "styletoken";
var DECORATION_RANGE_BEHAVIOR = vscode.DecorationRangeBehavior.ClosedClosed;
var OVERVIEW_RULER_LANE_MAP = {
  Center: vscode.OverviewRulerLane.Center,
  Full: vscode.OverviewRulerLane.Full,
  Left: vscode.OverviewRulerLane.Left,
  Right: vscode.OverviewRulerLane.Right
};
var ALPHA_MAP = {
  100: "FF",
  99: "FC",
  98: "FA",
  97: "F7",
  96: "F5",
  95: "F2",
  94: "F0",
  93: "ED",
  92: "EB",
  91: "E8",
  90: "E6",
  89: "E3",
  88: "E0",
  87: "DE",
  86: "DB",
  85: "D9",
  84: "D6",
  83: "D4",
  82: "D1",
  81: "CF",
  80: "CC",
  79: "C9",
  78: "C7",
  77: "C4",
  76: "C2",
  75: "BF",
  74: "BD",
  73: "BA",
  72: "B8",
  71: "B5",
  70: "B3",
  69: "B0",
  68: "AD",
  67: "AB",
  66: "A8",
  65: "A6",
  64: "A3",
  63: "A1",
  62: "9E",
  61: "9C",
  60: "99",
  59: "96",
  58: "94",
  57: "91",
  56: "8F",
  55: "8C",
  54: "8A",
  53: "87",
  52: "85",
  51: "82",
  50: "80",
  49: "7D",
  48: "7A",
  47: "78",
  46: "75",
  45: "73",
  44: "70",
  43: "6E",
  42: "6B",
  41: "69",
  40: "66",
  39: "63",
  38: "61",
  37: "5E",
  36: "5C",
  35: "59",
  34: "57",
  33: "54",
  32: "52",
  31: "4F",
  30: "4D",
  29: "4A",
  28: "47",
  27: "45",
  26: "42",
  25: "40",
  24: "3D",
  23: "3B",
  22: "38",
  21: "36",
  20: "33",
  19: "30",
  18: "2E",
  17: "2B",
  16: "29",
  15: "26",
  14: "24",
  13: "21",
  12: "1F",
  11: "1C",
  10: "1A",
  9: "17",
  8: "14",
  7: "12",
  6: "0F",
  5: "0D",
  4: "0A",
  3: "08",
  2: "05",
  1: "03",
  0: "00"
};

// src/registration.ts
var vscode5 = __toESM(require("vscode"));

// src/configuration.ts
var vscode2 = __toESM(require("vscode"));
var getTokens = (extensionId) => {
  const tokenNames = getTokenNames(extensionId);
  const tokenOptions = getTokenConfigurations(tokenNames, extensionId);
  return tokenNames.reduce((accumulator, tokenName, index) => {
    return { ...accumulator, [tokenName]: tokenOptions[index] };
  }, {});
};
var getTokenNames = (extensionId) => {
  return Object.keys(vscode2.workspace.getConfiguration(extensionId)).filter((key) => {
    return /^token\d$/.test(key);
  });
};
var getTokenConfigurations = (tokenNames, extensionId) => {
  const configurations = [];
  tokenNames.forEach((token) => {
    const configuration = vscode2.workspace.getConfiguration(`${`${extensionId}.${token}`}`);
    const decorator = {
      backgroundColor: getHexWithAlpha(configuration.get("backgroundColor")),
      borderWidth: configuration.get("borderWidth"),
      borderStyle: configuration.get("borderStyle"),
      overviewRulerColor: getHexWithAlpha(configuration.get("overviewRulerColor")),
      overviewRulerLane: OVERVIEW_RULER_LANE_MAP[`${configuration.get("overviewRulerLane")}`],
      light: {
        borderColor: getHexWithAlpha(configuration.get("borderColor"))
      },
      dark: {
        borderColor: getHexWithAlpha(configuration.get("borderColor"))
      },
      rangeBehavior: DECORATION_RANGE_BEHAVIOR
    };
    const option = {
      isCaseSensitive: configuration.get("isCaseSensitive") ?? true,
      isMatchWholeWord: configuration.get("isMatchWholeWord") ?? false
    };
    configurations.push({ decorator, option });
  });
  return configurations;
};
var getHexWithAlpha = (hex) => {
  if (typeof hex === "string") {
    const base = hex.split(".");
    const color = base[0];
    const alpha = Number(base[1]);
    switch (true) {
      case Number.isNaN(alpha):
      case alpha > 100:
        return color + ALPHA_MAP[100];
      case alpha < 0:
        return color + ALPHA_MAP[0];
      default:
        return color + ALPHA_MAP[alpha];
    }
  }
};

// src/lib/disposables/commands.ts
var vscode4 = __toESM(require("vscode"));

// src/lib/commons.ts
var vscode3 = __toESM(require("vscode"));
var getActiveEditorURI = () => {
  if (vscode3.window.activeTextEditor == null) {
    return;
  }
  return vscode3.window.activeTextEditor.document.uri;
};
var getTextSelection = () => {
  const activeEditor = vscode3.window.activeTextEditor;
  if (activeEditor == null) {
    return;
  }
  const cursor = activeEditor.selection.start;
  const selection = activeEditor.selection.isEmpty ? activeEditor.document.getWordRangeAtPosition(cursor) : activeEditor.selection;
  if (selection == null) {
    return;
  }
  return activeEditor.document.getText(selection);
};
var getPositionAfter = (activeEditor, cachedEditor) => {
  const positions = cachedEditor.positions;
  return positions.find(
    (position) => position.isAfter(activeEditor.selection.start)
  ) ?? positions[0];
};
var getPositionBefore = (activeEditor, cachedEditor) => {
  const positions = cachedEditor.positions;
  const positionIndex = positions.findIndex(
    (position) => position.isAfterOrEqual(activeEditor.selection.start)
  );
  return positionIndex === -1 ? positions.slice(positionIndex)[0] : positions.slice(positionIndex - 1)[0];
};
var getPosition = (activeEditor, offset) => activeEditor.document.positionAt(offset);
var getRange = (activeEditor, flatRange) => new vscode3.Range(
  getPosition(activeEditor, flatRange.startOffset),
  getPosition(activeEditor, flatRange.endOffset)
);
var getRanges = (activeEditor, flatRanges) => flatRanges.map((flatRange) => getRange(activeEditor, flatRange));

// src/lib/patterns.ts
var getPhraseMatches = (activeEditor, options, phrase) => {
  phrase = options.isCaseSensitive === true ? phrase : phrase.toLowerCase();
  const documentText = options.isCaseSensitive === true ? activeEditor.document.getText() : activeEditor.document.getText().toLowerCase();
  const location = {
    flatRanges: [],
    lastOffset: 0
  };
  const textInFrontOfSelectedText = documentText.split(phrase).slice(0, -1);
  const locations = textInFrontOfSelectedText.reduce((loc, textInFront) => {
    const startOffset = loc.lastOffset + textInFront.length;
    const endOffset = startOffset + phrase.length;
    return {
      flatRanges: loc.flatRanges.concat({ startOffset, endOffset }),
      lastOffset: endOffset
    };
  }, location);
  return locations.flatRanges;
};

// src/lib/disposables/commands.ts
var addStyle = (activeEditor, token) => {
  const text = getTextSelection();
  if (text == null) {
    return;
  }
  const cachedRange = token.getCachedEditor(activeEditor)?.ranges ?? [];
  const ranges = [
    ...cachedRange,
    ...getRanges(activeEditor, getPhraseMatches(activeEditor, token.options, text))
  ];
  const positions = ranges.map((range) => range.start).sort((a, b) => activeEditor.document.offsetAt(a) - activeEditor.document.offsetAt(b));
  token.addCachedEditor(activeEditor, [], positions, ranges, text);
  activeEditor.setDecorations(token.decorator, ranges);
};
var setStyle = (activeEditor, token) => {
  const text = getTextSelection();
  if (text == null) {
    return;
  }
  const ranges = getRanges(activeEditor, getPhraseMatches(activeEditor, token.options, text));
  const positions = ranges.map((range) => range.start);
  token.setCachedEditor(activeEditor, [], positions, ranges, text);
  activeEditor.setDecorations(token.decorator, ranges);
};
var removeStyle = (activeEditor, token) => {
  token.removeCachedEditor(activeEditor);
  activeEditor.setDecorations(token.decorator, []);
};
var removeStyles = (activeEditor, tokens) => tokens.forEach((token) => removeStyle(activeEditor, token));
var findPreviousStyle = async (activeEditor, token) => {
  const cachedEditor = token.getCachedEditor(activeEditor);
  if (cachedEditor == null) {
    return;
  }
  await vscode4.commands.executeCommand(
    "editor.action.goToLocations",
    getActiveEditorURI(),
    getPositionBefore(activeEditor, cachedEditor),
    [],
    "goto"
  );
};
var findNextStyle = async (activeEditor, token) => {
  const cachedEditor = token.getCachedEditor(activeEditor);
  if (cachedEditor == null) {
    return;
  }
  await vscode4.commands.executeCommand(
    "editor.action.goToLocations",
    getActiveEditorURI(),
    getPositionAfter(activeEditor, cachedEditor),
    [],
    "goto"
  );
};

// src/lib/disposables/listeners.ts
var refreshStyleCached = (activeEditor, token) => {
  const ranges = token.getCachedEditor(activeEditor)?.ranges;
  if (ranges == null) {
    return;
  }
  activeEditor.setDecorations(token.decorator, ranges);
};
var refreshStyleActive = (activeEditor, token) => {
  const texts = token.getCachedEditor(activeEditor)?.texts;
  if (texts == null) {
    return;
  }
  const flatRanges = [];
  texts.forEach((text) => {
    flatRanges.push(...getPhraseMatches(activeEditor, token.options, text));
  });
  const ranges = getRanges(activeEditor, flatRanges);
  const offsets = flatRanges.map((range) => range.startOffset).sort((a, b) => a - b);
  const positions = offsets.map((offset) => activeEditor.document.positionAt(offset));
  token.addCachedEditor(activeEditor, offsets, positions, ranges, "");
  activeEditor.setDecorations(token.decorator, ranges);
};

// src/lib/token.ts
var Token = class {
  constructor(decorator, options) {
    this.decorator = decorator;
    this.options = options;
  }
  getCachedEditor(activeEditor) {
    return this.paths?.[activeEditor.document.uri.path];
  }
  setCachedEditor(activeEditor, offsets, positions, ranges, text) {
    const path = activeEditor.document.uri.path;
    this.paths = {
      ...this.paths,
      [path]: {
        offsets,
        positions,
        ranges,
        texts: [text]
      }
    };
  }
  addCachedEditor(activeEditor, offsets, positions, ranges, text) {
    const path = activeEditor.document.uri.path;
    if (this.paths?.[path] != null) {
      this.paths[path].offsets = Array.isArray(offsets) ? this.paths[path].offsets : offsets;
      this.paths[path].positions = positions;
      this.paths[path].ranges = ranges;
      this.paths[path].texts = text === "" ? this.paths[path].texts : this.paths[path].texts.concat(text);
    } else {
      this.setCachedEditor(activeEditor, offsets, positions, ranges, text);
    }
  }
  removeCachedEditor(activeEditor) {
    const path = activeEditor.document.uri.path;
    if (this.paths?.[path] != null) {
      delete this.paths[path];
    }
  }
};

// src/registration.ts
var registration = (extensionId) => {
  const vscodeTokens = getTokens(extensionId);
  const tokens = [];
  const disposables = [];
  for (const [key, value] of Object.entries(vscodeTokens)) {
    const token = new Token(
      vscode5.window.createTextEditorDecorationType(value.decorator),
      value.option
    );
    tokens.push(token);
    disposables.push(...getListenerDisposables(token));
    disposables.push(...getCommandDisposables(extensionId, token, key));
  }
  disposables.push(...getGlobalDisposables(extensionId, tokens));
  return disposables;
};
var getGlobalDisposables = (extensionId, tokens) => {
  const functions = [
    removeStyles
  ];
  const disposables = [];
  functions.forEach((fn) => {
    disposables.push(
      vscode5.commands.registerCommand(`${extensionId}.${fn.name}`, () => {
        const activeEditor = vscode5.window.activeTextEditor;
        if (activeEditor != null) {
          fn(activeEditor, tokens);
        }
      })
    );
  });
  return disposables;
};
var getListenerDisposables = (token) => {
  const disposables = [];
  disposables.push(vscode5.window.onDidChangeVisibleTextEditors(() => {
    const activeEditor = vscode5.window.activeTextEditor;
    if (activeEditor != null) {
      refreshStyleCached(activeEditor, token);
    }
  }));
  disposables.push(vscode5.workspace.onDidChangeTextDocument(() => {
    const activeEditor = vscode5.window.activeTextEditor;
    if (activeEditor != null) {
      refreshStyleActive(activeEditor, token);
    }
  }));
  return disposables;
};
var getCommandDisposables = (extensionId, token, tokenName) => {
  const functions = [
    addStyle,
    setStyle,
    removeStyle,
    findPreviousStyle,
    findNextStyle
  ];
  const disposables = [];
  functions.forEach((fn) => {
    disposables.push(
      vscode5.commands.registerCommand(`${extensionId}.${tokenName}.${fn.name}`, () => {
        const activeEditor = vscode5.window.activeTextEditor;
        if (activeEditor != null) {
          fn(activeEditor, token);
        }
      })
    );
  });
  return disposables;
};

// src/extension.ts
function activate(context) {
  context.subscriptions.push(...registration(EXTENSION_ID));
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=main.js.map

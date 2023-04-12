import * as vscode from 'vscode';

import {
  ALPHA_MAP,
  DECORATION_RANGE_BEHAVIOR,
  OVERVIEW_RULER_LANE_MAP,
} from './lib/constants';
import {
  Decorator,
  TokenOptions,
} from './lib/models';

/**
 * Main functions to gather Token configurations
 */
export const getTokens = (
  extensionId: string,
): { [key: string]: { decorator: Decorator, option: TokenOptions } } => {
  const tokenNames = getTokenNames(extensionId);
  const tokenOptions = getTokenConfigurations(tokenNames, extensionId);
  return tokenNames.reduce((accumulator, tokenName, index) => {
    return { ...accumulator, [tokenName]: tokenOptions[index] };
  }, {});
};

const getTokenNames = (
  extensionId: string,
): string[] => {
  return Object
    .keys(vscode.workspace.getConfiguration(extensionId))
    .filter((key) => {
      return /^token\d$/.test(key);
    });
};

const getTokenConfigurations = (
  tokenNames: string[],
  extensionId: string,
): { decorator: Decorator, option: TokenOptions }[] => {
  const configurations: { decorator: Decorator, option: TokenOptions }[] = [];
  tokenNames.forEach((token) => {
    const configuration = vscode.workspace.getConfiguration(`${`${extensionId}.${token}`}`);
    const decorator: Decorator = {
      backgroundColor: getHexWithAlpha(configuration.get('backgroundColor')),
      borderWidth: configuration.get('borderWidth'),
      borderStyle: configuration.get('borderStyle'),
      overviewRulerColor: getHexWithAlpha(configuration.get('overviewRulerColor')),
      overviewRulerLane: OVERVIEW_RULER_LANE_MAP[`${configuration.get('overviewRulerLane')}`],
      light: {
        borderColor: getHexWithAlpha(configuration.get('borderColor')),
      },
      dark: {
        borderColor: getHexWithAlpha(configuration.get('borderColor')),
      },
      rangeBehavior: DECORATION_RANGE_BEHAVIOR,
    };
    const option: TokenOptions = {
      isCaseSensitive: configuration.get('isCaseSensitive') ?? true,
      isMatchWholeWord: configuration.get('isMatchWholeWord') ?? false,
    };
    configurations.push({ decorator, option });
  });
  return configurations;
};

const getHexWithAlpha = (
  hex: unknown,
): string | undefined => {
  if (typeof (hex) === 'string') {
    const base = hex.split('.');
    const color = base[0];
    const alpha = Number(base[1]);

    switch (true) {
      case (Number.isNaN(alpha)):
      case (alpha > 100):
        return color + ALPHA_MAP[100];
      case (alpha < 0):
        return color + ALPHA_MAP[0];
      default:
        return color + ALPHA_MAP[alpha];
    }
  }
};

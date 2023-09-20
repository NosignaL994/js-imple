/**
 * ts-loader for ts-node with esmodule and tsconfig-paths
 * https://stackoverflow.com/questions/71571684/ts-node-with-tsconfig-paths-wont-work-when-using-esm
 */

import {
  resolve as resolveTs,
  getFormat,
  transformSource,
  load,
} from "ts-node/esm";
import * as tsConfigPaths from "tsconfig-paths";

export { getFormat, transformSource };

const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig();
const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths);

export function resolve(specifier, context, defaultResolver) {
  const mappedSpecifier = matchPath(specifier);
  if (mappedSpecifier) {
    specifier = mappedSpecifier;
  }
  if (!/\.ts$/.test(specifier)) specifier += ".ts";
  return resolveTs(specifier, context, defaultResolver);
}

export { load };

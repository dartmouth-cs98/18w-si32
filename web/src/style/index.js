import colors from "./colors";
import constants from "./constants";

import _ from "lodash";

// helper styles to be able to use directly instead of
// constantly wrapping a color and a font size
const colorStyles = {};
const fontStyles = {};

console.log(colors)
_.each(Object.keys(colors), c => {
  colorStyles[c] = { color: colors[c] };
});

_.each(Object.keys(constants.fontSizes), size => {
  fontStyles[size] = { fontSize: constants.fontSizes[size] };
});

// helper styles for font weights
fontStyles.bold = { fontWeight: 500 };
fontStyles.regular = { fontWeight: 400 };
fontStyles.light = { fontWeight: 300 };
fontStyles.bodyText = { lineHeight: 1.6 };

export {
  colors,
  constants,
  colorStyles,
  fontStyles,
};

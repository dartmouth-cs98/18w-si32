// Favicon webpack config courtesy of Olivier Gonzalez
// https://medium.com/tech-angels-publications/bundle-your-favicons-with-webpack-b69d834b2f53
const faviconsContext = require.context(                 // eslint-disable-line
  "!!file-loader?name=assets/favicon/[name].[ext]!.",
  true,
  /\.(svg|png|ico|xml|json)$/
);
faviconsContext.keys().forEach(faviconsContext);

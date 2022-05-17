// const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix problem with relative imports outside of `src`
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) =>
          constructor && constructor.name === "ModuleScopePlugin"
      );
      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

      // Fix imports with .mjs files in node_modules
      webpackConfig.module.rules = [
        ...webpackConfig.module.rules,
        {
          test: /\.m?jsx?$/,
          resolve: {
            fullySpecified: false,
          },
        },
      ];

      // Ignore warnings for source maps in node_modules deps
      webpackConfig.ignoreWarnings = [
        (warning) => {
          return (
            warning.module &&
            warning.module.resource.includes("node_modules") &&
            warning.details &&
            warning.details.includes("source-map-loader")
          );
        },
      ];

      return webpackConfig;
    },
  },
};

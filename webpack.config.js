var path = require("path");
const nodeExternals = require("webpack-node-externals");
module.exports = {
  entry: "./src/app.ts",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      { test: /\.ts$/, use: "ts-loader" },
      {
        test: /\.handlebars$/,
        use: "handlebars-loader",
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  resolve: {
    extensions: [".ts", ".js", ".handlebars"],
  },
  externals: [nodeExternals()],
  target: "node",
};

const Bundler = require("parcel-bundler");
const path = require("path");

// Parcel.js - Entry Point (i.e. file, directory, pattern)
const entry = path.resolve(__dirname, "../src/index.js");

// Parcel.js - Browser Production Options
const options = {
  outDir: path.resolve(__dirname, "../dist"),
  outFile: path.resolve(__dirname, "../dist/index.browser.min.js"),
  minify: true,
  target: "browser",
  bundleNodeModules: true,
  global: "carrot"
};

// Parcel.js - Bundle Source Code for Node
const bundler = new Bundler(entry, options);
const bundle = bundler.bundle();

// Closes process when build ends
bundler.on("buildEnd", () => process.exit());

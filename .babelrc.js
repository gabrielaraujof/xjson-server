const modules = process.env.MODULES === "esm" ? false : "auto";

module.exports = {
  presets: [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
        modules,
        exclude: ["proposal-dynamic-import"]
      },
    ],
  ]
};

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/src/"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  // debugging configuration options
  verbose: true,
};

const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
    '\\.(css|scss|less)$': 'identity-obj-proxy',
  },
};
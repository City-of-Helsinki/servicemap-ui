import react from '@vitejs/plugin-react'
import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
} from "vitest/config";

export default defineConfig({
  envPrefix: 'REACT_APP_',
  plugins: [
    react({
      include: "**/*.{jsx,tsx,js,ts}",
      babel: {
        plugins: [
          ["@babel/plugin-transform-react-jsx", { "runtime": "automatic" }]
        ]
      }
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    reporters: ['verbose'],
    coverage: {
      reporter: ['clover', 'json', 'lcov', 'text'],
      include: ['src/**/*'],
      provider: 'istanbul',
      exclude: [...coverageConfigDefaults.exclude, './src/setupTests.js'],
    },
    exclude: [...configDefaults.exclude, 'e2e'],
    testTimeout: 1000000,
    alias: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|less)$": "identity-obj-proxy",
      "isomorphic-style-loader/withStyles": "<rootDir>/__mocks__/withStyles.js"
    }
  },
});

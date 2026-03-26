// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      "import/no-named-as-default-member": "off",
    },
  },
  {
    ignores: [
      'dist/*',
      // Legacy Expo template folders (we use src/ with Feature-Sliced Architecture)
      'app/**',
      'components/**',
      'constants/**',
      'hooks/**',
      'entities/**',
      'features/**',
      'pages/**',
      'shared/**',
    ],
  },
]);

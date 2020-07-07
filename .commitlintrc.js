const {sync: globSync} = require('glob');

const packages = globSync('./packages/*/package.json').map(
  fn => require(fn).name
);

module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    // Cheatsheet: https://commitlint.js.org/#/reference-rules
    // Sweet Jesus why is disabling a rule syntax so verbose??
    'scope-enum': [2, 'always', packages],
    'header-max-length': [0, 'never', Infinity],
  },
};

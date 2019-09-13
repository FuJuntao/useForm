module.exports = {
  '*.js?(x)': ['eslint --fix', 'git add'],
  '*.{json,css,scss,md}': ['prettier --write', 'git add'],
};

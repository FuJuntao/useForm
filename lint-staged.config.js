module.exports = {
  '*.{j,t}s?(x)': ['eslint --fix', 'git add'],
  '*.{json,css,scss,md}': ['prettier --write', 'git add'],
};

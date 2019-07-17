module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { browsers: 'defaults' },
        modules: false,
      },
    ],
    ['@babel/preset-react'],
    ['@babel/preset-typescript'],
  ],
};

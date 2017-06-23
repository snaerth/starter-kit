if (process.env.NODE_ENV !== 'production') {
  require('babel-core/register')({
    presets: ['es2015', 'react'],
  });
  require.extensions['.scss'] = () => {};
  require.extensions['.css'] = () => {};
  require('./devServer');
} else {
  require('./server');
}

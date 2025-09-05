const path = require('path');

module.exports = {
  // ...
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'), // @ pointe vers le dossier /
    },
  },
};

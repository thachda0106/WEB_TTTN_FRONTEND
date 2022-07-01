/* config-overrides.js */ // file config đè cấu hình webpack của create-react-app
const { override, useBabelRc } = require('customize-cra');
module.exports = override(
  useBabelRc()
);

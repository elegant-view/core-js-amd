define(function (require, exports, module) {var core = require('../../modules/_core');
module.exports = core.JSON || (core.JSON = {stringify: JSON.stringify});
});

define(function (require, exports, module) {// for a legacy code and future fixes
module.exports = function(){
  return Function.call.apply(Array.prototype.push, arguments);
};
});

define(function (require, exports, module) {module.exports = function(done, value){
  return {value: value, done: !!done};
};
});

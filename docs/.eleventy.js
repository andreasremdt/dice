module.exports = function (config) {
  config.addPassthroughCopy('img');
  config.addPassthroughCopy('css');
  config.addPassthroughCopy('js');
};

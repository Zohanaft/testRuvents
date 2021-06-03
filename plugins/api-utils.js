export default String.prototype.includesStart = function (substring) {
  for (let i = 0; i < substring.length; i++) {
    if (substring[i] !== this[i]) return false;
  }
  return true;
}

module.exports = async () => {
  window.HTMLFormElement.prototype.requestSubmit = jest.fn();
};

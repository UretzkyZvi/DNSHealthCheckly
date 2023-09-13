// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import ResizeObserver from 'resize-observer-polyfill';

global.ResizeObserver = ResizeObserver;

window.HTMLFormElement.prototype.requestSubmit = () => {};
module.exports = {
    globalSetup: './jest.global-setup.js',
  };
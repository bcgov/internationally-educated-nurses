import '@testing-library/jest-dom';

// Polyfill for axios 1.7.0 compatibility with jsdom
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

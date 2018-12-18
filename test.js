// not much to do here until we have headless browser
// testing set up, but let's at least confirm the CommonJS
// exports work and match the ESM exports

const assert = require('assert')

const { Accordion, MultiAccordion } = require('./dist/index.js')

assert(typeof Accordion === 'function')
assert(typeof Accordion.mount === 'function')
assert(Accordion.name === 'Accordion')
assert(Accordion.mount.name === 'mount')

assert(typeof MultiAccordion === 'function')
assert(typeof MultiAccordion.mount === 'function')
assert(MultiAccordion.name === 'MultiAccordion')
assert(MultiAccordion.mount.name === 'mount')

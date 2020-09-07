//common.js
const events = require('events');
const em = new events.EventEmitter();
module.exports.commonEmitter = em;
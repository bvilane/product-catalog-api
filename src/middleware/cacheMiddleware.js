const apicache = require('apicache');

// Initialize cache
const cache = apicache.middleware;

// Set up different cache durations
const shortCache = cache('2 minutes');
const mediumCache = cache('10 minutes');
const longCache = cache('1 hour');

module.exports = { shortCache, mediumCache, longCache };
"use strict";

const request = require('superagent');
const log4js = require('log4js');

const MAPPIFY_BASE_URL = "https://mappify.io/api/rpc/";

module.exports = () => {

    let module = {};

    // Default Config values
    let config = {
        logLevel: 'ERROR',
        token: null
    };

    let logger = log4js.getLogger();
    logger.setLevel(config.setLevel);

    // Configure
    module.configure = (configObject) => {
        logger.error('Not Implemented');
    };

    // Autocomplete
    module.autocomplete = (addressSearchString, done) => {

        const AUTOCOMPLETE_PATH = "address/autocomplete/";

        done(new Error("Not Implemented"));
    };


    // Classify Coordinates
    module.classifyCoordinates = (encoding, lat, long, radius, done) => {

        const CLASSIFY_PATH = "coordinates/classify/";

        done(new Error("Not Implemented"));
    };


    // Geocode
    module.geocode = (streetAddress, postCode, suburb, state, done) => {

        const GEOCODE_PATH = "address/geocode/";

        done(new Error("Not Implemented"));
    };


    // Reverse Geocode
    module.reverseGeocode = (lat, long, radius, done) => {

        const AUTOCOMPLETE_PATH = "coordinates/reversegeocode/";

        done(new Error("Not Implemented"));
    };


    return module;
};

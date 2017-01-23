"use strict";

const request = require('superagent');
const log4js = require('log4js');

const MAPPIFY_BASE_URL = "https://mappify.io/api/rpc/";

module.exports = () => {

    let module = {};

    // Default Config values
    let config = {
        logLevel: 'OFF',
        autocompleteBoostPrefix: true
    };

    let logger = log4js.getLogger();
    logger.setLevel(config.logLevel);

    // Configure
    module.configure = (configObject) => {

        let newConfig = {};


        // Set Log level
        if(configObject.logLevel) {
            if(["ALL", "TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL", "OFF"].includes(configObject.logLevel)) {
                newConfig.logLevel = configObject.logLevel;
                logger.setLevel(newConfig.logLevel);
            } else {
                logger.warn("Unrecognised Log Level. Log level won't be changed.");
                newConfig.logLevel = config.logLevel;
            }
        } else {
            logger.trace("No log level provided with config. Log level won't be changed.");
            newConfig.logLevel = config.logLevel;
        }
        logger.trace(`Mappify Log level is ${newConfig.logLevel}`);


        // Set API Token
        if(configObject.apiKey) {
            if(typeof configObject.apiKey === "string") {
                newConfig.apiKey = configObject.apiKey;
                logger.trace(`Mappify API key is ${newConfig.apiKey}`);
            } else {
                logger.warn("Only strings are supported for API key. Key not set.");
            }
        }


        // Set Autocomplete Boost Prefix behaviour
        if(configObject.hasOwnProperty("autocompleteBoostPrefix")) {
            if(typeof configObject.autocompleteBoostPrefix === "boolean") {
                newConfig.autocompleteBoostPrefix = configObject.autocompleteBoostPrefix;
            } else {
                logger.warning("Mappify autocompleteBoostPrefix must be a boolean value. BoostPrefix behaviour won't be changed");
                newConfig.autocompleteBoostPrefix = config.autocompleteBoostPrefix;
            }
        } else {
            logger.trace("No Mappify autocompleteBoostPrefix value provided. BoostPrefix behaviour won't be changed");
            newConfig.autocompleteBoostPrefix = config.autocompleteBoostPrefix;
        }
        logger.trace(`Mappify Autocomplete BoostPrefix is ${newConfig.autocompleteBoostPrefix ? "enabled" : "disabled" }`);


        config = newConfig;

    };


    // Autocomplete
    module.autocomplete = (addressSearchString, done) => {

        const AUTOCOMPLETE_PATH = MAPPIFY_BASE_URL + "address/autocomplete/";

        let postBody = {
            streetAddress: addressSearchString,
            boostPrefix: config.autocompleteBoostPrefix,
            apiKey: config.apiKey
        };

        request
            .post(AUTOCOMPLETE_PATH)
            .send(postBody)
            .end((err, res) => {
                if(err) {
                    logger.error(`Unable to retrieve Mappify autocomplete suggestions for '${addressSearchString}'`);
                    logger.error(err.message);
                    return done(err);
                }

                done(null, res.body);
            });
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

        const REVERSE_GEOCODE_PATH = "coordinates/reversegeocode/";

        done(new Error("Not Implemented"));
    };


    return module;
};

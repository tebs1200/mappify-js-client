"use strict";

// Dependencies
const request = require('superagent');
const log4js = require('log4js');

// URLs
const MAPPIFY_BASE_URL = "https://mappify.io/api/rpc/";
const AUTOCOMPLETE_URL = MAPPIFY_BASE_URL + "address/autocomplete/";
const CLASSIFY_URL = MAPPIFY_BASE_URL + "coordinates/classify/";
const GEOCODE_URL = MAPPIFY_BASE_URL + "address/geocode/";
const REVERSE_GEOCODE_URL = MAPPIFY_BASE_URL + "coordinates/reversegeocode/";


module.exports = () => {

    let module = {};

    // Default Configuration
    let config = {
        logLevel: "OFF",
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

        if(typeof addressSearchString !== "string") {
            done(new TypeError("Parameter 'addressSearchString' wasn't a string value"));
        }

        let postBody = {
            streetAddress: addressSearchString,
            boostPrefix: config.autocompleteBoostPrefix,
            apiKey: config.apiKey
        };

        request
            .post(AUTOCOMPLETE_URL)
            .send(postBody)
            .end((err, res) => {
                if(err) {
                    logger.error(`Unable to retrieve Mappify autocomplete suggestions for '${addressSearchString}'`);
                    logger.error(err.message);
                    return done(err);
                }

                logger.trace(`Mappify returned ${res.body.result.length} autocomplete matches for '${addressSearchString}'`);
                done(null, res.body);
            });
    };


    // Classify Coordinates
    module.classifyCoordinates = (encoding, lat, long, radius, done) => {


        done(new Error("Not Implemented"));
    };


    // Geocode
    module.geocode = (streetAddress, postCode, suburb, state, done) => {


        done(new Error("Not Implemented"));
    };


    // Reverse Geocode
    module.reverseGeocode = (lat, long, radius, done) => {


        done(new Error("Not Implemented"));
    };


    return module;
};

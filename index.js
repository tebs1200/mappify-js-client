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


module.exports = (function() {

    let mappify = {};

    // Default Configuration
    let config = {
        logLevel: "OFF",
        autocompleteBoostPrefix: true
    };

    let logger = log4js.getLogger();
    logger.setLevel(config.logLevel);

    // Configure
    mappify.configure = function(configObject) {

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
    mappify.autocomplete = function(addressSearchString, done) {

        if(typeof addressSearchString !== "string") {
            logger.error("Value provided to autocomplete wasn't a string");
            return done(new TypeError("Provided search value wasn't a string"));
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
    mappify.classifyCoordinates = function(encoding, lat, long, radius, done) {

        if(!["LGA", "POA", "SA1", "SA2", "SA3", "SA4"].includes(encoding)) {
            logger.error(`Invalid encodig value '${encoding}'`);
            done(new Error("Invalid encoding value"));
        }
        if((typeof lat !== "number") || (lat < -90 || lat > 90)) {
            logger.error(`Invalid lat value '${lat}'. Numeric value between -90 and 90 expected.`);
            done(new Error("Invalid lat value"));
        }
        if((typeof long !== "number") || (long < 0 || long > 180)) {
            logger.error(`Invalid long value '${lat}'. Numeric value between 0 and 180 expected.`);
            done(new Error("Invalid long value"));
        }
        if((typeof radius !== "number") || radius < 0) {
            logger.error(`Invalid radius value '${lat}'. Positive numeric value expected.`);
            done(new Error("Invalid radius value"));
        }

        let postBody = {
            encoding: encoding,
            lat: lat,
            long: long,
            radius: radius,
            apiKey: config.apiKey
        };

        request
            .post(CLASSIFY_URL)
            .send(postBody)
            .end((err, res) => {
                if(err) {
                    logger.error("Unable to retrieve Mappify area classification for coordinates");
                    logger.error(err.message);
                    return done(err);
                }

                logger.trace("Mappify returned an area classification");
                done(null, res.body);
            });
    };


    // Geocode
    mappify.geocode = function(streetAddress, postCode, suburb, state, done) {

        if(typeof streetAddress !== "string") {
            logger.error("Parameter 'streetAddress' wasn't a string value");
            done(new TypeError("Parameter 'streetAddress' wasn't a string value"));
        }
        if(postcode && (typeof postCode !== "string")) {
            logger.error("Parameter 'postCode' wasn't a string value");
            done(new TypeError("Parameter 'postCode' wasn't a string value"));
        }
        if(suburb && (typeof suburb !== "string")) {
            logger.error("Parameter 'suburb' wasn't a string value");
            done(new TypeError("Parameter 'suburb' wasn't a string value"));
        }
        if(state && (typeof state !== "string")) {
            logger.error("Parameter 'state' wasn't a string value");
            done(new TypeError("Parameter 'state' wasn't a string value"));
        }
        if(state && !["ACT", "NSW", "VIC", "QLD", "TAS", "SA", "WA", "NT"].includes(state)) {
            logger.error(`Invalid state value '${state}'`);
            done(new Error("Invalid state value"));
        }

        let postBody = {
            streetAddress: streetAddress,
            postCode: postCode,
            suburb: suburb,
            state: state,
            apiKey: config.apiKey
        };

        request
            .post(GEOCODE_URL)
            .send(postBody)
            .end((err, res) => {
                if(err) {
                    logger.error("Unable to retrieve Mappify geocode location");
                    logger.error(err.message);
                    return done(err);
                }

                logger.trace("Mappify returned a street address record.");
                done(null, res.body);
            });
    };


    // Reverse Geocode
    mappify.reverseGeocode = function(lat, long, radius, done) {


        done(new Error("Not Implemented"));
    };


    return mappify;
})();

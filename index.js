"use strict";

// Dependencies
const request = require('superagent');

// URLs
const MAPPIFY_BASE_URL = "https://mappify.io/api/rpc/";
const AUTOCOMPLETE_URL = MAPPIFY_BASE_URL + "address/autocomplete/";
const CLASSIFY_URL = MAPPIFY_BASE_URL + "coordinates/classify/";
const GEOCODE_URL = MAPPIFY_BASE_URL + "address/geocode/";
const REVERSE_GEOCODE_URL = MAPPIFY_BASE_URL + "coordinates/reversegeocode/";
const DRIVING_DIRECTIONS_URL = MAPPIFY_BASE_URL + "trip/directions/";
const DRIVING_STATISTICS_URL = MAPPIFY_BASE_URL + "trip/driveStats/";


module.exports.getClient = function(apiKey) {

    let mappify = {};

    let config = {};
    if(apiKey && typeof apiKey === "string") {
        config.apiKey = apiKey;
    }


    /* *** Geocoding *** */

    mappify.autocomplete = function(addressSearchString, options, done) {

        // Options are optional
        if(arguments.length == 2 && (typeof arguments[1]) === "function") {
            options = null;
            done = arguments[1];
        }

        if(typeof addressSearchString !== "string") {
            return done(new TypeError("Provided search value wasn't a string"));
        }
        if(addressSearchString === "") {
            return done(new TypeError("Provided search string was empty"));
        }


        let postBody = {
            streetAddress: addressSearchString,
            apiKey: config.apiKey
        };
        if(options && (typeof options.boostPrefix) === 'boolean') {
            postBody.boostPrefix = options.boostPrefix;
        }

        request
            .post(AUTOCOMPLETE_URL)
            .send(postBody)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                done(null, res.body);
            });
    };


    mappify.classifyCoordinates = function(encoding, lat, long, radius, done) {

        // radius is optional
        if(arguments.length == 4 && (typeof arguments[3]) === "function") {
            radius = null;
            done = arguments[3];
        }

        if(!encoding || !["LGA", "POA", "SA1", "SA2", "SA3", "SA4"].includes(encoding)) {
            return done(new Error("Invalid encoding value"));
        }

        if(typeof lat !== "number") {
            return done(new Error("Invalid latitude value"));
        }
        if(lat < -90 || lat > 90) {
            return done(new Error("Latitude is out of range"));
        }

        if(typeof long !== "number") {
            return done(new Error("Invalid longitude value"));
        }
        if(long < -180 || long > 180) {
            return done(new Error("Longitude is out of range"));
        }

        if(radius !== null && (typeof radius !== "number")) {
            return done(new Error("Invalid radius value"));
        }
        if((typeof radius === "number") && radius < 0) {
            return done(new Error("Radius is out of range"));
        }

        let postBody = {
            encoding: encoding,
            lat: lat,
            lon: long,
            radius: radius,
            apiKey: config.apiKey
        };

        request
            .post(CLASSIFY_URL)
            .send(postBody)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                done(null, res.body);
            });
    };


    mappify.geocode = function(streetAddress, postCode, suburb, state, done) {

        if(typeof streetAddress !== "string") {
            return done(new TypeError("Provided street address value wasn't a string"));
        }
        if(streetAddress === "") {
            return done(new TypeError("Provided street address string was empty"));
        }
        if(postCode && (typeof postCode !== "string")) {
            return done(new TypeError("Provided postcode wasn't a string"));
        }
        if(suburb && (typeof suburb !== "string")) {
            return done(new TypeError("Provided suburb wasn't a string"));
        }
        if(state && (typeof state !== "string")) {
            return done(new TypeError("Provided state wasn't a string"));
        }
        if(state && !["ACT", "NSW", "VIC", "QLD", "TAS", "SA", "WA", "NT"].includes(state)) {
            return done(new Error("Provided state wasn't a valid state code"));
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
                    return done(err);
                }

                done(null, res.body);
            });
    };


    mappify.reverseGeocode = function(lat, long, radius, done) {

        // radius is optional
        if(arguments.length == 3 && (typeof arguments[2]) === "function") {
            radius = null;
            done = arguments[2];
        }

        if(typeof lat !== "number") {
            return done(new Error("Latitude wasn't a number"));
        }
        if(lat < -90 || lat > 90) {
            return done(new Error("Latitude is out of range"));
        }

        if(typeof long !== "number") {
            return done(new Error("Longitude wasn't a number"));
        }
        if(long < -180 || long > 180) {
            return done(new Error("Longitude is out of range"));
        }

        if(radius !== null && (typeof radius !== "number")) {
            return done(new Error("Radius wasn't a number"));
        }
        if((typeof radius === "number") && radius < 0) {
            return done(new Error("Radius is out of range"));
        }

        let postBody = {
            lat: lat,
            lon: long,
            radius: radius,
            apiKey: config.apiKey
        };

        request
            .post(REVERSE_GEOCODE_URL)
            .send(postBody)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                done(null, res.body);
            });
    };


    /* *** Routing *** */

    mappify.drivingDirections = function(origin, destination, options, done) {
        routingRequest(DRIVING_DIRECTIONS_URL, origin, destination, options, done);
    };


    mappify.drivingStatistics = function(origin, destination, options, done) {
        routingRequest(DRIVING_STATISTICS_URL, origin, destination, options, done);
    };



    return mappify;



    /* *** Helper functions *** */

    function validatePointObject(point) {

        let validationResults = {};

        if(point === null || typeof point !== "object") {
            validationResults.error = new Error("Not a valid object");
        }
        else if((typeof point.lat) !== "number") {
            validationResults.error = new Error("'lat' is missing");
        }
        else if((typeof point.lon) !== "number") {
            validationResults.error = new Error("'lon' is missing");
        }
        else if(point.lat < -90 || point.lat > 90) {
            validationResults.error = new Error("Latitude is out of range");
        }
        else if(point.lon < -180 || point.lon > 180) {
            validationResults.error = new Error("Longitude is out of range");
        }
        else {
            validationResults.validPoint = {
                lat: point.lat,
                lon: point.lon
            }
        }

        return validationResults;
    }

    function routingRequest(url, origin, destination, options, done) {

        // Options are optional
        if((typeof arguments[4]) === "undefined" && (typeof arguments[3]) === "function") {
            options = null;
            done = arguments[3];
        }

        let originValidationResults = validatePointObject(origin);
        if(originValidationResults.error) {
            return done(new Error(`Origin isn't a valid point. ${originValidationResults.error.message}.`));
        }

        let destinationValidationResults = validatePointObject(destination);
        if(destinationValidationResults.error) {
            return done(new Error(`Destination isn't a valid point. ${destinationValidationResults.error.message}.`));
        }

        if(typeof options !== "object") {
            return done(new Error("Options isn't an object"));
        }

        let postBody = {
            origin: originValidationResults.validPoint,
            destination: destinationValidationResults.validPoint,
            apiKey: config.apiKey
        };
        if(options) {
            let validOptions = {};

            if(options.prioritiseMinimumDistance) {
                validOptions.prioritiseMinimumDistance = true;
            }
            if(options.ignoreDirectionality) {
                validOptions.ignoreDirectionality = true;
            }

            postBody.options = validOptions || null;
        }

        request
            .post(url)
            .send(postBody)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                done(null, res.body);
            });

    };
};

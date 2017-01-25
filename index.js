"use strict";

// Dependencies
const request = require('superagent');

// URLs
const MAPPIFY_BASE_URL = "https://mappify.io/api/rpc/";
const AUTOCOMPLETE_URL = MAPPIFY_BASE_URL + "address/autocomplete/";
const CLASSIFY_URL = MAPPIFY_BASE_URL + "coordinates/classify/";
const GEOCODE_URL = MAPPIFY_BASE_URL + "address/geocode/";
const REVERSE_GEOCODE_URL = MAPPIFY_BASE_URL + "coordinates/reversegeocode/";


module.exports.getClient = function(apiKey) {

    let mappify = {};

    // Initial Configuration
    let config = {
        autocompleteBoostPrefix: true
    };
    if(apiKey && typeof apiKey === "string") {
        config.apiKey = apiKey;
    }


    // Autocomplete
    mappify.autocomplete = function(addressSearchString, done) {

        if(typeof addressSearchString !== "string") {
            return done(new TypeError("Provided search value wasn't a string"));
        }
        if(addressSearchString === "") {
            return done(new TypeError("Provided search string was empty"));
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
                    return done(err);
                }

                done(null, res.body);
            });
    };


    // Classify Coordinates
    mappify.classifyCoordinates = function(encoding, lat, long, radius, done) {

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


    // Geocode
    mappify.geocode = function(streetAddress, postCode, suburb, state, done) {

        if(typeof streetAddress !== "string") {
            return done(new TypeError("Provided street address value wasn't a string"));
        }
        if(streetAddress === "") {
            return done(new TypeError("Provided street address string was empty"));
        }
        if(postCode && (typeof postCode !== "string")) {
            return done(new TypeError("Parameter 'postCode' wasn't a string value"));
        }
        if(suburb && (typeof suburb !== "string")) {
            return done(new TypeError("Parameter 'suburb' wasn't a string value"));
        }
        if(state && (typeof state !== "string")) {
            return done(new TypeError("Parameter 'state' wasn't a string value"));
        }
        if(state && !["ACT", "NSW", "VIC", "QLD", "TAS", "SA", "WA", "NT"].includes(state)) {
            return done(new Error("Invalid state value"));
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


    // Reverse Geocode
    mappify.reverseGeocode = function(lat, long, radius, done) {
        done(new Error("Not Implemented"));
    };


    return mappify;
};

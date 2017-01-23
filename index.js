"use strict";

const request = require('superagent');

const MAPPIFY_BASE_URL = "https://mappify.io/api/rpc/";

module.exports = function() {

    let module = {};

    // Autocomplete
    module.autocomplete = function(addressSearchString, done) {

        const AUTOCOMPLETE_PATH = "address/autocomplete/";

        done(new Error("Not Implemented"));
    };


    // Classify Coordinates
    module.classifyCoordinates = function(encoding, lat, long, radius, done) {

        const AUTOCOMPLETE_PATH = "coordinates/classify/";

        done(new Error("Not Implemented"));
    };


    // Geocode
    module.geocode = function(streetAddress, postCode, suburb, state, done) {

        const AUTOCOMPLETE_PATH = "address/geocode/";

        done(new Error("Not Implemented"));
    };


    // Reverse Geocode
    module.reverseGeocode = function(lat, long, radius, done) {

        const AUTOCOMPLETE_PATH = "coordinates/reversegeocode/";

        done(new Error("Not Implemented"));
    };


    return module;

};

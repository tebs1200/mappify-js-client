"use strict";

const mappify = require("../index.js").getClient();
const expect = require("chai").expect;

describe("geocode", () => {

    it("should exist", () => {
        expect(mappify.geocode).to.exist;
    });

    it("should return with error if the first argument isn't a string", (done) => {
        mappify.geocode({}, "6000", "Perth", "WA", (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Provided street address value wasn't a string");
            done();
        });
    });

    it("should return with error if the first argument is an empty string", (done) => {
        mappify.geocode("", "6000", "Perth", "WA", (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Provided street address string was empty");
            done();
        });
    });

    
});

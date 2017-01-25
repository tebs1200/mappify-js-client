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

    it("should return with error if the second argument is present but not a string", (done) => {
        mappify.geocode("16 St Georges Terrace", 6000, "Perth", "WA", (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Provided postcode wasn't a string");
            done();
        });
    });

    it("should return with error if the third argument is present but not a string", (done) => {
        mappify.geocode("16 St Georges Terrace", "6000", {suburb: "Perth"}, "WA", (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Provided suburb wasn't a string");
            done();
        });
    });

    it("should return with error if the fourth argument is present but not a valid state code", (done) => {
        mappify.geocode("16 St Georges Terrace", "6000", "Perth", "Western Australia", (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Provided state wasn't a valid state code");
            done();
        });
    });

    it("should return a response object for a valid address", (done) => {
        mappify.geocode("16 St Georges Terrace", "6000", "Perth", "WA", (err, res) => {
            expect(err).not.to.exist;
            expect(res).to.exist;
            expect(res.type).to.equal("streetAddressRecord");
            done();
        });
    });

});

"use strict";

const mappify = require("../index.js").getClient();
const expect = require("chai").expect;

describe("reverseGeocode", () => {

    it("should exist", () => {
        expect(mappify.reverseGeocode).to.exist;
    });

    it("should return with error if the first argument isn't a number", (done) => {
        mappify.reverseGeocode("abc", 153.027, null, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Latidude wasn't a number");
            done();
        });
    });

    it("should return with error if the latitude value is out of range", (done) => {
        mappify.reverseGeocode(200, 153.027, null, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Latitude is out of range");
            done();
        });
    });

    it("should return with error if the second argument isn't a number", (done) => {
        mappify.reverseGeocode(-27.471, "xyz", null, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Longitude wasn't a number");
            done();
        });
    });

    it("should return with error if the longitude value is out of range", (done) => {
        mappify.reverseGeocode(-27.471, 300, null, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Longitude is out of range");
            done();
        });
    });

    it("should return with error if the third argument is provided but isn't a number", (done) => {
        mappify.reverseGeocode(-27.471, 153.027, "cheese", (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Radius wasn't a number");
            done();
        });
    });

    it("should return with error if the radius value is out of range", (done) => {
        mappify.reverseGeocode(-27.471, 153.027, -10, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Radius is out of range");
            done();
        });
    });

    it.skip("should return a response object for a valid encoding and coordinates", (done) => {
        mappify.reverseGeocode(-27.471, 153.027, null, (err, res) => {
            expect(err).not.to.exist;
            expect(res).to.exist;
            expect(res.type).to.equal("streetAddressRecord");
            done();
        });
    });

});

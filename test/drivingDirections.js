"use strict";

const mappify = require("../index.js").getClient();
const expect = require("chai").expect;

describe("drivingDirections", () => {

    it("should exist", () => {
        expect(mappify.drivingDirections).to.exist;
    });

    it("should return with error if the first argument isn't a point object", (done) => {
        mappify.drivingDirections("wrong", {lat: -12.4668, lon: 130.8426}, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Origin isn't a valid point. Not a valid object.");
            done();
        });
    });

    it("should return with error if the second argument isn't a point object", (done) => {
        mappify.drivingDirections({lat: -12.4317, lon: 130.8449}, {invalid: "object"}, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Destination isn't a valid point. 'lat' is missing.");
            done();
        });
    });

    it("should return with error if a point's latitude is out of range", (done) => {
        mappify.drivingDirections({lat: -120.4317, lon: 130.8449}, {lat: -12.4668, lon: 130.8426}, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Origin isn't a valid point. Latitude is out of range.");
            done();
        });
    });

    it("should return with error if a point's longitude is out of range", (done) => {
        mappify.drivingDirections({lat: -12.4317, lon: 230.8449}, {lat: -12.4668, lon: 130.8426}, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Origin isn't a valid point. Longitude is out of range.");
            done();
        });
    });

    it("should return with error if the third argument is present but not an object", (done) => {
        mappify.drivingDirections({lat: -12.4317, lon: 130.8449}, {lat: -12.4668, lon: 130.8426}, "string", (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Options isn't an object");
            done();
        });
    });

    it("should return a response object for a valid origin and destination", (done) => {
        mappify.drivingDirections({lat: -12.4317, lon: 130.8449}, {lat: -12.4668, lon: 130.8426}, (err, res) => {
            expect(err).not.to.exist;
            expect(res).to.exist;
            expect(res.type).to.equal("driveDirections");
            done();
        });
    });

    it("should allow toggling of 'prioritiseMinimumDistance' and 'ingnoreDirectionality' via an options object", (done) => {
        mappify.drivingDirections({lat: -12.4317, lon: 130.8449}, {lat: -12.4668, lon: 130.8426}, {prioritiseMinimumDistance: true, ignoreDirectionality: true}, (err, res) => {
            expect(err).not.to.exist;
            expect(res).to.exist;
            expect(res.type).to.equal("driveDirections");
            done();
        });
    });

});

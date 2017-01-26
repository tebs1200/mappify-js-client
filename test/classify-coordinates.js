"use strict";

const mappify = require("../index.js").getClient();
const expect = require("chai").expect;

describe("classifyCoordinates", () => {

    it("should exist", () => {
        expect(mappify.classifyCoordinates).to.exist;
    });

    it("should return with error if the first argument isn't a string", (done) => {
        mappify.classifyCoordinates({}, -27.471, 153.027, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Invalid encoding value");
            done();
        });
    });

    it("should return with error if the encoding value isn't a valid option", (done) => {
        mappify.classifyCoordinates("XYZ", -27.471, 153.027, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Invalid encoding value");
            done();
        });
    });

    it("should return with error if the second argument isn't a number", (done) => {
        mappify.classifyCoordinates("LGA", "abc", 153.027, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Invalid latitude value");
            done();
        });
    });

    it("should return with error if the latitude value is out of range", (done) => {
        mappify.classifyCoordinates("LGA", 200, 153.027, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Latitude is out of range");
            done();
        });
    });

    it("should return with error if the third argument isn't a number", (done) => {
        mappify.classifyCoordinates("LGA", -27.471, "xyz", (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Invalid longitude value");
            done();
        });
    });

    it("should return with error if the longitude value is out of range", (done) => {
        mappify.classifyCoordinates("LGA", -27.471, 300, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Longitude is out of range");
            done();
        });
    });

    it("should return with error if the fourth argument is provided but isn't a number", (done) => {
        mappify.classifyCoordinates("LGA", -27.471, 153.027, "cheese", (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Invalid radius value");
            done();
        });
    });

    it("should return with error if the radius value is out of range", (done) => {
        mappify.classifyCoordinates("LGA", -27.471, 153.027, -10, (err) => {
            expect(err).to.exist;
            expect(err.message).to.equal("Radius is out of range");
            done();
        });
    });

    it("should return a response object for a valid encoding and coordinates", (done) => {
        mappify.classifyCoordinates("LGA", -27.471, 153.027, (err, res) => {
            expect(err).not.to.exist;
            expect(res).to.exist;
            expect(res.type).to.equal("areaClassification");
            done();
        });
    });

    it("should return a response object when a valid radius is provided", (done) => {
        mappify.classifyCoordinates("LGA", -27.471, 153.027, 500, (err, res) => {
            expect(err).not.to.exist;
            expect(res).to.exist;
            expect(res.type).to.equal("areaClassification");
            done();
        });
    });

});

"use strict";

const mappify = require("../index.js").getClient();
const expect = require("chai").expect;

describe("reverseGeocode", () => {

    it("should exist", () => {
        expect(mappify.reverseGeocode).to.exist;
    });

});

"use strict";

const mappify = require("../index.js").getClient();
const expect = require("chai").expect;

describe("classifyCoordinates", () => {

    it("should exist", () => {
        expect(mappify.classifyCoordinates).to.exist;
    });

});

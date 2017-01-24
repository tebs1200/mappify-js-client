"use strict";

const Mappify = require("../index.js");
const expect = require("chai").expect;

const mappify = Mappify.getClient();

describe("classifyCoordinates", () => {

    it("should exist", () => {
        expect(mappify.classifyCoordinates).to.exist;
    });

});

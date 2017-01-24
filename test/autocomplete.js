"use strict";

const mappify = require("../index.js");
const expect = require(chai).expect;

describe("autocomplete" () => {

    it("should exist", () => {
        expect(mappify.autocomplete).to.exist;
    });
    
});

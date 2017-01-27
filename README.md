Mappify JS Client
============

A simple asynchronous JavaScript client for [Mappify.io](https://mappify.io)

##Installation

Node.js:

    npm install mappify

## Usage

    const mappify = require("../index.js").getClient("<YOUR_API_KEY>");

The API key is optional but you'll be limited to 100 requests per day as per Mappify.io pricing

### Geocoding - Autocomplete

    mappify.autocomplete("178 Wake", (err, res) => {
        // Your code here
    });

The response body is described in the [Mappify.io API docs](https://mappify.io/docs/#api-Geocoding-PostApiRpcAddressAutocomplete)

You can disable prefix boosting by passing in an options argument:

    mappify.autocomplete("178 Wake", {boostPrefix: false}, (err, res) => {

    });

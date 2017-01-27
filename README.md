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

### Geocoding - Classify Coordinates

    mappify.classifyCoordinates("LGA", -27.471, 153.027, (err, res) => {
        // Your code here
    });

The first argument is the encoding. Valid encoding values and the response structure described in the [Mappify.io API docs](https://mappify.io/docs/#api-Geocoding-PostApiRpcCoordinatesClassify)

You can pass in a radius as the 4th argument:

    mappify.classifyCoordinates("LGA", -27.471, 153.027, 500, (err, res) => {

    });

### Geocoding - Geocode

    mappify.geocode("16 St Georges Terrace", "6000", "Perth", "WA", (err, res) => {
        // Your code here
    });

Only the first argument (street address) is required, but pass in `null` or an empty string for arguments you don't use. Response structure described in the [Mappify.io API docs](https://mappify.io/docs/#api-Geocoding-PostApiRpcAddressGeocode)

### Geocoding - Reverse Geocode

    mappify.reverseGeocode(-27.471, 153.027, (err, res) => {
        // Your code here
    });

The response body is described in the [Mappify.io API docs](https://mappify.io/docs/#api-Geocoding-PostApiRpcCoordinatesReversegeocode)

You can pass in a radius as the 3rd argument:

    mappify.reverseGeocode(-27.471, 153.027, 500, (err, res) => {

    });

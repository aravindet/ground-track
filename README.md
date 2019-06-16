# Ground Track

Moves an antenna to track amateur satellites.

This was built at a workshop, is grossly buggy and incomplete, and is not intended for any sort of production use. As far as I know, it works only with one particular antenna built by [Roland Turner](https://github.com/rolandturner).

# Features

- Detects the current location using geolocation APIs
- Shows satellites that will transit the current location in the next hour
- Generates and sends commands to make the antenna track a chosen satellite

This app performs all calculations in the browser and sends commands to the antenna via a small node WebSockets -> TCP proxy server. It uses orbital parameters from [celestrak](http://www.celestrak.com) and the [jspredict](https://github.com/nsat/jspredict) library for calculations.

# Usage

To run the proxy server, `node proxy.js`. You may need to edit the antenna's host and port in the code first. It runs on `localhost:8080`.

To run the client in development mode, `npm start` and access it at `localhost:3000`. If you aren't developing the client, you may also build the client using `npm run build` and the proxy server will serve it.

To update satellite data, copy http://www.celestrak.com/NORAD/elements/amateur.txt to `scripts/` and run `node scripts/convert.js`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

##### Note

Due to bundling difficulties, JSPredict and dependencies are loaded as separate script tags than as part of the webpack build.

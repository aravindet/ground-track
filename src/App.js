/* global jspredict */

import React, { useState, useEffect } from 'react';
import './App.css';
import tles from './data/tles.json';

const HOUR = 60 * 60 * 1000;
const socket = new WebSocket('ws://localhost:8080');

function App () {
  const [qth, setQth] = useState(null);
  const [transits, setTransits] = useState([]);
  const [tracking, setTracking] = useState(null);

  if (!qth) {
    navigator.geolocation.watchPosition(
      ({ coords: { latitude, longitude, altitude } }) => {
        altitude = altitude ? altitude / 1000 : 0;
        if (qth && latitude === qth[0] && longitude === qth[1]) return;

        setQth([ latitude, longitude, altitude ]);
      }
    );
  }

  useEffect(() => {
    const allTransits = [];

    if (!qth) return;

    for (const name in tles) {
      const tle = tles[name];
      const start = Date.now();
      const end = start + 1 * HOUR;
      const transit = jspredict.transits(tle, qth, start, end, 10, 1)[0];
      if (!transit) continue;
      transit.name = name;
      allTransits.push(transit);
    }

    setTransits(allTransits.sort((a, b) => a.start - b.start));
  }, [qth]);

  function startTracking({ name, tle }) {
    console.log('Start tracking', name);
    setInterval(() => {
      const { azimuth, elevation } = jspredict.observe(tle, qth);
      socket.send(`P ${azimuth.toFixed(1)} ${elevation.toFixed(1)}`);
      console.log(`P ${azimuth.toFixed(1)} ${elevation.toFixed(1)}`);
    }, 1000);
  }

  const rtf = new Intl.RelativeTimeFormat('en');

  return (
    <div className="App">
      {transits.map(({ name, start, end }) => (
        <div className='Transit' key={name}>
          <div className='name'>{name}</div>
          <div className='time'>{rtf.format((start - Date.now()) / 1000, 'seconds')}</div>
          <div className='time'>{new Date(start).toLocaleString()}</div>
          <div className='time'>{new Date(end).toLocaleString()}</div>
          <button onClick={() => {
            startTracking({ name, tle: tles[name] });
          }}>Track</button>
        </div>
      ))}
    </div>
  );
}

export default App;

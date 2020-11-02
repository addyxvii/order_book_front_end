import React, { useEffect, useState } from 'react';
import openSocket from 'socket.io-client';
import './App.css';

const ENDPOINT = "http://localhost:8000";
const socket = openSocket(ENDPOINT);

function App() {

  // put bittrex state here
  const [bittrexState, setBittrexState] = useState()

  // open up connection to your socket API here
  useEffect(() => {
    console.log("APP LOADED")
    socket.emit('fetchBittrexData', { optionalPayload: null }, (error: any) => {
      console.log('request sent to API to fetch bittrex data')
    });
  },);

  // listen for responses from your socket API here and update state in react
  useEffect(() => {

    socket.on('recieveBittrexData', (bittrexData: any) => {
      console.log('Got response from api for bittrex data')

      // set bittrex state here
      setBittrexState(bittrexData)
    });

  }, []);

  return (
    <div className="App">
      <h1>Order Book </h1>
    </div>
  );
}

export default App;

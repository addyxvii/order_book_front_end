import React, { EffectCallback, useEffect, useState } from 'react';
import openSocket from 'socket.io-client';
import './App.css';

const ENDPOINT = "http://localhost:8000";
const socket = openSocket(process.env.REACT_APP_API as any);

function App() {

  // put bittrex state here
  const [bittrexState, setBittrexState] = useState<any>(undefined)
  const [poloniexState, setPoloniexState] = useState(undefined)

  // get poloniex
  useEffect(() => {
    socket.emit('fetchPolinexData', {}, (error: any) => {
      console.log("yooooo")
    });
  }, []);

  // recieve poloniex data
  useEffect(() => {
    socket.on('recievePoloniexData', (poloniexData: any) => {
      // set bittrex state here
      if (poloniexState === undefined) {
        console.log('got poloniex')
        setPoloniexState(poloniexData)
      } 
    }); 
    return () => socket.disconnect() as any;
  }, []);
  
  // open up connection to your socket API here
  useEffect(() => {
    socket.emit('fetchBittrexData', { optionalPayload: null }, (error: any) => {
      console.log('request sent to API to fetch bittrex data')
    });
  },[]);

  // listen for responses from your socket API here and update state in react
  useEffect(() => {
    socket.on('recieveBittrexData', (bittrexData: any) => {
      console.log(bittrexData)
      setBittrexState(bittrexData)
      
    });
    return () => socket.disconnect() as any;
  }, []);

  return (
    <div className="App">
      <h1>Order Book </h1>
      {
        bittrexState ? "yay data" : 'nodataa'
      }
            {
        poloniexState ? "yay poloniex data" : 'no poloniex dataa'
      }
    </div>
  );
}

export default App;

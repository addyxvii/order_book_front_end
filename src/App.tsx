import React, { EffectCallback, useEffect, useState } from 'react';
import openSocket from 'socket.io-client';
import './App.css';

import  Book  from './Book';

const ENDPOINT = "http://localhost:8000";
const socket = openSocket(ENDPOINT);

function App() {

  // put bittrex state here
  const [bittrexState, setBittrexState] = useState<any>({})
  const [poloniexState, setPoloniexState] = useState(undefined)

  let poloniexPrice = "SANITY CHECK"
  console.log(poloniexPrice)

  useEffect(() => {
    socket.emit('fetchPolinexData', (error: any) => {
      console.warn(error)
    });
  }, []);

  // recieve poloniex data
  useEffect(() => {
    socket.on('recievePoloniexData', (poloniexData: any) => {
      // set bittrex state here
      if (poloniexState === undefined) {
        // poloniexPrice.push(poloniexData.poloniexData.price);
        // console.log('got poloniex')
        setPoloniexState(poloniexData.poloniexData.price)
      } 
    }); 
    return () => socket.disconnect() as any;
  }, []);
  
  useEffect(() => {
    socket.emit('fetchBittrexData', (error: any) => {
      console.warn(error)
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
      <Book title="Ask" rate={poloniexState}/>
      <Book title="Bid"/> 
      {
        bittrexState ? "yay DAta" : 'nodataa'
      }
            {
        poloniexState ? "yay poloniex data" : 'no poloniex dataa'
      }
      </div>
  );
}

export default App;

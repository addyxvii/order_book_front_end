import React, { EffectCallback, useEffect, useState } from 'react';
import openSocket from 'socket.io-client';
import './App.css';

import  Book  from './Book';

const ENDPOINT = "http://localhost:8000";
const socket = openSocket(ENDPOINT);

function App() {

  // put bittrex state here
  const[exchangeState, setExchangeState] = useState<any>("")
  const [bittrexState, setBittrexState] = useState<any>({})
  const [rateState, setRateState] = useState(undefined)
  const [volumeState, setVolumeState] = useState(undefined)

  useEffect(() => {
    socket.emit('fetchPolinexData', (error: any) => {
      console.warn(error)
    });
  }, []);

  // recieve poloniex data
  useEffect(() => {
    socket.on('recievePoloniexData', (poloniexData: any) => {
      // set bittrex state here
        // poloniexPrice.push(poloniexData.poloniexData.price);
        // console.log('got poloniex')
        setExchangeState("poloniex");
        setRateState(poloniexData.poloniexData.price)
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
      let bittrexAsks = bittrexData.asks;
      // let amount = bittrexData.asks.Quantity;
      console.log(bittrexAsks);
      setExchangeState("Bittrex");
      setBittrexState(bittrexData)
      if(bittrexAsks){
        setRateState(bittrexAsks.Rate);
        setVolumeState(bittrexAsks.Quantity); 
      }
      
    });
    return () => socket.disconnect() as any;
  }, []);

  return (
    <div className="App">
      <h1>Order Book </h1>
      <Book title="Ask" exchange={exchangeState} rate={rateState} amount={volumeState}/>
      <Book title="Bid"/> 
      </div>
  );
}

export default App;

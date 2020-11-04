import React, { EffectCallback, useEffect, useState } from 'react';
import openSocket from 'socket.io-client';
import './App.css';

import  Book  from './Book';

const ENDPOINT = "http://localhost:8000";
const socket = openSocket(ENDPOINT);

function App() {

  // put bittrex state here
  const[askExchangeState, setAskExchangeState] = useState<any>("")
  const [askRateState, setAskRateState] = useState(undefined)
  const [askVolumeState, setAskVolumeState] = useState(undefined)

  const[bidExchangeState, setBidExchangeState] = useState<any>("")
  const [bidRateState, setBidRateState] = useState(undefined)
  const [bidVolumeState, setBidVolumeState] = useState(undefined)


  useEffect(() => {
    socket.emit('fetchPolinexData', (error: any) => {
      console.warn(error)
    });
  }, []);

  // recieve poloniex data
  useEffect(() => {
    socket.on('recievePoloniexData', (poloniexData: any) => {
      console.log(poloniexData.poloniexData.size)
      if(poloniexData.poloniexData.type === 'ask'){
        let poloniexAsksPrice = poloniexData.poloniexData.price;
        let poloniexAskVolume = poloniexData.poloniexData.size;
        setAskExchangeState("Poloniex");
        setAskRateState(poloniexAsksPrice);
        setAskVolumeState(poloniexAskVolume);

      } else {
        let poloniexBids = poloniexData.poloniexData.type;
        setBidExchangeState("Poloniex");
        setBidRateState(poloniexBids);
      }
    }); 
    return () => socket.disconnect() as any;
  }, []);
  
  useEffect(() => {
    socket.emit('fetchBittrexData', (error: any) => {
      console.warn(error)
    });
  },[]);

  useEffect(() => {
    socket.on('recieveBittrexData', (bittrexData: any) => {
      let bittrexAsks = bittrexData.asks;
      let bittrexBids = bittrexData.bids;

      setAskExchangeState("Bittrex");
      if(bittrexAsks){
        setAskRateState(bittrexAsks.Rate);
        setAskVolumeState(bittrexAsks.Quantity); 
      }

      if(bittrexBids){
        setBidRateState(bittrexBids.Rate);
        setBidVolumeState(bittrexBids.Quantity); 
        setBidExchangeState("Bittrex");
      }
      
    });
    return () => socket.disconnect() as any;
  }, []);

  return (
    <div className="App">
      <h1>Order Book </h1>
      <Book title="Ask" exchange={askExchangeState} rate={askRateState} amount={askVolumeState}/>
      <Book title="Bid" exchange={bidExchangeState} rate={bidRateState} amount={bidVolumeState}/> 
      </div>
  );
}

export default App;

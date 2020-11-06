import React, { EffectCallback, useEffect, useState } from 'react';
import openSocket from 'socket.io-client';
import './App.css';
import './Book.css';

import Book from './Book';
import { JsxEmit } from 'typescript';
import { Chart } from './Chart';

const ENDPOINT = "http://localhost:8000";
const socket = openSocket(ENDPOINT);

export interface Exchange {
  exchange: string
  ask: string
  volume: string
}

const App: React.FC<{}> = (): JSX.Element => {

  const [poloniexState, setPoloniexState] = useState<Exchange[]>([{ 
    exchange: "", 
    ask: "", 
    volume: "" 
  }]);

  useEffect(() => {
    socket.emit('fetchPolinexData', (error: any) => {
      console.warn(error)
    });
  }, []);

  let [data, setData] = useState<Exchange[]>([])

  useEffect(() => {

    socket.on('recievePoloniexData', (poloniexData: any) => {

      if (poloniexData.poloniexData.type === 'ask') {

        let poloniexAsksObj: Exchange = {
          exchange: 'Poloniex',
          ask: poloniexData.poloniexData.price,
          volume: poloniexData.poloniexData.size,
        };

        if (data.length < 10) {
          setData([...data, poloniexAsksObj])
        } else {
          socket.disconnect()
        }
        
      }
    });
  });

  return (
    <div className="App">
      <h1>Order Book </h1>
      <Chart data={data} />
      <Book
        title="Ask"
        data={data}
      />
      <Book
        title="Bid"
        data={data}
      />

    </div>
  );
}

export default App;


/**
if(poloniexAskTable.length < 9) {
  setPoloniexState(poloniexAskTable)
} else if(poloniexState.length > 9) {
  setPoloniexState(poloniexState.slice(0, poloniexState.length -5))
}
*/

/**
 useEffect(() => {
    socket.emit('fetchBittrexData', (error: any) => {
      console.warn(error)
    });
  }, []);

  useEffect(() => {
    socket.on('recieveBittrexData', (bittrexData: any) => {
      let {
        bids: bittrexBids,
        asks: bittrexAsks
      } = bittrexData;

      // setAskExchangeState("Bittrex");
      if (bittrexAsks) {
        // setAskRateState(bittrexAsks.Rate);
        // setAskVolumeState(bittrexAsks.Quantity);
      }

      if (bittrexBids) {
        // setBidRateState(bittrexBids.Rate);
        // setBidVolumeState(bittrexBids.Quantity);
        // setBidExchangeState("Bittrex");
      }

    });
    return () => socket.disconnect() as any;
  }, []);
 */
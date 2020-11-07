import React, { useEffect, useState } from 'react';
import openSocket from 'socket.io-client';
import './App.css';
import './Book.css';

import Book from './Book';
import { Chart } from './Chart';

const ENDPOINT = "http://localhost:8000";
const socket = openSocket(ENDPOINT);

export interface Exchange {
  exchange: string
  ask?: string
  bid?: string
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

  let [askData, setAskData] = useState<Exchange[]>([])
  let [bidData, setBidData] = useState<Exchange[]>([])

  console.log('AAAAAHHHHHHHHHHH!!!!',askData);
  // console.log(bidData);


  useEffect(() => {
      socket.on('recievePoloniexData', (poloniexData: any) => {
        
        if (poloniexData.type === 'ask' && askData.length < 10) {
            delete poloniexData.type;
            setAskData([...askData, poloniexData])
          //  } else if(askData.length > 5) {
          //    askData.pop();
          //    setAskData(askData);
           }
        //   let poloniexAsksObj: Exchange = {
        //     exchange: 'Poloniex',
        //     ask: poloniexData.poloniexData.price,
        //     volume: poloniexData.poloniexData.size,
        //   };

        //   if (askData.length < 10) {
        //     setAskData([...askData, poloniexAsksObj])
        //   } else {
        //     askData.pop();
        //     setAskData(askData);
        //   }

        // } else {
        //   let poloniexBidObj: Exchange = {
        //     exchange: 'Poloniex',
        //     bid: poloniexData.poloniexData.price,
        //     volume: poloniexData.poloniexData.size,
        //   };

        //   if (bidData.length < 10) {
        //     setBidData([...bidData, poloniexBidObj])
        //   } else {
        //     bidData.pop();
        //     setBidData(bidData);
        //   }
        
      }); return () => {
        socket.off('recievePoloniexData')
      } 
  });

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

  return (
    <div className="App">
      <h1>Order Book </h1>
      <Chart data={askData} />
       <Book
        title="Ask"
        data={askData}
      />
      {/* <Book
        title="Bid"
        data={bidData}
      />  */}
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

 */
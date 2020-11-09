import React, { useEffect, useState } from 'react';
import openSocket from 'socket.io-client';
import './App.css';
import './Book.css';

import Book from './Book';
import { Chart } from './Chart';

require('dotenv').config()

const ENDPOINT: any = process.env.REACT_APP_API; 
const socket = openSocket(ENDPOINT, {transports: ['websocket']});

export interface Exchange {
  exchange: string 
  ask?: string
  bid?: string
  volume: string
}

const App: React.FC<{}> = (): JSX.Element => {


  useEffect(() => {
    socket.emit('fetchPolinexData', (error: any) => {
      console.warn(error)
    });
  }, []);

  useEffect(() => {
    socket.emit('fetchBittrexData', (error: any) => {
      console.warn(error)
    });
  }, []);

  const [asks, setAsksState] = useState<any>([])
  const [bids, setBidsState] = useState<any>([])


  const [poloniexAskData, setPoloniexAskData] = useState<Exchange[]>([])
  const [poloniexBidData, setPoloniexBidData] = useState<Exchange[]>([])

  const [bittrexAskData, setBittrexAskData] = useState<Exchange[]>([])
  const [bittrexBidData, setBittrexBidData] = useState<Exchange[]>([])

  useEffect(() => {
      socket.on('recievePoloniexData', (poloniexData: any) => {
        
        if (poloniexData.type === 'ask' && poloniexAskData.length < 10) {
            delete poloniexData.type;
            setPoloniexAskData([...poloniexAskData, poloniexData])
            setAsksState([...asks, poloniexData])
           } else if(poloniexAskData.length > 10) {
             poloniexAskData.pop();
             setPoloniexAskData(poloniexAskData);
           }

        if (poloniexData.type === 'bid' && poloniexBidData.length < 10) {
            delete poloniexData.type;
            setPoloniexBidData([...poloniexBidData, poloniexData])
            setBidsState([...bids, poloniexData])
          } else if(poloniexBidData.length > 10) {
              poloniexBidData.pop();
              setPoloniexBidData(poloniexBidData);
        }   
      }); return () => {
        socket.off('recievePoloniexData')
      } 
  });

  useEffect(() => {
    socket.on('recieveBittrexData', (bittrexData: any) => {
      
      if(bittrexData.asks && bittrexAskData.length < 10){
          delete bittrexData.asks.type;
          setBittrexAskData([...bittrexAskData, bittrexData.asks])
          setAsksState([...asks, bittrexData.asks])
        } else if(bittrexData.length > 10){
          bittrexData.pop();
          setBittrexAskData(bittrexAskData);
        }

      if(bittrexData.bids && bittrexBidData.length < 10){
          delete bittrexData.bids.type;
          setBittrexBidData([...bittrexBidData, bittrexData.bids])
          setBidsState([...bids, bittrexData.bids])
        } else if(bittrexData.length > 10){
          bittrexData.pop();
          setBittrexBidData(bittrexBidData);
        }

    }); return () => {
      socket.off('recieveBittrexData')
    }
  });
  
  return (
    <div className="App">
      <h1>Order Book </h1>
      <Chart data={asks} />
       <Book
        title="Ask"
        data={asks}
      />
      <Book
        title="Bid"
        data={bids}
      /> 
    </div>
  );
}
export default App;

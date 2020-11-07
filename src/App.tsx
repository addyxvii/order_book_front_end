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


  const [poloniexAskData, setPoloniexAskData] = useState<Exchange[]>([])
  const [poloniexBidData, setPoloniexBidData] = useState<Exchange[]>([])

  const [bittrexAskData, setBittrexAskData] = useState<Exchange[]>([])

  useEffect(() => {
      socket.on('recievePoloniexData', (poloniexData: any) => {
        
        if (poloniexData.type === 'ask' && poloniexAskData.length < 10) {
            delete poloniexData.type;
            setPoloniexAskData([...poloniexAskData, poloniexData])
           } else if(poloniexAskData.length > 10) {
             poloniexAskData.pop();
             setPoloniexAskData(poloniexAskData);
           }

        if (poloniexData.type === 'bid' && poloniexBidData.length < 10) {
            delete poloniexData.type;
            setPoloniexBidData([...poloniexBidData, poloniexData])
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
        console.log('INSIDEEEEEEEE',bittrexData.asks);
        setBittrexAskData([...bittrexAskData, bittrexData.asks] )
      } else if(bittrexData.length > 10){
        console.log("MORE THAN 10")
        bittrexData.pop();
        setBittrexAskData(bittrexAskData);
      }

      // if(bittrexData.bids && bittrexBidData.length < 10){
      //   delete bittrexData.type;
      //   setBittrexAskData([...bittrexAskData, bittrexData])
      // } else if(bittrexData.length > 10){
      //   bittrexData.pop();
      //   setBittrexAskData(bittrexAskData);
      // }


    });
  }, []);

  return (
    <div className="App">
      <h1>Order Book </h1>
      <Chart data={poloniexAskData} />
       <Book
        title="Ask"
        data={poloniexAskData}
      />
      <Book
        title="Bid"
        data={poloniexBidData}
      /> 
    </div>
  );
}

export default App;

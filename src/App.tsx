import React, { useEffect, useState } from 'react';
import openSocket from 'socket.io-client';
import { Book } from './Book';
import { Chart } from './Chart';

import './App.css';
import './Book.css';

const ENDPOINT = process.env.REACT_APP_API as string;
const socket = openSocket(ENDPOINT);

export interface Exchange {
  exchange: string
  ask?: string
  bid?: string
  volume: string
  type: unknown
}

const App: React.FC<{}> = (): JSX.Element => {

  useEffect(() => {
    socket.emit('fetchPolinexData', (error: string) => {
      console.warn(error)
    });
  }, []);

  useEffect(() => {
    socket.emit('fetchBittrexData', (error: string) => {
      console.warn(error)
    });
  }, []);

  const [asks, setAsksState] = useState<Exchange[]>([]);
  const [bids, setBidsState] = useState<Exchange[]>([]);

  const [poloniexAskData, setPoloniexAskData] = useState<Exchange[]>([]);
  const [poloniexBidData, setPoloniexBidData] = useState<Exchange[]>([]);

  const [bittrexAskData, setBittrexAskData] = useState<Exchange[]>([]);
  const [bittrexBidData, setBittrexBidData] = useState<Exchange[]>([]);

  useEffect(() => {
    socket.on('recievePoloniexData', (poloniexData: Exchange) => {

      if (poloniexData.type === 'ask' && poloniexAskData.length < 10) {
        let data = { ...poloniexData, type: undefined };
        setPoloniexAskData([...poloniexAskData, poloniexData]);
        setAsksState([...asks, data]);
      } else if (poloniexAskData.length > 10) {
        poloniexAskData.pop();
        setPoloniexAskData(poloniexAskData);
      }

      if (poloniexData.type === 'bid' && poloniexBidData.length < 10) {
        let data = { ...poloniexData, type: undefined };
        setPoloniexBidData([...poloniexBidData, poloniexData]);
        setBidsState([...bids, data]);
      } else if (poloniexBidData.length > 10) {
        poloniexBidData.pop();
        setPoloniexBidData(poloniexBidData);
      }
    }); return () => {
      socket.off('recievePoloniexData');
    }
  });

  useEffect(() => {
    socket.on('recieveBittrexData', (bittrexData: any) => {

      if (bittrexData.asks && bittrexAskData.length < 10) {
        let asks = { ...bittrexData.asks, type: undefined };
        setBittrexAskData([...bittrexAskData, bittrexData.asks])
        setAsksState([...asks, bittrexData.asks])
      } else if (bittrexData.length > 10) {
        bittrexData.pop();
        setBittrexAskData(bittrexAskData);
      }

      if (bittrexData.bids && bittrexBidData.length < 10) {
        let bids = { ...bittrexData.asks, type: undefined };
        setBittrexBidData([...bittrexBidData, bittrexData.bids])
        setBidsState([...bids, bittrexData.bids])
      } else if (bittrexData.length > 10) {
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

import React from 'react';
// import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import {ethers} from 'ethers'

const ConnectWallet = () => {
  const Base = {
    chainId: 8453,
    name: 'Base',
    currency: 'ETH',
    rpcUrl: process.env.NEXT_PUBLIC_TENDERLY_BASE_VIRTUAL_TESTNET
  };
    const [connected, setConnected] = React.useState(false);

    React.useEffect(() => {
        const checkConnection = async () => {
          if (window.ethereum) {
            try {
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const network = await provider.getNetwork();
              setConnected(network.chainId == Base.chainId);
            } catch (error) {
              console.error('Error checking connection:', error);
              setConnected(false);
            }
          } else {
            setConnected(false);
          }
        };
      
        checkConnection(); // Initial check
      
        const intervalId = setInterval(checkConnection, 3000); // Call checkConnection every 3 seconds
      
        return () => clearInterval(intervalId); // Cleanup function to clear the interval
      }, []);
  
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const network = await provider.getNetwork();
  
          if (network.chainId === Base.chainId) {
            setConnected(true);
          } else {
            // Add network if not present in wallet
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${Base.chainId.toString(16)}`,
                chainName: Base.name,
                nativeCurrency: {
                  name: Base.currency,
                  symbol: Base.currency,
                  decimals: 18,
                },
                rpcUrls: [Base.rpcUrl],
              }],
            });
          }
        } catch (error) {
          console.error('Error connecting wallet:', error);
        }
      } else {
      }
    };
    
    return(

            <button className={`connect-button ${connected ? 'connected' : ''}`} onClick={connectWallet}
                style={{ 
                    backgroundColor: 'violet',
                    border: 'none',
                    color: 'white',
                    padding: '10px 24px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontSize: '16px',
                    margin: '4px 2px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    transition: 'background-color 0.3s'
                }}
            >
                {connected ? 'Connected to Tenderly Base' : 'Connect Wallet'}
            </button>
    )

};

export default ConnectWallet;
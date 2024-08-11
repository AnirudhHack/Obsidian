export async function getConnectedWalletAddress() {
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.enable();
        
        // Get the connected wallet address
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
          // Return the first account address
          return accounts[0];
        } else {
          // No accounts connected
          console.error('No wallet accounts connected');
          return null;
        }
      } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error getting wallet address:', error);
        return null;
      }
    } else {
      // The browser does not have the Ethereum provider
      console.error('No Ethereum provider detected');
      return null;
    }
  }
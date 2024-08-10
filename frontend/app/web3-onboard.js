import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
// import infinityWalletModule from '@web3-onboard/infinity-wallet'
// import gnosisModule from '@web3-onboard/gnosis'
// import keepkeyModule from '@web3-onboard/keepkey'
// import keystoneModule from '@web3-onboard/keystone'
// import walletConnectModule from '@web3-onboard/walletconnect'
// import coinbaseModule from '@web3-onboard/coinbase'
// import magicModule from '@web3-onboard/magic'
// import dcentModule from '@web3-onboard/dcent'
// import sequenceModule from '@web3-onboard/sequence'
// import tahoModule from '@web3-onboard/taho'
// import trustModule from '@web3-onboard/trust'
// import frontierModule from '@web3-onboard/frontier'
import Onboard from '@web3-onboard/core'

const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY

const injected = injectedModule()
// const coinbase = coinbaseModule()
// const dcent = dcentModule()

const wcV2InitOptions = {
  /**
   * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
   */
  projectId: `${process.env.NEXT_PUBLIC_Project_ID}`,
  /**
   * Chains required to be supported by all wallets connecting to your DApp
   */
  requiredChains: [10, 42161, 8453],
  /**
   * Defaults to `appMetadata.explore` that is supplied to the web3-onboard init
   * Strongly recommended to provide atleast one URL as it is required by some wallets (i.e. MetaMask)
   * To connect with WalletConnect
   */
  dappUrl: 'http://localhost:3000/'
}

// const walletConnect = walletConnectModule(wcV2InitOptions)

// const infinityWallet = infinityWalletModule()
// const keystone = keystoneModule()
// const keepkey = keepkeyModule()
// const gnosis = gnosisModule()
// const sequence = sequenceModule()
// const taho = tahoModule() // Previously named Tally Ho wallet
// const trust = trustModule()
// const frontier = frontierModule()

// const magic = magicModule({
//   apiKey: 'apiKey'
// })

const wallets = [
//   infinityWallet,
//   keepkey,
//   sequence,
  injected,
//   trust,
//   frontier,
//   taho,
//   coinbase,
//   dcent,
//   walletConnect,
//   gnosis,
//   magic,
//   keystone
]

export const chains = [
  // {
  //   id: '0x1',
  //   token: 'ETH',
  //   label: 'Ethereum Mainnet',
  //   rpcUrl: `https://mainnet.infura.io/v3/${INFURA_KEY}`
  // },
  // {
  //   id: '0x5',
  //   token: 'ETH',
  //   label: 'Goerli',
  //   rpcUrl: `https://goerli.infura.io/v3/${INFURA_KEY}`
  // },
  // {
  //   id: '0x13881',
  //   token: 'MATIC',
  //   label: 'Polygon - Mumbai',
  //   rpcUrl: 'https://matic-mumbai.chainstacklabs.com'
  // },
  // {
  //   id: '0x38',
  //   token: 'BNB',
  //   label: 'Binance',
  //   rpcUrl: 'https://bsc-dataseed.binance.org/'
  // },
  {
    id: '0xA4B1',
    token: 'ARB-ETH',
    label: 'Arbitrum',
    rpcUrl: 'https://arb1.arbitrum.io/rpc'
  },
  {
    id: '0xA',
    token: 'OETH',
    label: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io'
  },
  {
    id: '0x2105',
    token: 'ETH',
    label: 'Base',
    rpcUrl: 'https://mainnet.base.org'
  }
]

const appMetadata = {
  name: 'Obsidian',
//   icon: '../../svg',
  description: 'Obsidian',
  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' },
    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
  ]
}

const web3Onboard = Onboard({
  theme: 'light',
  wallets,
  chains,
  appMetadata,
  accountCenter: {
    desktop: {
      enabled: true,
      position: 'bottomRight',
      hideTransactionProtectionBtn: true
    },
    mobile: {
      enabled: true,
      position: 'topRight',
      hideTransactionProtectionBtn: true
    }
  }
})

export { web3Onboard }
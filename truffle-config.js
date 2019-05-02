const HDWalletProvider = require("truffle-hdwallet-provider");

require('dotenv').config() 

module.exports = {
  networks: {
    // setting for local network
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" 
    },
    // Settings for Ropsten
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      network_id: 3,
      gas: 4600000,
      gasPrice: 20000000000
    },
    // Setting for Kovan
    kovan: {
     provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    },
    // main ethereum network(mainnet)
    main: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      network_id: 1,
      gas: 3000000,
      gasPrice: 10000000000
    }
  }
}
require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks:{
    sepolia:{
      url:'https://eth-sepolia.g.alchemy.com/v2/pkTwd0YO9obPSI1Dn3wwO2pyOUfluOUI',
      accounts:['8e899fc17b02cc368fb97bbe18ef902431d9f71e8732084e72b81461deee9c3f'],

    }
  }
};

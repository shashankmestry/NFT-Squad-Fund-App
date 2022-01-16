require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
class MetaMaskService {

    networks = {
        '0x1': 'Mainnet',
        '0x3': 'Ropsten',
        '0x4': 'Rinkeby',
        '0x5': 'Goerli',
        '0x2a': 'Kovan'
    };

    async connectWallet() {
        if (window.ethereum) {
            try {
                const addressArray = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const chainId = await  window.ethereum.request({ method: 'eth_chainId' });
                return {
                    address: addressArray[0],
                    network: this.networks[chainId],
                    status: "CONNECTED"
                }
            } catch (err) {
                return {
                    address: "",
                    network: "",
                    status: "UNKNOWN_ERROR"
                }
            }
        } else {
            return {
                address: "",
                network: "",
                status: "NO_METAMASK"
            }
        }
    }

    async getCurrentWalletConnect() {
        if (window.ethereum) {
            try {
                const addressArray = await window.ethereum.request({
                    method: "eth_accounts",
                });
                if (addressArray.length > 0) {
                    const chainId = await  window.ethereum.request({ method: 'eth_chainId' });
                    return {
                        address: addressArray[0],
                        network: this.networks[chainId],
                        status: "CONNECTED"
                    }
                } else {
                    return {
                        address: "",
                        network: "",
                        status: "NOT_CONNECTED"
                    }
                }
            } catch (err) {
                return {
                    address: "",
                    network: "",
                    status: "UNKNOWN_ERROR"
                }
            }
    
        } else {
            return {
                address: "",
                network: "",
                status: "NO_METAMASK"
            }
        }
    }

    async getEthBalance(address) {
        const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [address, 'latest'],
        });
        return web3.utils.fromWei(balance);
    }
}

export default new MetaMaskService();
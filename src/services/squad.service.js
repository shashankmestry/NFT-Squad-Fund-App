require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractSquadActionABI = require("../abis/squad-actions-abi.json");
export const actionContractAddress = "0xA2294Ce83B81E86Ee765e3d9470B09dE69A6480d";
export const squadActionsContract = new web3.eth.Contract(
    contractSquadActionABI, actionContractAddress
);

const contractSquadFactoryABI = require("../abis/squad-factory-abi.json");
export const factoryContractAddress = "0xf84d637126365A42124092Ea1Cb55dE85Df054DE";
export const squadFactoryContract = new web3.eth.Contract(
    contractSquadFactoryABI, factoryContractAddress
);

const contractSquadABI = require("../abis/squad-abi.json");

class SquadService {
    getFromWei(amount) {
        return web3.utils.fromWei(amount);
    }

    getSquadContract(squadAddress) {
        return new web3.eth.Contract(
            contractSquadABI,
            squadAddress
        );
    }

    async createSquad(address, name, tokenSymbol, target, minInvestment, maxInvestment, tokenTotalSupply, passKey) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to create SPAD.",
                code: 403
            };
        }
      
        const transactionParameters = {
            to: factoryContractAddress,
            from: address,
            data: squadFactoryContract.methods.createSPAD(name, "", tokenSymbol, web3.utils.toWei(tokenTotalSupply, 'ether'), web3.utils.toWei(target, 'ether'),  web3.utils.toWei(minInvestment, 'ether'), web3.utils.toWei(maxInvestment, 'ether'), passKey).encodeABI(),
        };
      
        try {
            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [transactionParameters],
            });
      
            return {
                status: txHash,
                code: 200
            }
      
        } catch (error) {
            return {
                status: "😥 " + error.message,
                code: 403
            };
        }
    }
}

export default new SquadService();
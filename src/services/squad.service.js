require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractSquadActionABI = require("../abis/squad-actions-abi.json");
export const actionContractAddress = "0xc577CA979B3893D1b28FF8e7cbAB158f72f1595d";
export const squadActionsContract = new web3.eth.Contract(
    contractSquadActionABI, actionContractAddress
);

const contractSquadFactoryABI = require("../abis/squad-factory-abi.json");
export const factoryContractAddress = "0xA0c35A7f74f54023e853755834Eb036a1E71BAF1";
export const squadFactoryContract = new web3.eth.Contract(
    contractSquadFactoryABI, factoryContractAddress
);

const contractSquadABI = require("../abis/squad-abi.json");
const contractsquadERC20ABI = require("../abis/squad-erc20-abi.json");

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

    async getSquadAddresses() {
        // const squadCount = await squadFactoryContract.methods.getSquadCount().call();
        // console.log(squadCount);
        // return [];
        const squadCount = 2;
        var squadAddresses = [];
        var squadAddress;
        for (var i = (parseInt(squadCount) - 1); i >= 0; i--) {
            squadAddress = await squadFactoryContract.methods.squads(i).call();
            // squadAddresses.push(squadAddress);
        }
        return squadAddresses;
    }

    async createSquad(address, collectionAddress, target, name, purpose, fundSymbol, subFundCode, minInvestment, maxInvestment, tokenTotalSupply) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to create SPAD.",
                code: 403
            };
        }
      
        const transactionParameters = {
            to: factoryContractAddress,
            from: address,
            data: squadFactoryContract.methods.createSquad(collectionAddress, web3.utils.toWei(target, 'ether'), name, purpose, fundSymbol, subFundCode, web3.utils.toWei(tokenTotalSupply, 'ether'),   web3.utils.toWei(minInvestment, 'ether'), web3.utils.toWei(maxInvestment, 'ether')).encodeABI(),
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

    async getSquadDetails(squadAddress) {
        const squadContract = this.getSquadContract(squadAddress);
        const squadDetails = {};
        squadDetails.nftCollectionAddress = await squadContract.methods.nftCollectionAddress().call();
        
        squadDetails.purpose = await squadContract.methods.purpose().call();
        squadDetails.target = await squadContract.methods.maxFundSize().call();
        squadDetails.currentInvestment = await squadContract.methods.currentInvestment().call();
        squadDetails.minInvestment = await squadContract.methods.minInvestment().call();
        squadDetails.maxInvestment = await squadContract.methods.maxInvestment().call();
        squadDetails.squadInitiator = await squadContract.methods.squadInitiator().call();
        squadDetails.status = await squadContract.methods.status().call();
        squadDetails.targetView = Number(web3.utils.fromWei(squadDetails.target));
        squadDetails.minInvestmentView = Number(web3.utils.fromWei(squadDetails.minInvestment));
        squadDetails.maxInvestmentView = Number(web3.utils.fromWei(squadDetails.maxInvestment));
        squadDetails.currentInvestmentView = Number(web3.utils.fromWei(squadDetails.currentInvestment));
        squadDetails.currentInvstPercent = (squadDetails.currentInvestment / squadDetails.target) * 100;
        squadDetails.investorCount = await squadActionsContract.methods.getInvestorCount(squadAddress).call();
        squadDetails.tokenAddress = await squadContract.methods.squadToken().call();

        const tokenContract = new web3.eth.Contract(
            contractsquadERC20ABI, squadDetails.tokenAddress
        );
        squadDetails.symbol = await tokenContract.methods.symbol().call();
        squadDetails.name = await tokenContract.methods.name().call(); 


        if(squadDetails.status == 5) {
            squadDetails.acquiredBy = await squadActionsContract.methods.getAcquiredBy(squadAddress).call();
        }

        return squadDetails;
    }
}

export default new SquadService();
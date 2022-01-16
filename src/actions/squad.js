import squadService from "../services/squad.service";
import { TRANSACTION_SUBMITTED } from "./types";

export const createSquad = (address, collectionAddress, target, name, purpose, fundSymbol, subFundCode, minInvestment, maxInvestment, tokenTotalSupply) => (dispatch) => {
    return squadService.createSquad(address, collectionAddress, target, name, purpose, fundSymbol, subFundCode, minInvestment, maxInvestment, tokenTotalSupply).then(
        (response) => {
            let data = {
                show: true,
                message: response.status,
                code: response.code
            }
            dispatch({
                type: TRANSACTION_SUBMITTED,
                payload: data
            });
            return Promise.resolve(response.code);
        },
        (error) => {
            console.log(error);
            return Promise.reject();
        }
    );
}

// export const activateSpad = (address, spadAddress, amount, description, twitterHandle) => (dispatch) => {
//     return spadService.activateSpad(address, spadAddress, amount, description, twitterHandle).then(
//         (response) => {
//             let data = {
//                 show: true,
//                 message: response.status,
//                 code: response.code
//             }
//             dispatch({
//                 type: TRANSACTION_SUBMITTED,
//                 payload: data
//             });
//             return Promise.resolve(response.code);
//         },
//         (error) => {
//             console.log(error);
//             return Promise.reject();
//         }
//     );
// }

// export const contribute = (address, spadAddress, amount, passKey) => (dispatch) => {
//     return spadService.contribute(address, spadAddress, amount, passKey).then(
//         (response) => {
//             let data = {
//                 show: true,
//                 message: response.status,
//                 code: response.code
//             }
//             dispatch({
//                 type: TRANSACTION_SUBMITTED,
//                 payload: data
//             });
//             return Promise.resolve(response.code);
//         },
//         (error) => {
//             console.log(error);
//             return Promise.reject();
//         }
//     );
// }

// export const pitchApproval = (address, spadAddress, pitcher, approval) => (dispatch) => {
//     return spadService.pitchApproval(address, spadAddress, pitcher, approval).then(
//         (response) => {
//             let data = {
//                 show: true,
//                 message: response.status,
//                 code: response.code
//             }
//             dispatch({
//                 type: TRANSACTION_SUBMITTED,
//                 payload: data
//             });
//             return Promise.resolve(response.code);
//         },
//         (error) => {
//             console.log(error);
//             return Promise.reject();
//         }
//     );
// }

// export const pitchForSPAD = (address, spadAddress, name, description, passKey) => (dispatch) => {
//     return spadService.pitchForSPAD(address, spadAddress, name, description, passKey).then(
//         (response) => {
//             let data = {
//                 show: true,
//                 message: response.status,
//                 code: response.code
//             }
//             dispatch({
//                 type: TRANSACTION_SUBMITTED,
//                 payload: data
//             });
//             return Promise.resolve(response.code);
//         },
//         (error) => {
//             console.log(error);
//             return Promise.reject();
//         }
//     );
// }

// export const claimInvestment = (address, spadAddress) => (dispatch) => {
//     return spadService.claimInvestment(address, spadAddress).then(
//         (response) => {
//             let data = {
//                 show: true,
//                 message: response.status,
//                 code: response.code
//             }
//             dispatch({
//                 type: TRANSACTION_SUBMITTED,
//                 payload: data
//             });
//             return Promise.resolve(response.code);
//         },
//         (error) => {
//             console.log(error);
//             return Promise.reject();
//         }
//     );
// }
import { METAMASK_UPDATED } from "../actions/types";


const initialState = {
    metamask: {
        address: "",
        network: "",
        status: "NOT_LOADED"
    }
}

const setState = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case METAMASK_UPDATED:
            return {
                ...state,
                metamask: payload
            }
        default:
            return state;
    }

}

export default setState;
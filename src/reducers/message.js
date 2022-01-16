import { CLOSE_NOTIFICATION, CLOSE_TRANSACTION_MODAL, NOTIFICATION_SUBMITTED, TRANSACTION_SUBMITTED } from "../actions/types";

const initialState = {
    transaction: {
        show: false,
        message: "",
        code: 0
    },
    notification: {
        show: false,
        message: "",
        success: false
    }
}

const setState = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TRANSACTION_SUBMITTED:
            return {
                ...state,
                transaction: payload
            }
        case NOTIFICATION_SUBMITTED:
            return {
                ...state,
                notification: payload
            }
        case CLOSE_TRANSACTION_MODAL:
            return {
                ...state,
                transaction: {
                    show: false,
                    message: "",
                    code: 0
                }
            }
        case CLOSE_NOTIFICATION:
            return {
                ...state,
                notification: {
                    show: false,
                    message: "",
                    success: false
                }
            }
        default:
            return state;
    }

}

export default setState;
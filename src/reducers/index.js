import { combineReducers } from "redux";
import metamask from "./metamask";
import message from "./message";

export default combineReducers({
   metamask,
   message,
});
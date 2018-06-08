import { createReducer } from "redux-create-reducer";
import { combineReducers } from "redux";
import section from "./section";
import repoDetails from "./repoDetails";
import fileTree from "./fileTree";
import hoverResult from "./hoverResult";
import session from "./session";
import fileContents from "./fileContents";
import pjax from "./pjax";

const initialState = {};

const data = createReducer(initialState, {
  UPDATE_DATA: (state, action) => ({
    ...state,
    ...action.payload
  })
});

const dataReducer = combineReducers({
  data,
  fileTree,
  repoDetails,
  section,
  hoverResult,
  session,
  fileContents,
  pjax
});

export default dataReducer;

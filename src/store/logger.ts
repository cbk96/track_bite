import { Action, Dispatch } from "redux";

export default function logger<S = any>({ getState }: { getState: () => S }) {
  return (next: Dispatch) => (action: Action) => {
    console.log("state brefore next ", getState());
    console.log("action ", action);
    const returnedACtion = next(action);
    console.log("state after next ", getState());
    return returnedACtion;
  };
}

/// <reference types="react" />
import { StoreType } from "./types";
declare const withStore: <InheritedStateType>(Component: (props: any) => JSX.Element, store: StoreType<InheritedStateType>) => (props: any) => JSX.Element;
export default withStore;

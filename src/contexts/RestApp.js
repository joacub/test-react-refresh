import { createContext } from 'react';

const RestAppContext = createContext();

export default RestAppContext;

export const { Provider, Consumer } = RestAppContext;

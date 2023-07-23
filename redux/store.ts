import { applyMiddleware, compose, createStore, Middleware } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { createWrapper } from 'next-redux-wrapper';
import rootReducers from './reducers/rootReducer';
import { AnyAction } from 'redux';

const middleware: Middleware[] = [thunk as ThunkMiddleware<any, AnyAction>];
const composeEnhancers =
    typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const bindMiddlewareComposeEnhancers = (middleware: Middleware[]): any => {
    if (process.env.NODE_ENV !== 'production') return composeEnhancers(applyMiddleware(...middleware));
    else return middleware;
};

const makeStore = () =>
    createStore(rootReducers, bindMiddlewareComposeEnhancers(middleware));

export const wrapper = createWrapper(makeStore);

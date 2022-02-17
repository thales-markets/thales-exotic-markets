import { combineReducers } from '@reduxjs/toolkit';
import ui from './modules/ui';
import wallet from './modules/wallet';
import app from './modules/app';

const rootReducer = combineReducers({
    app,
    wallet,
    ui,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

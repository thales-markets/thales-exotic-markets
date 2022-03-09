import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import App from 'pages/Root/App';
import dotenv from 'dotenv';

dotenv.config();

type RootProps = {
    store: Store;
};

const Root: React.FC<RootProps> = ({ store }) => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
};

export default Root;

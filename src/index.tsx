import React from 'react';
import ReactDOM from 'react-dom';
import Root from './pages/Root';
import store from './redux/store';

ReactDOM.render(
    <React.Fragment>
        <Root store={store} />
    </React.Fragment>,
    document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'; // react和redux连接的桥梁
import Root from './a_container/root';

// 直接引入到这里即可
import 'babel-polyfill';
// import store and history
import store from './store';
// 所有的CSS全部引入到入口文件即可
import './css/css.css';
import './css/scss.scss';
import 'water-wave/style.css';
const rootDom = document.getElementById('app-root');

ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    rootDom
);

if (module.hot) {
    module.hot.accept();
}
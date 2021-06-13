import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { reduxListContext, reduxListStore } from './components/reduxList';
import { reduxAccountContext, reduxAccountStore } from './components/reduxAccount';
import { GlobalProvider } from './components/GlobalProvider';

ReactDOM.render(
  <React.StrictMode>

    <Provider store={reduxListStore} context={reduxListContext}>
      <Provider store={reduxAccountStore} context={reduxAccountContext}>
        <GlobalProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </GlobalProvider>
      </Provider>
    </Provider>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

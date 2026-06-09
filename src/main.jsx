import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './theme/theme.css';
import App from './App.jsx';
import { store } from './redux/store.js';
import { Provider } from 'react-redux';
import ReactDOM from "react-dom/client";

// createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     <App />
//   </Provider>
//   // <StrictMode>
//   //   <App />
//   // </StrictMode>
// );


ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <Provider store={store}>
    <App />
  </Provider>
);
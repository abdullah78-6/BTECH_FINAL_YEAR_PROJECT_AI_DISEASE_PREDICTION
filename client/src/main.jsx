import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import Medicalstore from './Redux/store.js';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={Medicalstore}>
    <App />
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import './index.css';
import App from './App.jsx';
import store from './Redux Toolkit/store.jsx'; // Import the store you created
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import reportWebVitals from './reportWebVitals';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/* Wrap App with Provider and pass the store */}
      <App />
    </Provider>
  </StrictMode>
);

reportWebVitals();

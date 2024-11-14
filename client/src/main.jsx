import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store, persistor } from './Redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { TranslationProvider } from 'react-google-multi-lang';

createRoot(document.getElementById('root')).render(
  <TranslationProvider apiKey={import.meta.env.VITE_APP_GOOGLE_TRANSLATE_API} defaultLanguage='en' >
    <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <App />
        </PersistGate>
      </Provider>
  </TranslationProvider>,
)

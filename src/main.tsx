import * as ReactDOM from 'react-dom/client'
import App from '../src/app/App.tsx'
import {Provider} from "react-redux";
import {persistor, store} from "./app/model/store";
import {PersistGate} from 'redux-persist/integration/react'


ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App/>
        </PersistGate>
    </Provider>
)

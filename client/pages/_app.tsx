// client/pages/_app.tsx
import { Provider } from 'react-redux';
import { store } from '../store';
import '../src/app/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;

import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import App from './App';
import rdstore from './src/models/rdstore';

const ReduxApplication = () => (
    <Provider store={rdstore}>
        <App />
    </Provider>
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(ReduxApplication);

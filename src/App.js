import { Provider } from "react-redux";
import { store } from "./store";

import Movies from "./movies";

const App = () => {
  return (
    <Provider store={store}>
      <Movies />
    </Provider>
  );
};

export default App;

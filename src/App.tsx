import { RouterProvider } from 'react-router-dom';
import "./global.scss";
import { router } from './Routers/router';
function App() {
  return <RouterProvider router={router } />;
}

export default App;

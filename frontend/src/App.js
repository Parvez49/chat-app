
import { RouterProvider } from 'react-router-dom';
import './App.scss';
import { router } from './routes/Routes';

function App() {
  return (
      <RouterProvider router = {router} />
  );
}

export default App;

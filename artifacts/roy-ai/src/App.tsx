import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <div className="h-screen w-full flex">
      <Sidebar />
      <div style={{ flex: 1 }}>
        <HomePage />
      </div>
    </div>
  );
}

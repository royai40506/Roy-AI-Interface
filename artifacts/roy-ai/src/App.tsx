import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <div className="h-screen w-full flex flex-col">
      <Sidebar />
      <div className="flex-1">
        <HomePage />
      </div>
      <BottomNav />
    </div>
  );
}

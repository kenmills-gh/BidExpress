import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuctionItem from './AuctionItem';
import Home from './Home';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0e0e0f]">
        <Routes>
          {/* The Homepage Grid */}
          <Route path="/" element={<Home />} />

          {/* The Dynamic Single Item View */}
          <Route path="/item/:itemId" element={<AuctionItem />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

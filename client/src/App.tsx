import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuctionItem from './AuctionItem';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0e0e0f]">
        <Routes>
          {/* Redirect anyone who hits the homepage straight to Item 1 for now */}
          <Route path="/" element={<Navigate to="/item/1" replace />} />

          {/* Our new Dynamic Route! */}
          <Route path="/item/:itemId" element={<AuctionItem />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

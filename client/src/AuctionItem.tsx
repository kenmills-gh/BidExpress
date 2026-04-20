import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// Define our TypeScript interfaces for the data
interface Bid {
  id: number;
  bid_amount: string | number;
  username: string;
  created_at: string;
}

const AuctionItem = () => {
  // State to hold our live data
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const [bidInput, setBidInput] = useState<string>('');
  
  // We are hardcoding Item ID 1 for now (The Polaroid)
  const ITEM_ID = 1; 
  // Hardcoding User ID 1 for the person clicking the button
  const MY_USER_ID = 1; 

  useEffect(() => {
    // 1. Connect to the backend
    const socket: Socket = io('http://localhost:5000');

    // 2. Fetch the initial bid history from our REST API
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bids/${ITEM_ID}`);
        const data = await response.json();
        if (data.length > 0) {
          setBidHistory(data);
          // Set the highest bid (which is the first item since we ORDER BY DESC in SQL)
          setCurrentBid(Number(data[0].bid_amount)); 
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();

    // 3. Join the specific Socket.io room for this item
    socket.emit('join_auction', String(ITEM_ID));

    // 4. Listen for live updates
    socket.on('receive_new_bid', (newBid) => {
      console.log('New bid received via WebSocket!', newBid);
      
      setCurrentBid(Number(newBid.bid_amount));
      
      setBidHistory((prev) => [
        { ...newBid, username: 'Live_Bidder' }, 
        ...prev
      ]);
    });

    // Cleanup function when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to handle clicking the "Place Bid" button
  const handlePlaceBid = async () => {
    const amount = Number(bidInput);
    if (!amount || amount <= currentBid) {
      alert('Bid must be higher than the current bid!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: ITEM_ID,
          bidder_id: MY_USER_ID,
          bid_amount: amount
        })
      });

      if (response.ok) {
        setBidInput(''); // Clear the input box on success
      }
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen antialiased selection:bg-primary/20 pb-[80px] md:pb-0">
      
      {/* TopAppBar - TABS RESTORED */}
      <header className="hidden md:flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto docked full-width top-0 z-50 bg-[#131314]/80 backdrop-blur-xl">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black text-primary uppercase tracking-tighter">Obsidian Exchange</span>
          <nav className="flex items-center gap-6">
            <a className="font-headline font-bold tracking-tight text-primary border-b-2 border-primary pb-1 hover:text-primary transition-all duration-300" href="#">Live Auctions</a>
            <a className="font-headline font-bold tracking-tight text-on-surface-variant hover:text-primary transition-all duration-300" href="#">Upcoming</a>
            <a className="font-headline font-bold tracking-tight text-on-surface-variant hover:text-primary transition-all duration-300" href="#">Private Vault</a>
          </nav>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Left Column: Item Details */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-lowest">
              <img 
                alt="Item Image" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop" 
              />
            </div>
            
            {/* DESCRIPTION AND TIMER RESTORED */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="font-headline text-5xl font-bold tracking-tight text-on-surface mb-2">Vintage Polaroid Camera</h1>
                  <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
                    Mint condition, tested and working perfectly. A masterclass in vintage photography.
                  </p>
                </div>
                <div className="shrink-0 bg-surface-container-high rounded-lg p-4 backdrop-blur-xl border border-outline-variant/15 flex flex-col items-end min-w-[200px]">
                  <span className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider mb-1">Time Remaining</span>
                  <span className="font-headline text-3xl font-bold text-secondary">02d 14h 22m 10s</span>
                  <div className="mt-2 inline-flex items-center gap-2 bg-secondary-container rounded-full px-3 py-1">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    <span className="text-secondary text-xs font-bold uppercase tracking-wide">Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bidding Core */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Bidding Overview Card */}
            <div className="bg-surface-container rounded-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
              <span className="text-on-surface-variant font-medium text-sm block mb-2">Current Highest Bid</span>
              {/* DISPLAY LIVE CURRENT BID */}
              <div className="font-headline text-5xl font-bold text-on-surface mb-6 tracking-tight">
                ${currentBid.toFixed(2)}
              </div>
              
              <div className="flex flex-col gap-4 relative z-10">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-headline text-xl">$</span>
                  <input 
                    className="w-full bg-surface-container-high border-none rounded-lg py-4 pl-10 pr-4 text-on-surface font-headline text-xl font-bold placeholder-on-surface-variant/50 focus:ring-1 focus:ring-primary focus:outline-none transition-all" 
                    placeholder="Enter amount..." 
                    type="number" 
                    value={bidInput}
                    onChange={(e) => setBidInput(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handlePlaceBid}
                  className="w-full bg-gradient-to-b from-secondary to-secondary-dim text-on-secondary-fixed font-headline font-bold text-lg py-4 rounded-md hover:shadow-[0_0_20px_rgba(63,255,139,0.3)] transition-all duration-300">
                  Place Bid
                </button>
              </div>
            </div>

            {/* Live Bid History */}
            <div className="bg-surface-container rounded-xl p-6 flex-1 flex flex-col max-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline text-xl font-bold text-on-surface">Live Bid History</h3>
                <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                  <span className="material-symbols-outlined text-[16px]">history</span>
                  <span>Auto-updating</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {/* MAP OVER OUR LIVE DATA ARRAY */}
                {bidHistory.map((bid, index) => (
                  <div key={index} className="flex items-center justify-between bg-surface-container-high rounded-lg p-3 border border-outline-variant/15">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {bid.username ? bid.username.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-on-surface font-semibold text-sm">@{bid.username || 'user'}</span>
                        <span className="text-on-surface-variant text-xs">Just now</span>
                      </div>
                    </div>
                    <span className="font-headline font-bold text-secondary">
                      ${Number(bid.bid_amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuctionItem;
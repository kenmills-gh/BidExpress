import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Item {
  id: number;
  name: string;
  description: string;
  starting_price: string;
  image_url: string;
}

const Home = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="font-body selection:bg-primary selection:text-on-primary bg-background text-on-surface min-h-screen">
      {/* TopAppBar */}
      <nav className="docked full-width top-0 z-50 bg-[#0e0e0f]/80 backdrop-blur-xl bg-[#131314] shadow-none sticky">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-black text-[#89acff] uppercase tracking-tighter font-headline">
            Obsidian Exchange
          </div>
          <div className="hidden md:flex items-center space-x-10">
            <a
              className="text-[#89acff] border-b-2 border-[#89acff] pb-1 font-headline font-bold tracking-tight text-sm hover:text-[#89acff] transition-all duration-300"
              href="#"
            >
              Live Auctions
            </a>
            <a
              className="text-[#adaaab] font-['Manrope'] text-sm hover:text-[#89acff] transition-all duration-300"
              href="#"
            >
              Upcoming
            </a>
            <a
              className="text-[#adaaab] font-['Manrope'] text-sm hover:text-[#89acff] transition-all duration-300"
              href="#"
            >
              Private Vault
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <span className="material-symbols-outlined text-[#adaaab] cursor-pointer hover:text-[#89acff] transition-all">
              notifications
            </span>
            <span className="material-symbols-outlined text-[#89acff] cursor-pointer text-3xl transition-all scale-[1] active:scale-[0.99] active:opacity-80">
              account_circle
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[819px] flex items-center pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-[-10%] w-[800px] h-[400px] bg-secondary/5 rounded-full blur-[160px] rotate-12"></div>
        </div>
        <div className="max-w-screen-2xl mx-auto w-full relative z-10 lg:ml-16">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-3 mb-6 rounded-full bg-surface-container-high text-primary font-label text-xs font-bold tracking-[0.2em] uppercase">
              Premiere Access Only
            </span>
            <h1 className="font-headline font-black text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] tracking-tighter text-on-surface mb-8">
              The Vault <br />
              <span className="text-primary italic">is Open.</span>
            </h1>
            <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed mb-12">
              Discover and bid on exclusive, authenticated items in real-time. Secure the rare, own
              the extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-gradient-to-b from-secondary-dim to-secondary text-on-secondary px-10 py-5 rounded-md font-label font-bold text-lg btn-glow-secondary transition-all active:scale-95">
                ENTER EXCHANGE
              </button>
              <button className="border border-primary/20 hover:border-primary/60 text-primary px-10 py-5 rounded-md font-label font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-3">
                VIEW CATALOG <span className="material-symbols-outlined">north_east</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-screen-2xl mx-auto px-6 pb-40">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Live Now</h2>
            <div className="h-1 w-24 bg-secondary"></div>
          </div>
          <div className="flex gap-4">
            <button className="p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        {/* DYNAMIC 3-Column Item Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((item) => (
              <Link
                to={`/item/${item.id}`}
                key={item.id}
                className="group flex flex-col bg-surface-container rounded-lg overflow-hidden transition-all duration-500 hover:translate-y-[-8px]"
              >
                <div className="relative aspect-[4/3] bg-surface-container-lowest overflow-hidden">
                  <img
                    src={
                      item.image_url ||
                      'https://via.placeholder.com/600x450.png?text=Obsidian+Exchange'
                    }
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 right-4 glass-morphism px-3 py-1.5 rounded-full flex items-center gap-2 z-10 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    <span className="text-secondary font-label text-[10px] font-black uppercase tracking-widest leading-none">
                      Live
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-surface-container-lowest to-transparent">
                    <div className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                      Lot {item.id.toString().padStart(3, '0')}
                    </div>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-headline text-2xl font-bold mb-4 line-clamp-1 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="font-body text-on-surface-variant text-sm mb-8 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-auto">
                    <div className="flex flex-col mb-6">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">
                        Starting Bid
                      </span>
                      <span className="text-3xl font-headline font-bold text-secondary">
                        ${Number(item.starting_price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between group/cta cursor-pointer">
                      <span className="text-primary font-label font-bold text-sm tracking-widest uppercase">
                        View Lot
                      </span>
                      <span className="material-symbols-outlined text-primary group-hover/cta:translate-x-2 transition-transform">
                        arrow_right_alt
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bento Grid Insights Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          <div className="md:col-span-2 md:row-span-2 bg-surface-container-high rounded-xl p-10 flex flex-col justify-end relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none opacity-40"></div>
            <img
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000"
              alt="Analytics"
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
            />
            <div className="relative z-10">
              <h4 className="font-headline text-4xl font-black mb-4">
                Real-time <br />
                Market Analytics
              </h4>
              <p className="text-on-surface-variant mb-8 max-w-sm">
                Access deep historical data and valuation trends for every category in the exchange.
              </p>
              <button className="text-secondary font-bold flex items-center gap-2 group/btn">
                EXPLORE DATA{' '}
                <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
          <div className="md:col-span-2 bg-surface-container rounded-xl p-8 flex items-center justify-between">
            <div>
              <div className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-2">
                Vault Security
              </div>
              <h4 className="font-headline text-2xl font-bold">Authenticated Provenance</h4>
              <p className="text-on-surface-variant text-sm mt-2">
                Every item verified by 3rd-party specialists.
              </p>
            </div>
            <span className="material-symbols-outlined text-5xl text-primary/30">
              verified_user
            </span>
          </div>
          <div className="md:col-span-1 bg-surface-container rounded-xl p-8 flex flex-col justify-between">
            <span className="material-symbols-outlined text-secondary text-3xl">token</span>
            <div>
              <div className="text-2xl font-headline font-bold">12.4k</div>
              <div className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                Active Bidders
              </div>
            </div>
          </div>
          <div className="md:col-span-1 bg-primary rounded-xl p-8 flex flex-col justify-between">
            <span className="material-symbols-outlined text-on-primary text-3xl">public</span>
            <div>
              <div className="text-2xl font-headline font-bold text-on-primary">Global</div>
              <div className="text-on-primary/60 text-[10px] font-bold uppercase tracking-widest">
                Exchange Network
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <div className="md:hidden">
        <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-[#0e0e0f]/90 backdrop-blur-2xl z-50 shadow-[0_-4px_40px_rgba(137,172,255,0.06)] border-t border-outline-variant/10">
          <div className="flex flex-col items-center justify-center text-[#3fff8b] bg-[#3fff8b]/10 rounded-xl px-4 py-1 active:scale-95 duration-150 transition-all">
            <span className="material-symbols-outlined">explore</span>
            <span className="font-['Manrope'] text-[10px] font-semibold uppercase tracking-widest mt-1">
              Explore
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-[#adaaab] hover:bg-[#1a191b] hover:text-[#89acff] active:scale-95 duration-150 transition-all">
            <span className="material-symbols-outlined">gavel</span>
            <span className="font-['Manrope'] text-[10px] font-semibold uppercase tracking-widest mt-1">
              Bidding
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-[#adaaab] hover:bg-[#1a191b] hover:text-[#89acff] active:scale-95 duration-150 transition-all">
            <span className="material-symbols-outlined">visibility</span>
            <span className="font-['Manrope'] text-[10px] font-semibold uppercase tracking-widest mt-1">
              Watchlist
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-[#adaaab] hover:bg-[#1a191b] hover:text-[#89acff] active:scale-95 duration-150 transition-all">
            <span className="material-symbols-outlined">lock</span>
            <span className="font-['Manrope'] text-[10px] font-semibold uppercase tracking-widest mt-1">
              Vault
            </span>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Home;

import React from "react";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { LandingSection } from "./components/landingSection";
import { ArcadeList } from "./components/arcadeList";
import { WalletProvider } from "./components/walletProvider";

const App: React.FC = () => {
  return (
    <WalletProvider>
    <div className="min-h-screen bg-gray-900 text-white press2start-regular">
      <Navbar />
      <main>
        <LandingSection />
        <ArcadeList />
      </main>
      <Footer />
    </div>
    </WalletProvider>
  );
};

export default App;
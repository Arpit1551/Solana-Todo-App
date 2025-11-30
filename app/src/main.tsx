import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"

const endpoint = "http://localhost:8899";

const wallets = [
  new PhantomWalletAdapter(),
];

createRoot(document.getElementById('root')!).render(

  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets}>
      <WalletModalProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>

)

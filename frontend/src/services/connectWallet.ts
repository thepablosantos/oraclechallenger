import { ethers } from 'ethers';

// Define um tipo personalizado para o objeto window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectWallet(): Promise<string | null> {
  if (!window.ethereum) {
    alert("MetaMask não encontrada. Instale a extensão para continuar.");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts[0]; // Retorna o primeiro endereço da carteira
  } catch (error) {
    console.error("Erro ao conectar:", error);
    return null;
  }
} 
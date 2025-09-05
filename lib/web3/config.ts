import { ethers } from 'ethers';

export const SUPPORTED_CHAINS = {
  ETHEREUM: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    blockExplorer: 'https://etherscan.io',
  },
  POLYGON: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/',
    blockExplorer: 'https://polygonscan.com',
  },
  ARBITRUM: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb-mainnet.g.alchemy.com/v2/',
    blockExplorer: 'https://arbiscan.io',
  },
} as const;

export const DEFAULT_CHAIN = SUPPORTED_CHAINS.ETHEREUM;

export const getAlchemyProvider = (chainId: number) => {
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  if (!apiKey) {
    throw new Error('Alchemy API key not configured');
  }

  const chain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === chainId);
  if (!chain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  return new ethers.AlchemyProvider(chainId, apiKey);
};

export const switchToChain = async (chainId: number) => {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider detected');
  }

  const chain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === chainId);
  if (!chain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${chainId.toString(16)}`,
          chainName: chain.name,
          rpcUrls: [chain.rpcUrl],
          blockExplorerUrls: [chain.blockExplorer],
        }],
      });
    } else {
      throw switchError;
    }
  }
};

declare global {
  interface Window {
    ethereum?: any;
  }
}
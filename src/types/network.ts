import { ethers } from 'ethers';

export type NetworkId = 10 | 69 | 420;

export type EthereumProvider = {
    isMetaMask: boolean;
    chainId: string;
};

export type NetworkSettings = {
    networkId?: NetworkId;
    signer?: ethers.Signer;
    provider?: ethers.providers.Provider;
};

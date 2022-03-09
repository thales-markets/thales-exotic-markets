import { ethers, Signer } from 'ethers';
import { NetworkSettings } from 'types/network';
import thalesTokenContract from './contracts/thalesContract';
import marketManagerContract from 'utils/contracts/exoticPositionalMarketManagerContract';
import thalesBondsContract from 'utils/contracts/thalesBondsContract';
import tagsContract from 'utils/contracts/exoticPositionalTagsContract';
import { NetworkIdByName } from './network';

type NetworkConnector = {
    initialized: boolean;
    provider: ethers.providers.Provider | undefined;
    signer: Signer | undefined;
    setNetworkSettings: (networkSettings: NetworkSettings) => void;
    thalesTokenContract?: ethers.Contract;
    marketManagerContract?: ethers.Contract;
    thalesBondsContract?: ethers.Contract;
    tagsContract?: ethers.Contract;
};

// @ts-ignore
const networkConnector: NetworkConnector = {
    initialized: false,

    setNetworkSettings: function (networkSettings: NetworkSettings) {
        this.initialized = true;
        this.signer = networkSettings.signer;
        this.provider = networkSettings.provider;
        this.thalesTokenContract = initializeContract(thalesTokenContract, networkSettings);
        this.marketManagerContract = initializeContract(marketManagerContract, networkSettings);
        this.thalesBondsContract = initializeContract(thalesBondsContract, networkSettings);
        this.tagsContract = initializeContract(tagsContract, networkSettings);
    },
};

const initializeContract = (contract: any, networkSettings: NetworkSettings) =>
    contract.addresses[networkSettings.networkId || NetworkIdByName.OptimsimMainne] !== ''
        ? new ethers.Contract(
              contract.addresses[networkSettings.networkId || NetworkIdByName.OptimsimMainnet],
              contract.abi,
              networkConnector.provider
          )
        : undefined;

export default networkConnector;

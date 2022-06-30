# Thales: Exotic Positional Markets

[![Discord](https://img.shields.io/discord/906484044915687464.svg?color=768AD4&label=discord&logo=https%3A%2F%2Fdiscordapp.com%2Fassets%2F8c9701b98ad4372b58f13fd9f65f966e.svg)](https://discord.com/invite/rB3AWKwACM)
[![Twitter Follow](https://img.shields.io/twitter/follow/thalesmarket.svg?label=thalesmarket&style=social)](https://twitter.com/thalesmarket)

Thales: Exotic Positional Markets.

The UI is available on exoticmarkets.xyz(https://exoticmarkets.xyz).

## Tech stack

-   React
-   React Redux
-   React Query
-   Styled-Components

## Ethereum stack

-   ethers.js v5 - Ethereum wallet implementation.
-   Blocknative Onboard - for ethereum wallet connectivity.

## Development

### Install dependencies

```bash
npm i
```

### Set up environment variables

Copy the `.env.local.example` file in this directory to `.env.local` (which will be ignored by Git):
Then, open `.env.local` and add the missing environment variables:

-   `REACT_APP_INFURA_PROJECT_ID` - Infura project id (get it from [infura.io](https://infura.io/)).
-   `REACT_APP_PORTIS_APP_ID` - Portis app id (get it from [portis.io](https://www.portis.io/)).
-   `REACT_APP_THALES_API_URL` - The Thales API URL. Set to `https://api.thales.market`.
-   `REACT_APP_IPFS_DEPLOYMENT` - Is dApp in the mode for deployment on IPFS. Set to `false`.

### Run

```bash
npm run start
```

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### Build

```bash
npm run build
```

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

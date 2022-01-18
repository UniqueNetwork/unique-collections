// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type EnvConfigType = {
  decimals: number;
  discordChannel: string;
  environment: string;
  faviconPath: string;
  graphQlAdminSecret: string;
  graphQlApi: string;
  imageServerUrl: string;
  ipfsGateway: string;
  maxGas: number; // 1000000000000
  minPrice: number;
  uniqueSubstrateApi: string;
  uniqueTelegram: string;
  uniqueWallet: string;
  whiteLabelUrl: string;
};

declare global {
  interface Window {
    ENV: {
      DECIMALS: number;
      DISCORD_CHANNEL: string;
      ENVIRONMENT: string;
      FAVICON_PATH: string;
      GRAPH_QL_ADMIN_SECRET: string;
      GRAPH_QL_API: string;
      IMAGE_SERVER_URL: string;
      IPFS_GATEWAY: string;
      MIN_PRICE: number;
      UNIQUE_SUBSTRATE_API: string;
      UNQ_TELEGRAM: string;
      UNQ_WALLET: string;
      WHITE_LABEL_URL: string;
    }
  }
}

const envConfig: EnvConfigType = {
  decimals: +window.ENV.DECIMALS,
  discordChannel: window.ENV.DISCORD_CHANNEL,
  environment: window.ENV.ENVIRONMENT,
  faviconPath: window.ENV.FAVICON_PATH,
  graphQlAdminSecret: window.ENV.GRAPH_QL_ADMIN_SECRET,
  graphQlApi: window.ENV.GRAPH_QL_API,
  imageServerUrl: window.ENV.IMAGE_SERVER_URL,
  ipfsGateway: window.ENV.IPFS_GATEWAY,
  minPrice: +window.ENV.MIN_PRICE,
  uniqueSubstrateApi: window.ENV.UNIQUE_SUBSTRATE_API,
  uniqueTelegram: window.ENV.UNQ_TELEGRAM,
  uniqueWallet: window.ENV.UNQ_WALLET,
  whiteLabelUrl: window.ENV.WHITE_LABEL_URL
};

export default envConfig;

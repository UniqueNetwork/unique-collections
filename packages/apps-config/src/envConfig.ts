// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type EnvConfigType = {
  commission: number;
  decimals: number;
  environment: string;
  faviconPath: string;
  graphQlAdminSecret: string;
  graphQlApi: string;
  imageServerUrl: string;
  ipfsGateway: string;
  kusamaApiUrl: string;
  kusamaBackupApiUrl: string;
  kusamaDecimals: number; // 12
  maxGas: number; // 1000000000000
  minPrice: number;
  quoteId: number; // 2
  uniqueCollectionIds: string[]; // ['23']
  uniqueSubstrateApi: string;
  value: number; // 0
  version: string;
  whiteLabelUrl: string;
};

declare global {
  interface Window {
    ENV: {
      COMMISSION: number;
      DECIMALS: number;
      ENVIRONMENT: string;
      FAVICON_PATH: string;
      GRAPH_QL_ADMIN_SECRET: string;
      GRAPH_QL_API: string;
      IMAGE_SERVER_URL: string;
      IPFS_GATEWAY: string;
      KUSAMA_API: string;
      KUSAMA_BACKUP_API: string;
      KUSAMA_DECIMALS: number; // 12
      MAX_GAS: number; // 1000000000000
      MIN_PRICE: number;
      QUOTE_ID: number; // 2
      UNIQUE_API: string;
      UNIQUE_COLLECTION_IDS: string; // ['23']
      UNIQUE_SUBSTRATE_API: string;
      VALUE: number; // 0
      VERSION: string;
      WHITE_LABEL_URL: string;
    }
  }
}

const envConfig: EnvConfigType = {
  commission: +window.ENV.COMMISSION,
  decimals: +window.ENV.DECIMALS,
  environment: window.ENV.ENVIRONMENT,
  faviconPath: window.ENV.FAVICON_PATH,
  graphQlAdminSecret: window.ENV.GRAPH_QL_ADMIN_SECRET,
  graphQlApi: window.ENV.GRAPH_QL_API,
  imageServerUrl: window.ENV.IMAGE_SERVER_URL,
  ipfsGateway: window.ENV.IPFS_GATEWAY,
  kusamaApiUrl: window.ENV.KUSAMA_API,
  kusamaBackupApiUrl: window.ENV.KUSAMA_BACKUP_API,
  kusamaDecimals: +window.ENV.KUSAMA_DECIMALS,
  maxGas: +window.ENV.MAX_GAS,
  minPrice: +window.ENV.MIN_PRICE,
  quoteId: +window.ENV.QUOTE_ID,
  uniqueCollectionIds: window.ENV.UNIQUE_COLLECTION_IDS.split(','),
  uniqueSubstrateApi: window.ENV.UNIQUE_SUBSTRATE_API,
  value: +window.ENV.VALUE,
  version: window.ENV.VERSION,
  whiteLabelUrl: window.ENV.WHITE_LABEL_URL
};

export default envConfig;

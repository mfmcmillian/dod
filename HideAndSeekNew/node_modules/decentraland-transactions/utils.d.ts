import { Provider } from './types';
export declare function getAccount(provider: Provider): Promise<string>;
export declare function getSignature(provider: Provider, account: string, dataToSign: string): Promise<string>;
export declare function getExecuteMetaTransactionData(account: string, fullSignature: string, functionSignature: string): string;
export declare function normalizeVersion(version: string): string;
export declare function getNonce(provider: Provider, account: string, contractAddress: string): Promise<string>;
export declare function getSalt(chainId: number | string): string;
export declare function getCode(provider: Provider, account: string): Promise<string>;
export declare function isContract(provider: Provider, account: string): Promise<boolean>;
export declare function hexZeroPad(hex: string): string;
export declare function isZeroAddress(address: string): boolean;
//# sourceMappingURL=utils.d.ts.map
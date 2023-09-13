import { Provider, Configuration, ContractData } from './types';
/**
 * Send a meta transaction using a relay server
 * @param provider Which network you are connected to and therefore where the meta transaction will be signed
 * @param metaTransactionProvider Where the meta transaction will be executed
 * @param functionSignature Hexa of the transaction data you want to execute
 * @param contractData Related contract data necessary to execute the transaction. Check getContract from this same package
 * @param partialConfiguration Configurable params like which relay server to use
 */
export declare function sendMetaTransaction(provider: Provider, metaTransactionProvider: Provider, functionSignature: string, contractData: ContractData, partialConfiguration?: Partial<Configuration>): Promise<string>;
//# sourceMappingURL=sendMetaTransaction.d.ts.map
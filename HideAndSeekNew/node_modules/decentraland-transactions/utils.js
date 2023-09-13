var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const GET_NONCE_FUNCTION_SELECTOR = '2d0335ab';
const EXECUTE_META_TRANSACTION_FUNCTION_SELECTOR = '0c53c51c';
const ZERO_ADDRESS = hexZeroPad('0x');
let rpcId = 0;
export function getAccount(provider) {
    return __awaiter(this, void 0, void 0, function* () {
        let accounts = [];
        try {
            // Some accounts do not support the RPC call eth_requestAccounts but use eth_accounts
            // Both are part of the EIP1193: https://eips.ethereum.org/EIPS/eip-1193
            accounts = yield send(provider, 'eth_requestAccounts', []);
        }
        catch (error) {
            accounts = yield send(provider, 'eth_accounts', []);
        }
        if (accounts.length === 0) {
            throw new Error('Could not find a valid connected account');
        }
        return accounts[0];
    });
}
export function getSignature(provider, account, dataToSign) {
    return __awaiter(this, void 0, void 0, function* () {
        return send(provider, 'eth_signTypedData_v4', [account, dataToSign]);
    });
}
export function getExecuteMetaTransactionData(account, fullSignature, functionSignature) {
    const signature = fullSignature.replace('0x', '');
    const r = signature.substring(0, 64);
    const s = signature.substring(64, 128);
    const v = normalizeVersion(signature.substring(128, 130));
    const method = functionSignature.replace('0x', '');
    const signatureLength = (method.length / 2).toString(16);
    const signaturePadding = Math.ceil(method.length / 64);
    return [
        '0x',
        EXECUTE_META_TRANSACTION_FUNCTION_SELECTOR,
        to32Bytes(account),
        to32Bytes('a0'),
        r,
        s,
        to32Bytes(v),
        to32Bytes(signatureLength),
        method.padEnd(64 * signaturePadding, '0')
    ].join('');
}
export function normalizeVersion(version) {
    /*
      This is a fix for an issue with Ledger, where `v` is returned as 0 or 1 and we expect it to be 27 or 28.
      See issue #26 of decentraland-transactions for more details: https://github.com/decentraland/decentraland-transactions/issues/26
    */
    let parsed = parseInt(version, 16);
    if (parsed < 27) {
        // this is because Ledger returns 0 or 1
        parsed += 27;
    }
    if (parsed !== 27 && parsed !== 28) {
        throw Error(`Invalid signature version "${version}" (parsed: ${parsed})`);
    }
    return parsed.toString(16);
}
export function getNonce(provider, account, contractAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const hexSigner = to32Bytes(account);
        const nonce = yield send(provider, 'eth_call', [
            {
                data: `0x${GET_NONCE_FUNCTION_SELECTOR}${hexSigner}`,
                to: contractAddress
            },
            'latest'
        ]);
        return to32Bytes(nonce);
    });
}
export function getSalt(chainId) {
    if (typeof chainId === 'number') {
        return `0x${to32Bytes(chainId.toString(16))}`;
    }
    return `0x${to32Bytes(chainId)}`;
}
export function getCode(provider, account) {
    return send(provider, 'eth_getCode', [
        account.toLowerCase(),
        'latest'
    ]);
}
export function isContract(provider, account) {
    return __awaiter(this, void 0, void 0, function* () {
        const bytecode = yield getCode(provider, account);
        return !isZeroAddress(bytecode);
    });
}
export function hexZeroPad(hex) {
    if (!/^0x[0-9a-f]*$/gi.test(hex)) {
        throw new Error(`Not a valid hex string "${hex}"`);
    }
    let padded = hex.slice(2);
    while (padded.length < 40) {
        padded = '0' + padded;
    }
    return '0x' + padded;
}
export function isZeroAddress(address) {
    return hexZeroPad(address.toLowerCase()) === ZERO_ADDRESS;
}
function to32Bytes(value) {
    return value
        .toString()
        .replace('0x', '')
        .padStart(64, '0');
}
function send(provider, method, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let data;
        let args = {
            jsonrpc: '2.0',
            id: ++rpcId,
            method,
            params
        };
        if (typeof provider['request'] !== 'undefined') {
            data = yield provider.request(args);
        }
        else if (typeof provider['sendAsync'] !== 'undefined') {
            data = yield provider.sendAsync(args);
        }
        else if (typeof provider['send'] !== 'undefined') {
            data = yield provider.send(method, params);
        }
        if (data) {
            return data['result'] || data;
        }
        else {
            throw new Error(`Could not send the transaction correcty. Either the provider does not support the method "${method}" or is missing a proper send/request.`);
        }
    });
}
//# sourceMappingURL=utils.js.map
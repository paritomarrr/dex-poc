"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapItYaar = exports.getSwapAmountVolary = exports.swapVlry = void 0;
var abi_1 = require("./utils/abi");
var constants_1 = require("./utils/constants");
var sdk_1 = require("@uniswap/sdk");
var ethers_1 = require("ethers");
var provider = new ethers_1.ethers.providers.JsonRpcProvider(constants_1.GOERLI_RPC_URL);
var VLRY = new sdk_1.Token(constants_1.GOERLI_CHAIN_ID, constants_1.GOERLI_VLRY_ADDRESS, 18, "VLY");
var inToken = sdk_1.WETH[constants_1.GOERLI_CHAIN_ID];
var swapVlry = function (inAmount, privateKey, exchange, slippage) {
    if (slippage === void 0) { slippage = '50'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var wallet, inToken_1, pair, exchangeAddress, contract, route, conversion, amountIn, slippageTolerance, trade, outputAmount, outputToken, amountOutMin, amountOutMinHex, path, to, deadline, value, valueHex, rawTxn, sendTxn, reciept, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    wallet = new ethers_1.ethers.Wallet(privateKey, provider);
                    inToken_1 = sdk_1.WETH[constants_1.GOERLI_CHAIN_ID];
                    return [4 /*yield*/, sdk_1.Fetcher.fetchPairData(VLRY, inToken_1, provider)];
                case 1:
                    pair = _a.sent();
                    exchangeAddress = void 0;
                    if (exchange === 'uniswap') {
                        exchangeAddress = constants_1.UNISWAP_ROUTER_ADDRESS;
                    }
                    else if (exchange === 'sushiswap') {
                        exchangeAddress = constants_1.SUSHISWAP_ROUTER_ADDRESS;
                    }
                    else if (exchange === 'pancakeswap') {
                        exchangeAddress = constants_1.PANCAKESWAP_ROUTER_ADDRESS;
                    }
                    else {
                        return [2 /*return*/, {
                                code: 0,
                                message: "invalid exchange : only sushi and uniswap supported"
                            }];
                    }
                    contract = new ethers_1.ethers.Contract(exchangeAddress, abi_1.UNISWAP_ROUTER_ABI, provider);
                    return [4 /*yield*/, new sdk_1.Route([pair], inToken_1)];
                case 2:
                    route = _a.sent();
                    conversion = ethers_1.ethers.utils.parseEther(inAmount.toString());
                    amountIn = conversion.toString();
                    slippageTolerance = new sdk_1.Percent(slippage, '10000');
                    trade = new sdk_1.Trade(route, new sdk_1.TokenAmount(inToken_1, amountIn), sdk_1.TradeType.EXACT_INPUT);
                    outputAmount = trade.outputAmount.raw;
                    outputToken = trade.outputAmount.currency.symbol;
                    console.log("Received ".concat(outputAmount, " ").concat(outputToken));
                    amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
                    amountOutMinHex = ethers_1.ethers.BigNumber.from(amountOutMin.toString()).toHexString();
                    path = [inToken_1.address, VLRY.address];
                    to = wallet.address;
                    deadline = Math.floor(Date.now() / 1000) + 60 * 20;
                    value = trade.inputAmount.raw;
                    return [4 /*yield*/, ethers_1.ethers.BigNumber.from(value.toString()).toHexString()];
                case 3:
                    valueHex = _a.sent();
                    return [4 /*yield*/, contract.populateTransaction.swapExactETHForTokens(amountOutMinHex, path, to, deadline, {
                            value: valueHex,
                        })];
                case 4:
                    rawTxn = _a.sent();
                    return [4 /*yield*/, wallet];
                case 5:
                    sendTxn = (_a.sent()).sendTransaction(rawTxn);
                    return [4 /*yield*/, sendTxn];
                case 6:
                    reciept = (_a.sent()).wait();
                    return [2 /*return*/, reciept];
                case 7:
                    error_1 = _a.sent();
                    throw error_1;
                case 8: return [2 /*return*/];
            }
        });
    });
};
exports.swapVlry = swapVlry;
// swapVlry('0.0001', TEST_PRIVATE_KEY, "uniswap", "50")
var getSwapAmountVolary = function (inAmount, privateKey, exchange, slippage) {
    if (slippage === void 0) { slippage = '50'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var inToken_2, pair, exchangeAddress, route, conversion, amountIn, slippageTolerance, trade, outputAmount, outputToken, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    inToken_2 = sdk_1.WETH[constants_1.GOERLI_CHAIN_ID];
                    return [4 /*yield*/, sdk_1.Fetcher.fetchPairData(VLRY, inToken_2, provider)];
                case 1:
                    pair = _a.sent();
                    exchangeAddress = void 0;
                    if (exchange === 'uniswap') {
                        exchangeAddress = constants_1.UNISWAP_ROUTER_ADDRESS;
                    }
                    else if (exchange === 'sushiswap') {
                        exchangeAddress = constants_1.SUSHISWAP_ROUTER_ADDRESS;
                    }
                    else if (exchange === 'pancakeswap') {
                        exchangeAddress = constants_1.PANCAKESWAP_ROUTER_ADDRESS;
                    }
                    else {
                        return [2 /*return*/, {
                                code: 0,
                                message: "invalid exchange : only sushi and uniswap supported"
                            }];
                    }
                    route = new sdk_1.Route([pair], inToken_2);
                    conversion = ethers_1.ethers.utils.parseEther(inAmount.toString());
                    amountIn = conversion.toString();
                    slippageTolerance = new sdk_1.Percent(slippage, '10000');
                    trade = new sdk_1.Trade(//information necessary to create a swap transaction.
                    route, new sdk_1.TokenAmount(inToken_2, amountIn), sdk_1.TradeType.EXACT_INPUT);
                    console.log('Error5');
                    outputAmount = trade.outputAmount.raw;
                    console.log(trade);
                    outputToken = trade.outputAmount.currency.symbol;
                    console.log("Received ".concat(outputAmount, " ").concat(outputToken));
                    return [2 /*return*/, outputAmount];
                case 2:
                    error_2 = _a.sent();
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.getSwapAmountVolary = getSwapAmountVolary;
// getSwapAmountVolary('1', '393993', "uniswap", "50")
var swapItYaar = function () { return __awaiter(void 0, void 0, void 0, function () {
    var inToken_3, pair, route, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                inToken_3 = sdk_1.WETH[constants_1.GOERLI_CHAIN_ID];
                return [4 /*yield*/, sdk_1.Fetcher.fetchPairData(VLRY, inToken_3, provider)];
            case 1:
                pair = _a.sent();
                route = new sdk_1.Route([pair], inToken_3);
                console.log(route.midPrice.toSignificant(6)); // 201.306
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.log(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.swapItYaar = swapItYaar;
// swapItYaar()
function getBalance() {
    return __awaiter(this, void 0, void 0, function () {
        var wallet, contract, reserve, supply, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    wallet = new ethers_1.ethers.Wallet(constants_1.TEST_PRIVATE_KEY, provider);
                    contract = new ethers_1.ethers.Contract('0x491400062AeAd93c53eBb6dc5fC1B9aA9C6BADe8', abi_1.UNISWAP_POOL, wallet);
                    return [4 /*yield*/, contract.getReserves()];
                case 1:
                    reserve = _c.sent();
                    console.log(reserve[0].toString());
                    console.log(reserve[1].toString());
                    return [4 /*yield*/, contract.symbol()];
                case 2:
                    supply = _c.sent();
                    _b = (_a = console).log;
                    return [4 /*yield*/, contract.token0()];
                case 3:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    });
}
function listenToEvent() {
    return __awaiter(this, void 0, void 0, function () {
        var wallet, contract;
        return __generator(this, function (_a) {
            try {
                wallet = new ethers_1.ethers.Wallet(constants_1.TEST_PRIVATE_KEY, provider);
                contract = new ethers_1.ethers.Contract('0x491400062AeAd93c53eBb6dc5fC1B9aA9C6BADe8', abi_1.UNISWAP_POOL, wallet);
                contract.on('Swap', function (sender, amount0In, amount1In, amount0Out, amount1Out, to) {
                    console.log('Event Received:');
                    console.log('Sender:', sender.toString());
                    console.log('Amount Volary In:', amount0In.toString());
                    console.log('Amount WEth In', amount1In.toString());
                    console.log('Amount Volary Out', amount0Out.toString());
                    console.log('Amount WEth Out', amount1Out.toString());
                    console.log('To: ', to);
                });
                console.log('Listening for events...');
            }
            catch (error) {
                console.error('Error listening to event:', error);
            }
            return [2 /*return*/];
        });
    });
}
// getBalance()
listenToEvent();

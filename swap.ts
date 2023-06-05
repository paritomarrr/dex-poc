import { CurrencyAmount } from '@uniswap/sdk-core';
import { UNISWAP_ROUTER_ABI, SUSHISWAP_ROUTER_ABI, UNISWAP_POOL } from './utils/abi';
import {
  GOERLI_RPC_URL,
  UNISWAP_ROUTER_ADDRESS,
  SUSHISWAP_ROUTER_ADDRESS,
  GOERLI_VLRY_ADDRESS,
  PANCAKESWAP_ROUTER_ADDRESS,
  GOERLI_CHAIN_ID,
  TEST_PRIVATE_KEY
} from './utils/constants';
import { Token, WETH, Fetcher, Route, Trade, TokenAmount, TradeType, Percent, Pair, ChainId } from '@uniswap/sdk';
import { ethers } from 'ethers';
const provider = new ethers.providers.JsonRpcProvider(GOERLI_RPC_URL);


const VLRY = new Token(GOERLI_CHAIN_ID, GOERLI_VLRY_ADDRESS, 18, "VLY");
const inToken = WETH[GOERLI_CHAIN_ID];

export const swapVlry = async (inAmount: string, privateKey: string,exchange:string,slippage: string = '50') => {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    const inToken = WETH[GOERLI_CHAIN_ID];
    const pair = await Fetcher.fetchPairData(VLRY, inToken, provider);
    
    let exchangeAddress 
    if(exchange === 'uniswap'){
        exchangeAddress = UNISWAP_ROUTER_ADDRESS;
    }
    else if(exchange === 'sushiswap'){
        exchangeAddress = SUSHISWAP_ROUTER_ADDRESS;
    }
    else if(exchange === 'pancakeswap'){
      exchangeAddress = PANCAKESWAP_ROUTER_ADDRESS;
    }
    else{
        return {
            code : 0,
            message : "invalid exchange : only sushi and uniswap supported"
        }
    }
    const contract = new ethers.Contract(exchangeAddress, UNISWAP_ROUTER_ABI, provider);
    const route = await new Route([pair], inToken);
    const conversion = ethers.utils.parseEther(inAmount.toString());
    let amountIn = conversion.toString();
    const slippageTolerance = new Percent(slippage, '10000');
    const trade = new Trade(route, new TokenAmount(inToken, amountIn), TradeType.EXACT_INPUT);
    const outputAmount = trade.outputAmount.raw; // Specify the minimum acceptable output amount (0.1 WETH in this example)
    // console.log(trade);
    const outputToken = trade.outputAmount.currency.symbol
    console.log(`Received ${outputAmount} ${outputToken}`);
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
    const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();
    const path = [inToken.address, VLRY.address];
    const to = wallet.address;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const value = trade.inputAmount.raw;
    const valueHex = await ethers.BigNumber.from(value.toString()).toHexString();
    const rawTxn =
      await contract.populateTransaction.swapExactETHForTokens(
        amountOutMinHex,
        path,
        to,
        deadline,
        {
          value: valueHex,
        }
      );

    
    let sendTxn = (await wallet).sendTransaction(rawTxn);
    let reciept = (await sendTxn).wait();

    return reciept;
  } catch (error) {
    throw error;
  }
};

// swapVlry('0.0001', TEST_PRIVATE_KEY, "uniswap", "50")

export const getSwapAmountVolary = async (inAmount: string, privateKey: string,exchange:string,slippage: string = '50') => {
  try{
    const inToken = WETH[GOERLI_CHAIN_ID];
    const pair = await Fetcher.fetchPairData(VLRY, inToken, provider);
    let exchangeAddress 
    if(exchange === 'uniswap'){
        exchangeAddress = UNISWAP_ROUTER_ADDRESS;
    }
    else if(exchange === 'sushiswap'){
        exchangeAddress = SUSHISWAP_ROUTER_ADDRESS;
    }
    else if(exchange === 'pancakeswap'){
      exchangeAddress = PANCAKESWAP_ROUTER_ADDRESS;
    }
    else{
        return {
            code : 0,
            message : "invalid exchange : only sushi and uniswap supported"
        }
    }
    const route = new Route([pair], inToken);
    const conversion = ethers.utils.parseEther(inAmount.toString());
    let amountIn = conversion.toString();

    const slippageTolerance = new Percent(slippage, '10000'); // 50 bips, or 0.50% - Slippage tolerance

    const trade = new Trade( //information necessary to create a swap transaction.
      route,
      new TokenAmount(inToken, amountIn),
      TradeType.EXACT_INPUT
    );
    console.log('Error5');
    // Get the amount of output tokens received from the trade
    const outputAmount = trade.outputAmount.raw; // Specify the minimum acceptable output amount (0.1 WETH in this example)
    console.log(trade);
    const outputToken = trade.outputAmount.currency.symbol
    console.log(`Received ${outputAmount} ${outputToken}`);
    return outputAmount;
  }
  catch (error){
    throw error;
  }
};

// getSwapAmountVolary('1', '393993', "uniswap", "50")

export const swapItYaar = async () => {
  try {
    const inToken = WETH[GOERLI_CHAIN_ID];
    const pair = await Fetcher.fetchPairData(VLRY, inToken, provider);
    const route = new Route([pair], inToken);
    console.log(route.midPrice.toSignificant(6)) // 201.306
    // console.log("pair", route)

  } catch (error: any) {
    console.log(error)
  }
}

// swapItYaar()

async function getBalance() {
  const wallet = new ethers.Wallet(TEST_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    '0x491400062AeAd93c53eBb6dc5fC1B9aA9C6BADe8',
    UNISWAP_POOL,
    wallet
  );
  const reserve = await contract.getReserves();
  console.log(reserve[0].toString());
  console.log(reserve[1].toString());
  const supply = await contract.symbol();
  console.log(await contract.token0());
}


async function listenToEvent() {
  try {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(
      '0x491400062AeAd93c53eBb6dc5fC1B9aA9C6BADe8',
    UNISWAP_POOL,
      wallet
    );
    contract.on(
      'Swap',
      (sender, amount0In, amount1In, amount0Out, amount1Out, to) => {
        console.log('Event Received:');
        console.log('Sender:', sender.toString());
        console.log('Amount Volary In:', amount0In.toString());
        console.log('Amount WEth In', amount1In.toString());
        console.log('Amount Volary Out', amount0Out.toString());
        console.log('Amount WEth Out', amount1Out.toString());
        console.log('To: ', to);
      }
    );

    console.log('Listening for events...');
  } catch (error) {
    console.error('Error listening to event:', error);
  }
}


// getBalance()
// listenToEvent()







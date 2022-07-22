import {
  Address,
  BigInt,
  dataSource,
  DataSourceContext,
} from "@graphprotocol/graph-ts";
import { Swap } from "../generated/templates/UniswapV3Pool/UniswapV3Pool";
import { UniswapV3Pool } from "../generated/templates";
import { Pool, SwapData } from "../generated/schema";
import { createOrLoadPool, createOrLoadSwapData } from "./uniswap-v-3-factory";

export function handleSwap(event: Swap): void {
  let context = dataSource.context();
  let poolId = context.getString("pool");

  let pool = createOrLoadPool(poolId);
  let swapData = createOrLoadSwapData(
    event.transaction.hash.toHexString() + "#" + pool.swap.length.toString()
  );

  let swaps = pool.swap;

  //   swapData.pool = poolId;
  swapData.sender = event.params.sender;
  swapData.receiver = event.params.recipient;
  swapData.origin = event.transaction.from;
  swapData.sqrtPriceX96 = event.params.sqrtPriceX96;
  swapData.tick = BigInt.fromI32(event.params.tick);
  swapData.liquidity = event.params.liquidity;
  swapData.timestamp = event.block.timestamp;

//   if (swaps.length == 0) {
//     swapData.cumulativeTicks = BigInt.fromI32(0);
//   } else {
//     let prevSwap = createOrLoadSwapData(swaps[swaps.length - 1]);
//     let prevTickTime = prevSwap.timestamp;
//     let duration = event.block.timestamp.minus(prevTickTime);
//     let prevTick = prevSwap.tick;
//     swapData.cumulativeTicks = prevTick.times(duration);
//   }

  swaps.push(swapData.id);
  pool.count = pool.count.plus(BigInt.fromI32(1));
  pool.swap = swaps;

  swapData.save();
  pool.save();
}

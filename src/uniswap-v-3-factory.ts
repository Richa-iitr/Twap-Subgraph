import { Address, BigInt, DataSourceContext } from "@graphprotocol/graph-ts";
import {
  UniswapV3Factory,
  PoolCreated,
} from "../generated/Factory/UniswapV3Factory";
import { UniswapV3Pool } from "../generated/templates";
import { Pool, SwapData } from "../generated/schema";

export function handlePoolCreated(event: PoolCreated): void {
  let context = new DataSourceContext();
  context.setString("pool", event.params.pool.toHexString());

  let pool = createOrLoadPool(event.params.pool.toHexString());
  pool.token0 = event.params.token0;
  pool.token1 = event.params.token1;
  pool.address = event.params.pool;
  pool.feeTier = event.params.fee;
  pool.tickSpacing = event.params.tickSpacing;
  pool.createdAt = event.block.timestamp;

  UniswapV3Pool.createWithContext(event.params.pool, context);
  pool.save();
}

export function createOrLoadPool(id: string): Pool {
  let pool = Pool.load(id);
  if (pool == null) {
    pool = new Pool(id);
    pool.count = BigInt.fromI32(0);
    pool.address = new Address(0);
    pool.token0 = new Address(0);
    pool.token1 = new Address(0);
    pool.feeTier = 0;
    pool.tickSpacing = 0;
    pool.createdAt = BigInt.fromI32(0);
    pool.swap = new Array();
  }
  return pool;
}

export function createOrLoadSwapData(id: string): SwapData {
  let data = SwapData.load(id);
  if (data == null) {
    data = new SwapData(id);
    data.sender = new Address(0);
    data.receiver = new Address(0);
    data.origin = new Address(0);
    data.sqrtPriceX96 = BigInt.fromI32(0);
    data.tick = BigInt.fromI32(0);
    data.cumulativeTicks = BigInt.fromI32(0);
    data.timestamp = BigInt.fromI32(0);
    data.blockNumber = BigInt.fromI32(0);
    data.liquidity = BigInt.fromI32(0);
  }
  return data;
}

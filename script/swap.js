import Web3 from "web3";
import BigNumber from "bignumber.js";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    process.env.INFURA_KEY
  )
);

const ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "sender", type: "address" },
      { indexed: true, internalType: "address", name: "recipient", type: "address" },
      {
        indexed: false,
        internalType: "int256",
        name: "amount0",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "amount1",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "uint160",
        name: "sqrtPriceX96",
        type: "uint160",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "liquidity",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "int24",
        name: "tick",
        type: "int24",
      },
    ],
    name: "Swap",
    type: "event",
  },
];
const CONTRACT_ADDR = "0x2efec2097beede290b2eed63e2faf5ecbbc528fc";

const contract = new web3.eth.Contract(ABI, CONTRACT_ADDR);

// const blockNumber = await web3.eth.getBlockNumber();

function throwErr(err) {
  throw new Error(err);
}

await getResult();

async function getResult() {
  let j = 0;
  let map = new Map();
  let eventData = [];
  await getEvents(12376435, 12376493, eventData);
  // console.log(eventData);
  for (let obj of eventData) {
    console.log(obj);
  }
}

async function getEvents(start, end, eventData) {
  let options = {
    fromBlock: start,
    toBlock: end,
  };

  await contract.getPastEvents("Swap", options)
    .then(
      async function (events) {
        // eventData.push(events);
        for (var ev of events) {
          eventData.push(ev);
        }
      })
    .catch(
      async function (error) {
        let mid = Math.round((start + end) / 2);
        await getEvents(start, mid, eventData);
        await getEvents(mid + 1, end, eventData);
      }
    );
}
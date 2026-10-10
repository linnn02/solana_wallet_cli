import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  clusterApiUrl,
} from "@solana/web3.js";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import * as fs from "fs";
import * as path from "path";

// IDL описания программы Counter
const IDL: any = {
  address: "D93gSKF3Qre9jsF72Ww9sLaVU4e2cW2Mjxebm3x2hcvU",
  metadata: {
    name: "counter",
    version: "0.1.0",
    spec: "0.1.0",
  },
  instructions: [
    {
      name: "initialize",
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        { name: "counter", writable: true, signer: true },
        { name: "user", writable: true, signer: true },
        { name: "systemProgram", address: "11111111111111111111111111111111" },
      ],
      args: [],
    },
    {
      name: "increment",
      discriminator: [11, 18, 104, 9, 104, 174, 59, 33],
      accounts: [
        { name: "counter", writable: true },
      ],
      args: [],
    },
    {
      name: "decrement",
      discriminator: [106, 227, 168, 59, 248, 27, 150, 101],
      accounts: [
        { name: "counter", writable: true },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "CounterAccount",
      discriminator: [255, 176, 4, 245, 188, 253, 124, 25],
    },
  ],
  types: [
    {
      name: "CounterAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "count", type: "u64" },
          { name: "authority", type: "pubkey" },
        ],
      },
    },
  ],
};

function parseCounterAccount(data: Buffer) {
  // 8 байт дискриминатор Anchor + 8 байт u64 count + 32 байта pubkey
  const count = data.readBigUInt64LE(8);
  const authority = new PublicKey(data.subarray(16, 48));
  return { count: count.toString(), authority: authority.toBase58() };
}

async function main() {
  const programId = new PublicKey("D93gSKF3Qre9jsF72Ww9sLaVU4e2cW2Mjxebm3x2hcvU");
  console.log("Anchor Counter Program ID:", programId.toBase58());

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const solanaConfigKeyPath = path.join(
    process.env.USERPROFILE || "",
    ".config",
    "solana",
    "id.json"
  );
  const rawKey = JSON.parse(fs.readFileSync(solanaConfigKeyPath, "utf-8"));
  const payer = Keypair.fromSecretKey(Uint8Array.from(rawKey));
  console.log("Payer / User Pubkey:", payer.publicKey.toBase58());

  const balance = await connection.getBalance(payer.publicKey);
  console.log("Payer balance:", balance / 1e9, "SOL");

  const wallet = new Wallet(payer);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  const program = new Program(IDL, provider);

  const counterAccount = Keypair.generate();
  console.log("New Counter Keypair:", counterAccount.publicKey.toBase58());

  // 1. Initialize
  console.log("\n[1/3] Executing 'initialize' instruction...");
  const initTx = await (program.methods as any)
    .initialize()
    .accounts({
      counter: counterAccount.publicKey,
      user: payer.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([counterAccount])
    .rpc();

  console.log("Initialize Tx Signature:", initTx);
  console.log(`Explorer: https://explorer.solana.com/tx/${initTx}?cluster=devnet`);

  let accInfo = await connection.getAccountInfo(counterAccount.publicKey);
  if (accInfo) {
    const parsed = parseCounterAccount(accInfo.data);
    console.log("Counter count after initialize:", parsed.count, "(authority:", parsed.authority + ")");
  }

  // 2. Increment
  console.log("\n[2/3] Executing 'increment' instruction...");
  const incTx = await (program.methods as any)
    .increment()
    .accounts({
      counter: counterAccount.publicKey,
    })
    .rpc();

  console.log("Increment Tx Signature:", incTx);
  console.log(`Explorer: https://explorer.solana.com/tx/${incTx}?cluster=devnet`);

  accInfo = await connection.getAccountInfo(counterAccount.publicKey);
  if (accInfo) {
    const parsed = parseCounterAccount(accInfo.data);
    console.log("Counter count after increment:", parsed.count);
  }

  // 3. Decrement
  console.log("\n[3/3] Executing 'decrement' instruction...");
  const decTx = await (program.methods as any)
    .decrement()
    .accounts({
      counter: counterAccount.publicKey,
    })
    .rpc();

  console.log("Decrement Tx Signature:", decTx);
  console.log(`Explorer: https://explorer.solana.com/tx/${decTx}?cluster=devnet`);

  accInfo = await connection.getAccountInfo(counterAccount.publicKey);
  if (accInfo) {
    const parsed = parseCounterAccount(accInfo.data);
    console.log("Counter count after decrement:", parsed.count);
  }

  console.log("\n=== SUCCESS: All Anchor operations verified on Solana Devnet! ===");
}

main().catch((err) => {
  console.error("Client Execution Error:", err);
  process.exit(1);
});

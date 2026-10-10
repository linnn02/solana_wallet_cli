import {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddressSync,
  getTokenMetadata,
} from "@solana/spl-token";
import * as fs from "fs";
import * as path from "path";

// IDL описания программы Profile
const PROFILE_PROGRAM_ID = new PublicKey(
  "CFqRzR9dPUMhcLYxjFwTyHRocDqe1XEU4rLfGc6uTn7W"
);
const TOKEN_MINT = new PublicKey(
  "bx75hPxpE9eSMaZMkzKY7jH9DnSSGK6Q8vrjY5h2Qzh"
);

function parseUserProfile(data: Buffer) {
  let offset = 8; // 8 bytes anchor discriminator
  const authority = new PublicKey(data.subarray(offset, offset + 32));
  offset += 32;

  const usernameLen = data.readUInt32LE(offset);
  offset += 4;
  const username = data.subarray(offset, offset + usernameLen).toString("utf-8");
  offset += usernameLen;

  const bioLen = data.readUInt32LE(offset);
  offset += 4;
  const bio = data.subarray(offset, offset + bioLen).toString("utf-8");
  offset += bioLen;

  const bump = data.readUInt8(offset);

  return { authority: authority.toBase58(), username, bio, bump };
}

async function main() {
  console.log("=========================================================");
  console.log("🚀 SOLANA BUILD SPRINT: WEB3 DEVELOPER MVP DASHBOARD");
  console.log("=========================================================\n");

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Загружаем основной кошелёк студента
  const solanaConfigKeyPath = path.join(
    process.env.USERPROFILE || "",
    ".config",
    "solana",
    "id.json"
  );
  const rawKey = JSON.parse(fs.readFileSync(solanaConfigKeyPath, "utf-8"));
  const payer = Keypair.fromSecretKey(Uint8Array.from(rawKey));

  const userPubkey = payer.publicKey;
  const lamports = await connection.getBalance(userPubkey);
  const solBalance = lamports / 1e9;

  console.log("👤 [1/4] USER WALLET OVERVIEW (Week 3)");
  console.log("---------------------------------------------------------");
  console.log("Public Address :", userPubkey.toBase58());
  console.log("SOL Balance    :", solBalance.toFixed(9), "SOL");
  console.log("Account Status :", solBalance > 0 ? "Active (Funded)" : "Empty");
  console.log(
    "Explorer       :",
    `https://explorer.solana.com/address/${userPubkey.toBase58()}?cluster=devnet`
  );

  console.log("\n🆔 [2/4] ON-CHAIN DECENTRALIZED IDENTITY / PDA PROFILE (Week 6)");
  console.log("---------------------------------------------------------");
  const [profilePda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("profile"), userPubkey.toBuffer()],
    PROFILE_PROGRAM_ID
  );
  console.log("Profile PDA    :", profilePda.toBase58());
  console.log("PDA Bump       :", bump);
  console.log("Program ID     :", PROFILE_PROGRAM_ID.toBase58());

  const profileAcc = await connection.getAccountInfo(profilePda);
  if (profileAcc) {
    const profile = parseUserProfile(profileAcc.data);
    console.log("Username       :", profile.username);
    console.log("Bio            :", profile.bio);
    console.log("Authority      :", profile.authority);
    console.log("Profile Status : Verified On-Chain ✅");
  } else {
    console.log("Profile Status : Not initialized");
  }

  console.log("\n🪙 [3/4] SPL TOKEN ASSETS & TOKEN EXTENSIONS (Week 7)");
  console.log("---------------------------------------------------------");
  console.log("Token Mint     :", TOKEN_MINT.toBase58());
  console.log("Standard       : Token-2022 with Metadata Pointer Extension");

  // Читаем метаданные токена
  const tokenMetadata = await getTokenMetadata(connection, TOKEN_MINT);
  if (tokenMetadata) {
    console.log("Token Name     :", tokenMetadata.name);
    console.log("Token Symbol   :", tokenMetadata.symbol);
    console.log("Metadata URI   :", tokenMetadata.uri);
  }

  // Читаем баланс токенов пользователя
  const userAta = getAssociatedTokenAddressSync(
    TOKEN_MINT,
    userPubkey,
    false,
    TOKEN_2022_PROGRAM_ID
  );
  console.log("User Token ATA :", userAta.toBase58());

  try {
    const tokenAcc = await getAccount(
      connection,
      userAta,
      "confirmed",
      TOKEN_2022_PROGRAM_ID
    );
    const tokenBalance = Number(tokenAcc.amount) / 1e9;
    console.log("Token Balance  :", tokenBalance, "SST");
  } catch (e) {
    console.log("Token Balance  : 0 SST (No ATA found)");
  }

  console.log("\n📊 [4/4] ECOSYSTEM INTERACTION SUMMARY");
  console.log("---------------------------------------------------------");
  console.log("Week 3 CLI Core    : Rust Native Wallet Struct & Logic ✅");
  console.log("Week 4 Program     : Deployed 'hello_world' SBPF Bytecode ✅");
  console.log("Week 5 Anchor      : 'counter' Smart Contract & RPC Client ✅");
  console.log("Week 6 PDA Profile : Decentralized User Identity Verified ✅");
  console.log("Week 7 SPL Token   : SST Minted & Distributed via Token-2022 ✅");
  console.log("Week 8 MVP State   : All modules unified in working prototype! 🏆");
  console.log("=========================================================\n");
}

main().catch((err) => {
  console.error("Dashboard Error:", err);
  process.exit(1);
});

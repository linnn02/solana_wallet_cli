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

const IDL: any = {
  address: "CFqRzR9dPUMhcLYxjFwTyHRocDqe1XEU4rLfGc6uTn7W",
  metadata: {
    name: "profile",
    version: "0.1.0",
    spec: "0.1.0",
  },
  instructions: [
    {
      name: "createProfile",
      discriminator: [225, 205, 234, 143, 17, 186, 50, 220],
      accounts: [
        { name: "profile", writable: true },
        { name: "authority", writable: true, signer: true },
        { name: "systemProgram", address: "11111111111111111111111111111111" },
      ],
      args: [
        { name: "username", type: "string" },
        { name: "bio", type: "string" },
      ],
    },
    {
      name: "updateBio",
      discriminator: [201, 29, 45, 117, 230, 37, 55, 183],
      accounts: [
        { name: "profile", writable: true },
        { name: "authority", signer: true },
      ],
      args: [
        { name: "newBio", type: "string" },
      ],
    },
  ],
  accounts: [
    {
      name: "UserProfile",
      discriminator: [153, 224, 52, 249, 114, 88, 227, 242],
    },
  ],
  types: [
    {
      name: "UserProfile",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "pubkey" },
          { name: "username", type: "string" },
          { name: "bio", type: "string" },
          { name: "bump", type: "u8" },
        ],
      },
    },
  ],
};

function parseUserProfile(data: Buffer) {
  // 8 bytes discriminator
  let offset = 8;
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
  const programId = new PublicKey("CFqRzR9dPUMhcLYxjFwTyHRocDqe1XEU4rLfGc6uTn7W");
  console.log("PDA Profile Program ID:", programId.toBase58());

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const solanaConfigKeyPath = path.join(
    process.env.USERPROFILE || "",
    ".config",
    "solana",
    "id.json"
  );
  const rawKey = JSON.parse(fs.readFileSync(solanaConfigKeyPath, "utf-8"));
  const payer = Keypair.fromSecretKey(Uint8Array.from(rawKey));
  console.log("Authority (User) Pubkey:", payer.publicKey.toBase58());

  const balance = await connection.getBalance(payer.publicKey);
  console.log("Payer balance:", balance / 1e9, "SOL");

  const wallet = new Wallet(payer);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  const program = new Program(IDL, provider);

  // Вычисляем децентрализованный PDA для профиля: seeds = ["profile", authority.key]
  const [profilePda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("profile"), payer.publicKey.toBuffer()],
    programId
  );
  console.log(`\nDerived Profile PDA: ${profilePda.toBase58()} (bump: ${bump})`);

  // Проверяем, существует ли уже профиль в Devnet
  const existingAcc = await connection.getAccountInfo(profilePda);

  if (!existingAcc) {
    console.log("\n[1/2] Creating On-Chain Profile via PDA...");
    const createTx = await (program.methods as any)
      .createProfile("solana_dev", "Rust & Solana Enthusiast | Web3 Builder")
      .accounts({
        profile: profilePda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Create Profile Tx Signature:", createTx);
    console.log(`Explorer: https://explorer.solana.com/tx/${createTx}?cluster=devnet`);
  } else {
    console.log("Profile PDA already initialized, proceeding to update...");
  }

  // Считываем состояние из блокчейна
  let accInfo = await connection.getAccountInfo(profilePda);
  if (accInfo) {
    const profile = parseUserProfile(accInfo.data);
    console.log("\n--- On-Chain Profile State ---");
    console.log("Authority:", profile.authority);
    console.log("Username: ", profile.username);
    console.log("Bio:      ", profile.bio);
    console.log("Bump:     ", profile.bump);
  }

  // Обновляем био через update_bio
  console.log("\n[2/2] Updating Bio in On-Chain Profile...");
  const updateTx = await (program.methods as any)
    .updateBio("Certified Solana Developer | Devnet Verified!")
    .accounts({
      profile: profilePda,
      authority: payer.publicKey,
    })
    .rpc();

  console.log("Update Bio Tx Signature:", updateTx);
  console.log(`Explorer: https://explorer.solana.com/tx/${updateTx}?cluster=devnet`);

  // Считываем обновлённое состояние
  accInfo = await connection.getAccountInfo(profilePda);
  if (accInfo) {
    const profile = parseUserProfile(accInfo.data);
    console.log("\n--- Updated Profile State ---");
    console.log("Username: ", profile.username);
    console.log("Bio:      ", profile.bio);
  }

  console.log("\n=== SUCCESS: On-Chain PDA Profile successfully verified on Solana Devnet! ===");
}

main().catch((err) => {
  console.error("Client Execution Error:", err);
  process.exit(1);
});

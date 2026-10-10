import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  getMintLen,
  ExtensionType,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  getAccount,
  getMint,
  getTokenMetadata,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("=== Week 7: SPL Token & Token Extensions (Token-2022) ===");

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const solanaConfigKeyPath = path.join(
    process.env.USERPROFILE || "",
    ".config",
    "solana",
    "id.json"
  );
  const rawKey = JSON.parse(fs.readFileSync(solanaConfigKeyPath, "utf-8"));
  const payer = Keypair.fromSecretKey(Uint8Array.from(rawKey));
  console.log("Authority / Payer Pubkey:", payer.publicKey.toBase58());

  const balance = await connection.getBalance(payer.publicKey);
  console.log("Payer balance:", balance / 1e9, "SOL");

  // 1. Создаём пару ключей для Mint
  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;
  const decimals = 9;
  console.log("\nGenerated Mint Address:", mint.toBase58());

  const meta: TokenMetadata = {
    updateAuthority: payer.publicKey,
    mint: mint,
    name: "Solana Student Token",
    symbol: "SST",
    uri: "https://raw.githubusercontent.com/linnn02/solana_wallet_cli/main/token_meta.json",
    additionalMetadata: [["course", "Rust for Solana Developer"]],
  };

  const metadataExtension = ExtensionType.MetadataPointer;
  const metadataLen = pack(meta).length;
  const mintLen = getMintLen([metadataExtension]);

  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintLen + metadataLen
  );

  console.log("\n[1/4] Initializing Mint with Token-2022 and Metadata Extension...");
  const initMintTx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMetadataPointerInstruction(
      mint,
      payer.publicKey,
      mint,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mint,
      decimals,
      payer.publicKey,
      payer.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      metadata: mint,
      updateAuthority: payer.publicKey,
      mint: mint,
      mintAuthority: payer.publicKey,
      name: meta.name,
      symbol: meta.symbol,
      uri: meta.uri,
    })
  );

  const initSig = await sendAndConfirmTransaction(connection, initMintTx, [
    payer,
    mintKeypair,
  ]);
  console.log("Mint Creation & Metadata Tx Signature:", initSig);
  console.log(`Explorer: https://explorer.solana.com/tx/${initSig}?cluster=devnet`);

  // Проверяем метаданные через getTokenMetadata
  const onchainMeta = await getTokenMetadata(connection, mint);
  console.log("On-Chain Metadata verified:", onchainMeta?.name, `(${onchainMeta?.symbol})`);

  // 2. Создаем Associated Token Account (ATA) для отправителя
  console.log("\n[2/4] Creating Associated Token Account for Sender...");
  const senderAta = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey,
    false,
    "confirmed",
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  console.log("Sender ATA:", senderAta.address.toBase58());

  // 3. Минтим (выпускаем) 1,000 токенов SST
  const mintAmount = 1000 * Math.pow(10, decimals);
  console.log(`\n[3/4] Minting 1,000 SST to ${senderAta.address.toBase58()}...`);
  const mintSig = await mintTo(
    connection,
    payer,
    mint,
    senderAta.address,
    payer,
    mintAmount,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  console.log("Mint Tx Signature:", mintSig);
  console.log(`Explorer: https://explorer.solana.com/tx/${mintSig}?cluster=devnet`);

  let senderInfo = await getAccount(
    connection,
    senderAta.address,
    "confirmed",
    TOKEN_2022_PROGRAM_ID
  );
  console.log("Sender balance after mint:", Number(senderInfo.amount) / 1e9, "SST");

  // 4. Создаем аккаунт получателя и переводим 250 SST
  const receiverKeypair = Keypair.generate();
  console.log(`\n[4/4] Creating Receiver ATA and transferring 250 SST...`);
  console.log("Receiver Pubkey:", receiverKeypair.publicKey.toBase58());

  const receiverAta = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    receiverKeypair.publicKey,
    false,
    "confirmed",
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  console.log("Receiver ATA:", receiverAta.address.toBase58());

  const transferAmount = 250 * Math.pow(10, decimals);
  const transferSig = await transfer(
    connection,
    payer,
    senderAta.address,
    receiverAta.address,
    payer,
    transferAmount,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  console.log("Transfer Tx Signature:", transferSig);
  console.log(`Explorer: https://explorer.solana.com/tx/${transferSig}?cluster=devnet`);

  // Проверяем итоговые балансы
  senderInfo = await getAccount(
    connection,
    senderAta.address,
    "confirmed",
    TOKEN_2022_PROGRAM_ID
  );
  const receiverInfo = await getAccount(
    connection,
    receiverAta.address,
    "confirmed",
    TOKEN_2022_PROGRAM_ID
  );

  console.log("\n=== Final Token State ===");
  console.log("Mint:            ", mint.toBase58());
  console.log("Token Standard:   Token-2022 with Metadata Extension");
  console.log("Token Name:      ", onchainMeta?.name);
  console.log("Token Symbol:    ", onchainMeta?.symbol);
  console.log("Metadata URI:    ", onchainMeta?.uri);
  console.log("Sender Balance:  ", Number(senderInfo.amount) / 1e9, "SST");
  console.log("Receiver Balance:", Number(receiverInfo.amount) / 1e9, "SST");
  console.log("\n=== SUCCESS: SPL Token lifecycle confirmed on Solana Devnet! ===");
}

main().catch((err) => {
  console.error("Execution Error:", err);
  process.exit(1);
});

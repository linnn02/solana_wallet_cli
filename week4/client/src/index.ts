import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

// Подключение к Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Загружаем keypair из файла или создаём новый
function loadOrCreateKeypair(filepath: string): Keypair {
  if (fs.existsSync(filepath)) {
    const raw = fs.readFileSync(filepath, "utf-8");
    const secretKey = Uint8Array.from(JSON.parse(raw));
    return Keypair.fromSecretKey(secretKey);
  }
  const keypair = Keypair.generate();
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, JSON.stringify(Array.from(keypair.secretKey)));
  console.log("New keypair generated:", keypair.publicKey.toBase58());
  return keypair;
}

async function requestAirdrop(pubkey: PublicKey, amount: number): Promise<void> {
  console.log(`Requesting airdrop of ${amount} SOL to ${pubkey.toBase58()}...`);
  const sig = await connection.requestAirdrop(pubkey, amount * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig, "confirmed");
  const balance = await connection.getBalance(pubkey);
  console.log(`Balance after airdrop: ${balance / LAMPORTS_PER_SOL} SOL`);
}

async function callHelloProgram(
  payer: Keypair,
  programId: PublicKey
): Promise<string> {
  const instruction = new TransactionInstruction({
    keys: [],
    programId,
    data: Buffer.alloc(0),
  });

  const transaction = new Transaction().add(instruction);

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    payer,
  ]);

  return signature;
}

async function main() {
  // Читаем Program ID из аргументов командной строки или файла
  const programIdArg = process.argv[2];
  if (!programIdArg) {
    console.error("Usage: ts-node src/index.ts <PROGRAM_ID>");
    console.error("Example: ts-node src/index.ts 11111111111111111111111111111111");
    process.exit(1);
  }

  const programId = new PublicKey(programIdArg);
  console.log("Program ID:", programId.toBase58());

  // Загружаем или создаём кошелёк плательщика
  const payerKeypairPath = path.join(__dirname, "..", "payer-keypair.json");
  const payer = loadOrCreateKeypair(payerKeypairPath);
  console.log("Payer:", payer.publicKey.toBase58());

  // Проверяем баланс
  let balance = await connection.getBalance(payer.publicKey);
  console.log("Current balance:", balance / LAMPORTS_PER_SOL, "SOL");

  // Запрашиваем airdrop если баланса недостаточно
  if (balance < 0.1 * LAMPORTS_PER_SOL) {
    await requestAirdrop(payer.publicKey, 1);
  }

  // Вызываем программу
  console.log("\nCalling Hello World program...");
  const signature = await callHelloProgram(payer, programId);
  console.log("Transaction signature:", signature);
  console.log(
    "Solana Explorer:",
    `https://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

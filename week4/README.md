# Week 4: First Solana Program

Создание и деплой первой Solana-программы в Devnet.

## Что сделано
- Написана on-chain программа на Rust (`solana-program` crate) с выводом логов через `msg!`.
- Написан TypeScript-клиент на `@solana/web3.js` для отправки транзакции к программе.
- Программа успешно скомпилирована в SBPF байткод (`cargo build-sbf`) и задеплоена в сеть Solana Devnet.
- Вызов программы выполнен и подтверждён в блокчейне.

## Структура
```
week4/
├── program/
│   ├── src/lib.rs      ← on-chain программа (Rust)
│   └── Cargo.toml
└── client/
    ├── src/index.ts    ← клиент вызова программы (TypeScript)
    ├── package.json
    └── tsconfig.json
```

## Результаты деплоя и выполнения

| Параметр | Значение |
|---|---|
| **Network** | Solana Devnet |
| **Program ID** | `2Pi52xRjr6rUzcC7VZyUQXNyfRj6e1gmuNdQg3M8vb9e` |
| **Deploy Tx Signature** | `2rKu6pn6f7yp5eMdetRjGd3WL2Qi5MjQW22GCvdgfpkQSpjdDwucJmjQTP3cHjT8Jjgptc6EvDEgj7NK46DKn1tN` |
| **Program Explorer Link** | https://explorer.solana.com/address/2Pi52xRjr6rUzcC7VZyUQXNyfRj6e1gmuNdQg3M8vb9e?cluster=devnet |
| **Call Tx Signature** | `4gKkBFTSL9HboL51sNVCodbZbquGtDfZWdzs1Phh9Dh7PnUe8pNfGPByYSyrNVe9y8PZpkRATYbzHaVLqZic4VbY` |
| **Tx Explorer Link** | https://explorer.solana.com/tx/4gKkBFTSL9HboL51sNVCodbZbquGtDfZWdzs1Phh9Dh7PnUe8pNfGPByYSyrNVe9y8PZpkRATYbzHaVLqZic4VbY?cluster=devnet |

### Логи исполнения транзакции в Devnet:
```text
Program 2Pi52xRjr6rUzcC7VZyUQXNyfRj6e1gmuNdQg3M8vb9e invoke [1]
Program log: Hello, Solana! Program ID: 2Pi52xRjr6rUzcC7VZyUQXNyfRj6e1gmuNdQg3M8vb9e
Program log: Accounts passed: 0
Program log: Instruction data length: 0
Program 2Pi52xRjr6rUzcC7VZyUQXNyfRj6e1gmuNdQg3M8vb9e consumed 7517 of 200000 compute units
Program 2Pi52xRjr6rUzcC7VZyUQXNyfRj6e1gmuNdQg3M8vb9e success
```

## Команды запуска

### 1. Сборка программы
```bash
cd week4/program
cargo build-sbf
```

### 2. Деплой программы в Devnet
```bash
solana program deploy target/deploy/hello_world.so
```

### 3. Запуск клиента
```bash
cd week4/client
npm install
npx ts-node src/index.ts 2Pi52xRjr6rUzcC7VZyUQXNyfRj6e1gmuNdQg3M8vb9e
```

## Скриншоты для отчёта
1. **Сборка программы**: консоль с успешным выполнением `cargo build-sbf` и созданием `hello_world.so`.
2. **Баланс и сеть**: вывод команд `solana config get` и `solana balance`.
3. **Деплой программы**: консоль с выводом `solana program deploy` (где отображаются `Program Id` и сигнатура).
4. **Запуск клиента**: консоль с выводом выполнения `npx ts-node src/index.ts` и `Transaction signature`.
5. **Solana Explorer (Program)**: страница программы `2Pi52xRjr6rUzcC7VZyUQXNyfRj6e1gmuNdQg3M8vb9e` в Devnet.
6. **Solana Explorer (Transaction)**: страница транзакции `4gKkBFTSL9HboL51sNVCodbZbquGtDfZWdzs1Phh9Dh7PnUe8pNfGPByYSyrNVe9y8PZpkRATYbzHaVLqZic4VbY` с логом `"Hello, Solana!"`.

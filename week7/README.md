# Week 7: SPL Tokens & Token Extensions

Создание собственного токена на базе нового стандарта Solana Token Extensions (Token-2022) с метаданными, выпуск (mint) и перевод (transfer) в сети Solana Devnet.

## Что сделано
- Развёрнут токен с использованием стандарта **SPL Token-2022**:
  - Реализовано расширение **MetadataPointer** и **Token Metadata Interface**, позволяющее хранить метаданные (`name`, `symbol`, `uri`) непосредственно на самом аккаунте токена без сторонних программ (Metaplex).
  - Название токена: `Solana Student Token`
  - Символ токена: `SST`
  - Decimals: `9`
- Создан Associated Token Account (ATA) отправителя и выпущен объём в **1,000 SST** (`mintTo`).
- Создан ATA адрес получателя и выполнен перевод **250 SST** (`transfer`).
- Проверены итоговые балансы:
  - Отправитель: `750 SST`
  - Получатель: `250 SST`
  - Метаданные верифицированы в блокчейне через `getTokenMetadata`.

## Структура
```
week7/
├── token/
│   ├── src/index.ts      ← TypeScript-скрипт создания, минта, метаданных и трансфера
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Результаты в Solana Devnet

| Параметр | Значение |
|---|---|
| **Network** | Solana Devnet |
| **Token Mint Address** | `bx75hPxpE9eSMaZMkzKY7jH9DnSSGK6Q8vrjY5h2Qzh` |
| **Token Standard** | SPL Token-2022 (with Metadata Extension) |
| **Token Name** | Solana Student Token |
| **Token Symbol** | SST |
| **Mint & Metadata Tx** | `5T4YAWja8yUjxesZFDfCPFPnZBFsgA8bNgx9yLvMsHhcKQgwx5pG5qZTCf4gmVoG521HAtx9dpdrE6HXegaFHMXg` |
| **Mint Tx Link** | https://explorer.solana.com/tx/5T4YAWja8yUjxesZFDfCPFPnZBFsgA8bNgx9yLvMsHhcKQgwx5pG5qZTCf4gmVoG521HAtx9dpdrE6HXegaFHMXg?cluster=devnet |
| **Sender ATA** | `5BAo5rjWEz74rrP8CHEdyEmkoc2qVkeXJnu1NZbnUCUX` |
| **Minting Tx (1,000 SST)** | `32M3AXqisKqGhstZ9VKsdJNEE7CT6A9JVNG3qhZ4Z97AsbvwhMEAjQArdQ7Z9WMdKVNjRF3br1VDKSKTCbNVpiY5` |
| **Minting Tx Link** | https://explorer.solana.com/tx/32M3AXqisKqGhstZ9VKsdJNEE7CT6A9JVNG3qhZ4Z97AsbvwhMEAjQArdQ7Z9WMdKVNjRF3br1VDKSKTCbNVpiY5?cluster=devnet |
| **Receiver ATA** | `BcYvztLHk8ycLCGA66D1W2FZ582LK1W98qBDJVzz4Kou` |
| **Transfer Tx (250 SST)** | `4bHHBPXGzhvjfDPNLAYkbo8rxwiXQbUuWvvHcEHXMZvNN1SGVjC6ch8odaWdQts7aGH1rzd8K8ngkxmaXMNkNCFr` |
| **Transfer Tx Link** | https://explorer.solana.com/tx/4bHHBPXGzhvjfDPNLAYkbo8rxwiXQbUuWvvHcEHXMZvNN1SGVjC6ch8odaWdQts7aGH1rzd8K8ngkxmaXMNkNCFr?cluster=devnet |
| **Token Explorer Link** | https://explorer.solana.com/address/bx75hPxpE9eSMaZMkzKY7jH9DnSSGK6Q8vrjY5h2Qzh?cluster=devnet |

## Команды запуска

```bash
cd week7/token
npm install
npx ts-node src/index.ts
```


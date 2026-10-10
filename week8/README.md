# Week 8: BUILD SPRINT (Первый Web3 MVP)

Финальный практический модуль хакатона: объединение всех результатов недель 3–7 в единый рабочий Web3 MVP дашборд.

## Что сделано
Создан единый интеграционный клиент-дашборд на TypeScript (`@solana/web3.js`, `@coral-xyz/anchor`, `@solana/spl-token`), агрегирующий состояние всех ончейн-компонентов:
1. **Wallet Layer (Week 3)**: аутентификация и проверка баланса основного кошелька в сети Devnet.
2. **On-Chain Identity Layer (Week 6)**: верификация децентрализованного профиля через Program Derived Address (PDA `BipKbzdXpPSFpjEcDCdGDM3Hi9T4xY3LRtGPLZRYRpbf`), считывание `username` и `bio` из кастомной программы Anchor.
3. **Token Layer (Week 7)**: считывание метаданных и актуального баланса токенов **SST (Solana Student Token)** стандарта Token-2022 с аккаунта пользователя (ATA `5BAo5rjWEz74rrP8CHEdyEmkoc2qVkeXJnu1NZbnUCUX`).
4. **On-Chain Ecosystem Summary**: сводка подтверждения работоспособности всех модулей курса.

## Структура
```
week8/
├── mvp/
│   ├── public/
│   │   └── index.html    ← визуальный Web3 dApp дашборд
│   ├── src/index.ts      ← интеграционный Web3 MVP CLI скрипт
│   ├── server.js         ← локальный HTTP сервер дашборда
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Результаты интеграции в Solana Devnet

| Модуль | Идентификатор / Адрес | Статус в Devnet |
|---|---|---|
| **Кошелёк разработчика** | `7gqthLdoiQEW6nxwtbyPmcodWy7DyKxxafyPtSvkHp6J` | Активен (Devnet) |
| **Week 4 Program** | `2Pi52xRjr6rUzcC7VZyUQXNyfRj6e1gmuNdQg3M8vb9e` | Развёрнута |
| **Week 5 Counter Program** | `D93gSKF3Qre9jsF72Ww9sLaVU4e2cW2Mjxebm3x2hcvU` | Проверена |
| **Week 6 Profile Program** | `CFqRzR9dPUMhcLYxjFwTyHRocDqe1XEU4rLfGc6uTn7W` | Развёрнута |
| **Week 6 Profile PDA** | `BipKbzdXpPSFpjEcDCdGDM3Hi9T4xY3LRtGPLZRYRpbf` | Данные верифицированы |
| **Week 7 Token Mint** | `bx75hPxpE9eSMaZMkzKY7jH9DnSSGK6Q8vrjY5h2Qzh` | Token-2022 активен |
| **Week 7 Token ATA** | `5BAo5rjWEz74rrP8CHEdyEmkoc2qVkeXJnu1NZbnUCUX` | Баланс: 750 SST |

## Команды запуска

### 1. Визуальный Web-дашборд (браузерный dApp интерфейс)
```bash
cd week8/mvp
npm run web
# Открыть в браузере: http://localhost:3000
```
Либо можно просто открыть файл `week8/mvp/public/index.html` напрямую в любом браузере.

### 2. Консольный CLI-дашборд
```bash
cd week8/mvp
npm run start
```


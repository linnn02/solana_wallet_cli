# Week 5: Anchor Framework (Counter Program)

Разработка смарт-контракта счётчика на базе Anchor Framework и взаимодействие с ним через клиент на TypeScript в сети Solana Devnet.

## Что сделано
- Написана on-chain программа `counter` на Rust с использованием `anchor-lang`:
  - `initialize`: аллокация аккаунта счётчика, установка начального значения `count = 0` и сохранение создателя (`authority`).
  - `increment`: увеличение счётчика на 1 с проверкой переполнения.
  - `decrement`: уменьшение счётчика на 1 с кастомной ошибкой `CounterError::Underflow` при попытке уйти ниже нуля.
- Программа собрана под архитектуру SBPF (`cargo build-sbf`) и задеплоена в сеть Solana Devnet.
- Написан TypeScript-клиент (`@coral-xyz/anchor` + `@solana/web3.js`), успешно протестировавший все три метода непосредственно в блокчейне.

## Структура
```
week5/
├── counter/
│   └── programs/
│       └── counter/
│           ├── src/lib.rs      ← код программы на Anchor (Rust)
│           └── Cargo.toml
└── client/
    ├── src/index.ts            ← Anchor-клиент (TypeScript)
    ├── package.json
    └── tsconfig.json
```

## Результаты деплоя и выполнения в Devnet

| Параметр | Значение |
|---|---|
| **Network** | Solana Devnet |
| **Counter Program ID** | `D93gSKF3Qre9jsF72Ww9sLaVU4e2cW2Mjxebm3x2hcvU` |
| **Deploy Tx Signature** | `48Gvp6p2LzgyykbTLYgcyJmbUwUCnSpzfbhMj3ovwVaauG27MNyvM3cKBr1vdLXBvHK5AczSRHrt8fbMFbvRh4dR` |
| **Program Explorer Link** | https://explorer.solana.com/address/D93gSKF3Qre9jsF72Ww9sLaVU4e2cW2Mjxebm3x2hcvU?cluster=devnet |
| **Initialize Tx** | `48AQZmVduvvUuwHDtFNreR8BGAK7WEMnCcyc7QeXeur4c2ymqQX73U9E8SmyLQkebCwZPqdNAnsqbYqmivXMea98` |
| **Initialize Tx Explorer** | https://explorer.solana.com/tx/48AQZmVduvvUuwHDtFNreR8BGAK7WEMnCcyc7QeXeur4c2ymqQX73U9E8SmyLQkebCwZPqdNAnsqbYqmivXMea98?cluster=devnet |
| **Increment Tx** | `3LFbH8qtbT7j3nyUhEwR6r32Ygkc3ms5ynRTEkcxq9fuB9FXKTrS2qPxGUD8uBNmzxRGMJanqgBDEBYt5NLgywvU` |
| **Increment Tx Explorer** | https://explorer.solana.com/tx/3LFbH8qtbT7j3nyUhEwR6r32Ygkc3ms5ynRTEkcxq9fuB9FXKTrS2qPxGUD8uBNmzxRGMJanqgBDEBYt5NLgywvU?cluster=devnet |
| **Decrement Tx** | `35hums7TuqFVKPmRnHfQ65jvPVqkTjWvvqJKZrK15psCVLTtRQUJ5b4aaCXyBEQrMQf3rZX8xPt7jwvNAdZJEc3J` |
| **Decrement Tx Explorer** | https://explorer.solana.com/tx/35hums7TuqFVKPmRnHfQ65jvPVqkTjWvvqJKZrK15psCVLTtRQUJ5b4aaCXyBEQrMQf3rZX8xPt7jwvNAdZJEc3J?cluster=devnet |

## Команды запуска

### 1. Сборка программы
```bash
cd week5/counter/programs/counter
cargo build-sbf
```

### 2. Деплой программы в Devnet
```bash
solana program deploy target/deploy/counter.so
```

### 3. Запуск взаимодействия через клиент
```bash
cd week5/client
npm install
npx ts-node src/index.ts
```

## Скриншоты для отчёта
1. **Сборка Anchor программы**: консоль с успешным завершением `cargo build-sbf` (`counter.so`).
2. **Деплой в Devnet**: консоль с выводом `solana program deploy` (где отображается Program ID `D93gSKF3Qre9jsF72Ww9sLaVU4e2cW2Mjxebm3x2hcvU`).
3. **Запуск клиента**: консоль с выводом `npx ts-node src/index.ts`, подтверждающая последовательное выполнение `initialize` (count: 0) -> `increment` (count: 1) -> `decrement` (count: 0).
4. **Solana Explorer (Program)**: страница программы `D93gSKF3Qre9jsF72Ww9sLaVU4e2cW2Mjxebm3x2hcvU` в Devnet.
5. **Solana Explorer (Initialize Tx)**: страница транзакции `48AQZmVduvvUuwHDtFNreR8BGAK7WEMnCcyc7QeXeur4c2ymqQX73U9E8SmyLQkebCwZPqdNAnsqbYqmivXMea98`.
6. **Solana Explorer (Increment Tx)**: страница транзакции `3LFbH8qtbT7j3nyUhEwR6r32Ygkc3ms5ynRTEkcxq9fuB9FXKTrS2qPxGUD8uBNmzxRGMJanqgBDEBYt5NLgywvU`.

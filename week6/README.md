# Week 6: Accounts, PDAs и архитектура программ

Создание децентрализованного on-chain профиля пользователя с использованием Program Derived Addresses (PDA) в Solana Devnet.

## Что сделано
- Разработана on-chain программа профиля на Rust с использованием `anchor-lang`:
  - **PDA генерация**: аккаунт профиля вычисляется детерминированно из сидов `["profile", authority.key]`, что гарантирует один уникальный профиль на пользователя без необходимости хранения приватного ключа аккаунта данных.
  - `create_profile`: инициализирует аккаунт профиля, проверяет длину `username` (<= 32) и `bio` (<= 128), сохраняет владельца и канонический `bump`.
  - `update_bio`: обновляет описание профиля с валидацией авторизации владельца (`has_one = authority`).
- Программа скомпилирована в SBPF (`cargo build-sbf`) и задеплоена в сеть Solana Devnet.
- Написан TypeScript-клиент (`@coral-xyz/anchor` + `@solana/web3.js`), вычисляющий PDA через `findProgramAddressSync` и проводящий создание и обновление профиля в реальном блокчейне.

## Структура
```
week6/
├── profile/
│   └── programs/
│       └── profile/
│           ├── src/lib.rs      ← код программы с PDA (Rust)
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
| **Profile Program ID** | `CFqRzR9dPUMhcLYxjFwTyHRocDqe1XEU4rLfGc6uTn7W` |
| **Deploy Tx Signature** | `4Yxp7zecTEHSa4mmi44tBCXoUPQjUUmPAv8Yg8GzDPbANXJYLZTcY31FQyp94MiwSfxVjVsL25ss9EkiVDKE6eJi` |
| **Program Explorer Link** | https://explorer.solana.com/address/CFqRzR9dPUMhcLYxjFwTyHRocDqe1XEU4rLfGc6uTn7W?cluster=devnet |
| **User Profile PDA** | `BipKbzdXpPSFpjEcDCdGDM3Hi9T4xY3LRtGPLZRYRpbf` (bump: 255) |
| **Create Profile Tx** | `iuzE7X6N9uxbaYhLnYoMAtqykDKsgp7KKnqa2HSpwSekXD8LYTd428efjkJhji1tp3szu9Uv6niSD53sZEpUHLs` |
| **Create Profile Tx Link** | https://explorer.solana.com/tx/iuzE7X6N9uxbaYhLnYoMAtqykDKsgp7KKnqa2HSpwSekXD8LYTd428efjkJhji1tp3szu9Uv6niSD53sZEpUHLs?cluster=devnet |
| **Update Bio Tx** | `515WE26qtH3Mngvtk2b7LsJYQBmyG7tq6BrovMsEZEPCw6cxdBJUVshcwqiWQxpz8bwV6FChXgsdKc9tALoLKpo6` |
| **Update Bio Tx Link** | https://explorer.solana.com/tx/515WE26qtH3Mngvtk2b7LsJYQBmyG7tq6BrovMsEZEPCw6cxdBJUVshcwqiWQxpz8bwV6FChXgsdKc9tALoLKpo6?cluster=devnet |

### Логи исполнения транзакции в Devnet:
* Создание профиля: `username: solana_dev`, `bio: Rust & Solana Enthusiast | Web3 Builder`
* Обновление описания: `bio: Certified Solana Developer | Devnet Verified!`

## Команды запуска

### 1. Сборка программы
```bash
cd week6/profile/programs/profile
cargo build-sbf
```

### 2. Деплой программы в Devnet
```bash
solana program deploy target/deploy/profile.so
```

### 3. Запуск клиента
```bash
cd week6/client
npm install
npx ts-node src/index.ts
```

## Скриншоты для отчёта
1. **Сборка PDA программы**: консоль с успешным выполнением `cargo build-sbf` (`profile.so`).
2. **Деплой в Devnet**: консоль с `solana program deploy` (Program ID `CFqRzR9dPUMhcLYxjFwTyHRocDqe1XEU4rLfGc6uTn7W`).
3. **Логи клиента**: консоль с выводом вычисления `Derived Profile PDA`, транзакций создания и обновления профиля.
4. **Solana Explorer (Program)**: страница программы `CFqRzR9dPUMhcLYxjFwTyHRocDqe1XEU4rLfGc6uTn7W`.
5. **Solana Explorer (Profile PDA Account)**: страница PDA-аккаунта `BipKbzdXpPSFpjEcDCdGDM3Hi9T4xY3LRtGPLZRYRpbf` со статусом и данными.
6. **Solana Explorer (Create Profile Tx)**: транзакция `iuzE7X6N9uxbaYhLnYoMAtqykDKsgp7KKnqa2HSpwSekXD8LYTd428efjkJhji1tp3szu9Uv6niSD53sZEpUHLs`.

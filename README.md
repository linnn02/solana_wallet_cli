# Solana Wallet CLI & Learning Modules (Weeks 3–8)

Учебный репозиторий по курсу разработки на Solana.

## Навигация по модулям курса

* **[Week 3: Rust для Solana-разработчика](./)** — базовая CLI-программа кошелька на чистом Rust (исходный код в `src/main.rs`).
* **[Week 4: Первая Solana Program](./week4/)** — разработка и деплой первой программы на Rust (`solana-program`) в сеть Devnet, вызов через TypeScript-клиент.
* **[Week 5: Anchor Framework](./week5/)** — Counter Program на Anchor Framework, деплой в Devnet и клиент взаимодействия на TypeScript.
* **[Week 6: Accounts, PDAs и архитектура программ](./week6/)** — децентрализованный on-chain профиль с использованием Program Derived Addresses (PDA).
* **[Week 7: SPL Tokens и Token Extensions](./week7/)** — собственный токен (Token-2022), расширение Metadata Pointer, выпуск (mint) и перевод (transfer).
* **[Week 8: BUILD SPRINT (Web3 MVP)](./week8/)** — итоговый рабочий Web3 MVP дашборд, объединяющий кошелёк, PDA-профиль и SPL-токены.

---

## Week 3: Solana Wallet CLI

Учебная CLI-программа на Rust, написанная в рамках практического задания "Rust для Solana-разработчика".

Программа запрашивает у пользователя публичный адрес кошелька Solana и баланс в SOL, сохраняет их в структуру и выводит форматированную информацию о кошельке.

### Требования
* Rust 1.80+ (протестировано на `rustc 1.98.1` / `cargo 1.98.1`)

### Стек и конструкции Rust
* **`struct`** — структура `Wallet` для хранения адреса и баланса кошелька.
* **`impl`** — реализация конструктора `new` и методов `get_status` и `display_info`.
* **`String`** — строковый тип для хранения адреса кошелька.
* **`f64`** — число с плавающей точкой для баланса SOL.
* **`if / else`** — проверка баланса и определение статуса кошелька.
* **Функции** — разделение логики ввода (`read_wallet_address`, `read_wallet_balance`).
* **Обработка ввода** — очистка строк (`trim`), обработка ошибок парсинга через `match` и повторный запрос при невалидных данных.

### Сборка и запуск

Запуск программы:
```bash
cargo run
```

Проверка кода:
```bash
cargo check
```

Форматирование:
```bash
cargo fmt
```

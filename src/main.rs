use std::io;

struct Wallet {
    address: String,
    balance: f64,
}

impl Wallet {
    fn new(address: String, balance: f64) -> Self {
        Self { address, balance }
    }

    fn get_status(&self) -> String {
        if self.balance > 0.0 {
            String::from("Wallet has SOL")
        } else if self.balance == 0.0 {
            String::from("Wallet has no SOL (Empty)")
        } else {
            String::from("Negative balance")
        }
    }

    fn display_info(&self) {
        println!("=== Wallet Information ===");
        println!("Address: {}", self.address);
        println!("Balance: {} SOL", self.balance);
        println!("Status: {}", self.get_status());
    }
}

// ввод адреса кошелька
fn read_wallet_address() -> String {
    loop {
        println!("Enter wallet address:");
        let mut input = String::new();

        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read wallet address");

        let trimmed = input.trim().trim_start_matches('\u{feff}');
        if !trimmed.is_empty() {
            return trimmed.to_string();
        }

        println!("Error: Wallet address cannot be empty. Please try again.\n");
    }
}

// ввод баланса с проверкой на число
fn read_wallet_balance() -> f64 {
    loop {
        println!("Enter balance:");
        let mut input = String::new();

        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read balance");

        let trimmed = input.trim().trim_start_matches('\u{feff}');

        match trimmed.parse::<f64>() {
            Ok(value) => {
                if value >= 0.0 {
                    return value;
                } else {
                    println!("Error: Balance cannot be negative. Try again.\n");
                }
            }
            Err(_) => {
                println!("Error: Please enter a valid number (e.g. 0.989920066).\n");
            }
        }
    }
}

fn main() {
    println!("Solana Wallet CLI");

    let address = read_wallet_address();
    println!();

    let balance = read_wallet_balance();
    println!();

    let wallet = Wallet::new(address, balance);
    wallet.display_info();
}

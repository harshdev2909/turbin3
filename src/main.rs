use bs58;
use std::io::{self, BufRead};

fn base58_to_wallet() {
    println!("Input your private key as base58:");
    let stdin = io::stdin();
    let base58 = stdin.lock().lines().next().unwrap().unwrap();
    let wallet = bs58::decode(base58).into_vec().unwrap();
    println!("Your wallet file is:\n{:?}", wallet);
}

fn wallet_to_base58() {
    println!("Input your private key as a wallet file byte array:");
    let stdin = io::stdin();
    let wallet = stdin
        .lock()
        .lines()
        .next()
        .unwrap()
        .unwrap()
        .trim_start_matches('[')
        .trim_end_matches(']')
        .split(',')
        .map(|s| s.trim().parse::<u8>().unwrap())
        .collect::<Vec<u8>>();
    
    let base58 = bs58::encode(wallet).into_string();
    println!("Your private key is:\n{:?}", base58);
}

fn main() {
    println!("Choose an option:");
    println!("1: Convert Base58 to Wallet File");
    println!("2: Convert Wallet File to Base58");

    let mut choice = String::new();
    io::stdin().read_line(&mut choice).unwrap();
    let choice = choice.trim();

    match choice {
        "1" => base58_to_wallet(),
        "2" => wallet_to_base58(),
        _ => println!("Invalid option"),
    }
}

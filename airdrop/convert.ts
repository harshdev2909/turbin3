import fs from "fs";
import bs58 from "bs58";
import promptSync from "prompt-sync";

// Initialize prompt
const prompt = promptSync();
const filePath = "dev-wallet.json"; // Path to wallet JSON file

// Function to load wallet data from the JSON file
function loadWallet(): Uint8Array | null {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(data);
    console.log("Wallet JSON:", json);
    if (!json.wallet || !Array.isArray(json.wallet)) {
      console.error("Invalid wallet format in dev-wallet.json");
      return null;
    }
    
    return new Uint8Array(json.wallet);
  } catch (error) {
    console.error("Error reading wallet file:", error);
    return null;
  }
}

// Convert wallet byte array to Base58
function walletToBase58() {
  const walletBytes = loadWallet();
  if (!walletBytes) return;

  const base58Key = bs58.encode(walletBytes);
  console.log("Base58 Encoded Private Key:", base58Key);
}

// Convert Base58 key to Wallet JSON and save
function base58ToWallet() {
  const base58Key = prompt("Enter your Base58-encoded private key: ");
  try {
    const walletBytes = bs58.decode(base58Key);

    // Save to JSON file
    fs.writeFileSync(filePath, JSON.stringify({ wallet: Array.from(walletBytes) }, null, 2));
    
    console.log("Wallet saved to dev-wallet.json!");
  } catch (error) {
    console.error("Invalid Base58 key. Please check your input.");
  }
}

// Ask the user what they want to do
const choice = prompt("Choose an option: \n1. Convert Base58 to Wallet (Save to File) \n2. Convert Wallet File to Base58\nEnter choice (1/2): ");

if (choice === "1") {
  base58ToWallet();
} else if (choice === "2") {
  walletToBase58();
} else {
  console.log("Invalid choice. Exiting...");
}

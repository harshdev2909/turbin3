import {
    Transaction, SystemProgram, Connection, Keypair,
    LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey
} from
    "@solana/web3.js"
import walletData from './dev-wallet.json';
const wallet = walletData.wallet
const from = Keypair.fromSecretKey(new Uint8Array(wallet));
const to = new PublicKey("2B9vaP3eJoVAVtSbcTQ616yHLRUjNPB4cFeofFqM2kXT");
const connection = new Connection("https://api.devnet.solana.com");
// (async () => {
//     try {
//         const transaction = new Transaction().add(
//             SystemProgram.transfer({
//                 fromPubkey: from.publicKey,
//                 toPubkey: to,
//                 lamports: LAMPORTS_PER_SOL / 100,
//             })
//         );
//         transaction.recentBlockhash = (await
//             connection.getLatestBlockhash('confirmed')).blockhash;
//         transaction.feePayer = from.publicKey;
//         // Sign transaction, broadcast, and confirm
//         const signature = await sendAndConfirmTransaction(
//             connection,
//             transaction,
//             [from]
//         );
//         console.log(`Success! Check out your TX here:
//     https://explorer.solana.com/tx/${signature}?cluster=devnet`);
//     } catch (e) {
//         console.error(`Oops, something went wrong: ${e}`)
//     }
// })();
(async () => {
    try {
        // Get balance of dev wallet
        const balance = await connection.getBalance(from.publicKey)
        // Create a test transaction to calculate fees
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance,
            })
        );
        transaction.recentBlockhash = (await
            connection.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = from.publicKey;

        const fee = (await
            connection.getFeeForMessage(transaction.compileMessage(),
                'confirmed')).value || 0;
        // Remove our transfer instruction to replace it
        transaction.instructions.pop();

        transaction.add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance - fee,
            })
        );
        // Sign transaction, broadcast, and confirm
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        console.log(`Success! Check out your TX here:
    https://explorer.solana.com/tx/${signature}?cluster=devnet`)
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
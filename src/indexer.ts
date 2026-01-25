import { Connection, PublicKey } from '@solana/web3.js';
import { config } from './config';
import { solanaService } from './services/solana.service';
import { databaseService } from './services/database.service';
import { logger } from './utils/logger';

class BlockchainIndexer {
    private connection: Connection;
    private isRunning = false;

    constructor() {
        this.connection = new Connection(config.solana.rpcUrl, config.solana.commitment);
    }

    async start() {
        this.isRunning = true;
        logger.info('Blockchain indexer started');

        // Index all existing territories
        await this.indexAllTerritories();

        // Listen for new transactions
        await this.subscribeToProgram();
    }

    async indexAllTerritories() {
        try {
            logger.info('Indexing all territories...');
            const territories = await solanaService.getAllTerritories();

            // Placeholder loop - actual implementation depends on Anchor response structure
            // for (const territory of territories) {
            //   await this.indexTerritory(territory);
            // }

            logger.info(`Indexed ${territories.length} territories`);
        } catch (error) {
            logger.error('Error indexing territories:', error);
        }
    }

    async indexTerritory(territoryAccount: any) {
        const territory = territoryAccount.account;

        await databaseService.upsertTerritory({
            x_coordinate: territory.x,
            y_coordinate: territory.y,
            nft_mint_address: territory.mintAddress.toString(),
            owner_wallet: territory.owner.toString(),
            block_type: territory.blockType,
            revenue_multiplier: territory.revenueMultiplier / 100,
            metadata_uri: territory.metadataUri,
            visual_config: territory.visualConfig,
        });

        // Upsert player
        await databaseService.upsertPlayer(territory.owner.toString(), {
            username: null,
        });
    }

    async subscribeToProgram() {
        if (!config.solana.programId) {
            logger.warn('Program ID not set, skipping subscription');
            return;
        }
        const programId = new PublicKey(config.solana.programId);

        this.connection.onLogs(
            programId,
            async (logs, ctx) => {
                try {
                    await this.processTransaction(logs.signature);
                } catch (error) {
                    logger.error('Error processing transaction:', error);
                }
            },
            config.solana.commitment
        );

        logger.info('Subscribed to program logs');
    }

    async processTransaction(signature: string) {
        logger.info(`Processing transaction: ${signature}`);

        const tx = await this.connection.getParsedTransaction(signature, {
            maxSupportedTransactionVersion: 0,
        });

        if (!tx) {
            logger.warn(`Transaction not found: ${signature}`);
            return;
        }

        // Parse logs to determine event type
        const logs = tx.meta?.logMessages || [];

        // Handle different event types
        if (logs.some(log => log.includes('Territory minted'))) {
            await this.handleTerritoryMint(tx);
        } else if (logs.some(log => log.includes('Territory transferred'))) {
            await this.handleTerritoryTransfer(tx);
        } else if (logs.some(log => log.includes('Battle initiated'))) {
            await this.handleBattleInitiated(tx);
        } else if (logs.some(log => log.includes('Battle resolved'))) {
            await this.handleBattleResolved(tx);
        }

        // Record transaction
        await databaseService.recordTransaction({
            transaction_signature: signature,
            transaction_type: this.getTransactionType(logs),
            block_time: new Date(tx.blockTime! * 1000),
            processed: true,
        });
    }

    async handleTerritoryMint(tx: any) {
        // Extract territory data from transaction and index it
        logger.info('Handling territory mint');
        // Implementation here
    }

    async handleTerritoryTransfer(tx: any) {
        logger.info('Handling territory transfer');
        // Implementation here
    }

    async handleBattleInitiated(tx: any) {
        logger.info('Handling battle initiation');
        // Implementation here
    }

    async handleBattleResolved(tx: any) {
        logger.info('Handling battle resolution');
        // Implementation here
    }

    getTransactionType(logs: string[]): string {
        if (logs.some(log => log.includes('Territory minted'))) return 'mint';
        if (logs.some(log => log.includes('Territory transferred'))) return 'transfer';
        if (logs.some(log => log.includes('Battle'))) return 'battle';
        return 'unknown';
    }

    stop() {
        this.isRunning = false;
        logger.info('Blockchain indexer stopped');
    }
}

// Start indexer if run directly
if (require.main === module) {
    const indexer = new BlockchainIndexer();
    indexer.start();

    // Graceful shutdown
    process.on('SIGINT', () => {
        indexer.stop();
        process.exit(0);
    });
}

export default BlockchainIndexer;

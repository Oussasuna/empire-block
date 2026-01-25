import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';
// import type { Database } from '../types/database.types'; // TODO: Generate types

export class DatabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            config.supabase.url,
            config.supabase.serviceKey
        );
    }

    // Players
    async upsertPlayer(wallet: string, data: any) {
        return await this.supabase
            .from('players')
            .upsert({
                wallet_address: wallet,
                ...data,
            })
            .select()
            .single();
    }

    async getPlayer(wallet: string) {
        return await this.supabase
            .from('players')
            .select('*')
            .eq('wallet_address', wallet)
            .single();
    }

    // Territories
    async upsertTerritory(data: any) {
        return await this.supabase
            .from('territories')
            .upsert(data)
            .select()
            .single();
    }

    async getTerritory(x: number, y: number) {
        return await this.supabase
            .from('territories')
            .select('*')
            .eq('x_coordinate', x)
            .eq('y_coordinate', y)
            .single();
    }

    async getAllTerritories() {
        return await this.supabase
            .from('territories')
            .select('*')
            .order('x_coordinate')
            .order('y_coordinate');
    }

    async getPlayerTerritories(wallet: string) {
        return await this.supabase
            .from('territories')
            .select('*')
            .eq('owner_wallet', wallet);
    }

    // Battles
    async createBattle(data: any) {
        return await this.supabase
            .from('battles')
            .insert(data)
            .select()
            .single();
    }

    async updateBattle(battleId: number, data: any) {
        return await this.supabase
            .from('battles')
            .update(data)
            .eq('battle_id', battleId)
            .select()
            .single();
    }

    async getActiveBattles(wallet: string) {
        return await this.supabase
            .from('battles')
            .select('*')
            .or(`attacker_wallet.eq.${wallet},defender_wallet.eq.${wallet}`)
            .in('battle_status', ['pending', 'active'])
            .order('initiated_at', { ascending: false });
    }

    // Marketplace
    async createListing(data: any) {
        return await this.supabase
            .from('marketplace_listings')
            .insert(data)
            .select()
            .single();
    }

    async getActiveListings() {
        return await this.supabase
            .from('marketplace_listings')
            .select('*, territories(*)')
            .eq('active', true)
            .order('created_at', { ascending: false });
    }

    // Transactions
    async recordTransaction(data: any) {
        return await this.supabase
            .from('transactions')
            .insert(data)
            .select()
            .single();
    }

    // Activity Log
    async createActivity(wallet: string, type: string, description: string, metadata?: any) {
        return await this.supabase
            .from('activity_log')
            .insert({
                wallet_address: wallet,
                activity_type: type,
                description,
                metadata,
            });
    }
}

export const databaseService = new DatabaseService();

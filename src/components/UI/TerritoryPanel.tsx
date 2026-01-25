'use client';

import { Territory } from '@/hooks/useGrid';

interface TerritoryPanelProps {
    territory: Territory;
    onClose: () => void;
    onMint: () => void;
    onBattle: () => void;
}

export default function TerritoryPanel({ territory, onClose, onMint, onBattle }: TerritoryPanelProps) {
    return (
        <div className="absolute top-4 right-4 bg-gray-900/90 text-white p-6 rounded-xl border border-gray-700 backdrop-blur-md w-80 shadow-2xl z-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Territory ({territory.x_coordinate}, {territory.y_coordinate})
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    ✕
                </button>
            </div>

            <div className="space-y-4">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Type</span>
                        <span className="font-medium capitalize text-blue-300">
                            {territory.block_type}
                        </span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Multiplier</span>
                        <span className="font-medium text-yellow-400">
                            {territory.revenue_multiplier}x
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Owner</span>
                        <span className="font-mono text-sm truncate max-w-[120px]" title={territory.owner_wallet || 'Unclaimed'}>
                            {territory.owner_wallet ? `${territory.owner_wallet.slice(0, 4)}...${territory.owner_wallet.slice(-4)}` : 'Unclaimed'}
                        </span>
                    </div>
                </div>

                {!territory.owner_wallet ? (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Mint Price</span>
                            <span className="font-bold text-green-400 text-lg">2.5 SOL</span>
                        </div>
                        <button
                            onClick={onMint}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg font-bold hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-900/20"
                        >
                            Mint Territory
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onBattle}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 py-3 rounded-lg font-bold hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-lg shadow-red-900/20"
                    >
                        Attack Territory
                    </button>
                )}
            </div>
        </div>
    );
}

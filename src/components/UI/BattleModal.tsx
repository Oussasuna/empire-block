'use client';

import { useState } from 'react';
import { Territory } from '@/hooks/useGrid';

interface BattleModalProps {
    attacker: Territory;
    defender: Territory;
    onClose: () => void;
    onConfirm: (stake: number) => void;
}

export default function BattleModal({ attacker, defender, onClose, onConfirm }: BattleModalProps) {
    const [stake, setStake] = useState(10);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gray-900 text-white p-8 rounded-2xl border border-red-900/50 w-full max-w-md shadow-2xl relative overflow-hidden">
                {/* Background effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600"></div>

                <h2 className="text-3xl font-bold text-center mb-6 text-red-500 tracking-wider uppercase">
                    Battle Declaration
                </h2>

                <div className="flex justify-between items-center mb-8 relative">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mb-2 mx-auto border-2 border-blue-500">
                            <span className="font-bold text-xl">YOU</span>
                        </div>
                        <p className="text-sm text-gray-400">({attacker.x_coordinate}, {attacker.y_coordinate})</p>
                    </div>

                    <div className="text-2xl font-black text-red-500 italic">VS</div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mb-2 mx-auto border-2 border-red-500">
                            <span className="font-bold text-xl">FOE</span>
                        </div>
                        <p className="text-sm text-gray-400">({defender.x_coordinate}, {defender.y_coordinate})</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-xl mb-6 border border-gray-700">
                    <label className="block text-sm text-gray-400 mb-2">Stake Amount ($EMPIRE)</label>
                    <input
                        type="number"
                        value={stake}
                        onChange={(e) => setStake(Number(e.target.value))}
                        className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-xl font-mono focus:border-red-500 focus:outline-none transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-2">Minimum stake: 10 $EMPIRE</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-lg font-bold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(stake)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 py-3 rounded-lg font-bold hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-lg shadow-red-900/20"
                    >
                        INITIATE BATTLE
                    </button>
                </div>
            </div>
        </div>
    );
}

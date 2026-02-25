'use client';

import { Inter, Montserrat, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { WalletContextProvider } from '@/lib/solana/wallet';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable} font-sans bg-black text-white`}>
                <WalletContextProvider>
                    {/* Persistent ambient star-field / background glows */}
                    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                        {/* Top-left purple glow */}
                        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[140px] rounded-full" />
                        {/* Bottom-right cyan glow */}
                        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/15 blur-[140px] rounded-full" />
                    </div>

                    <div className="relative z-10 min-h-screen flex flex-col">
                        {children}
                    </div>

                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            style: {
                                background: 'rgba(5, 5, 8, 0.95)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#fff',
                                backdropFilter: 'blur(16px)',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10B981',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </WalletContextProvider>
            </body>
        </html>
    );
}

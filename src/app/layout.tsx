'use client';

import { Inter, Montserrat, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { WalletContextProvider } from '@/lib/solana/wallet';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import GameTutorial from '@/components/Tutorial/GameTutorial';
import MarketplacePanel from '@/components/Marketplace/MarketplacePanel';
import AnimatedPage from '@/components/UI/AnimatedPage';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);

    return (
        <html lang="en">
            <body className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable} font-sans bg-background text-white`}>
                <WalletContextProvider>
                    <div className="relative min-h-screen w-full flex flex-col">
                        {/* Ambient Background Effects */}
                        <div className="fixed inset-0 pointer-events-none z-0">
                            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full mix-blend-screen" />
                            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full mix-blend-screen" />
                        </div>

                        <Header onOpenMarketplace={() => setIsMarketplaceOpen(true)} />

                        <main className="relative z-10 flex-1 pt-16">
                            <AnimatedPage>
                                {children}
                            </AnimatedPage>
                        </main>

                        {/* Footer */}
                        <Footer />

                        <GameTutorial />
                        <MarketplacePanel isOpen={isMarketplaceOpen} onClose={() => setIsMarketplaceOpen(false)} />
                        <Toaster
                            position="bottom-right"
                            toastOptions={{
                                style: {
                                    background: 'rgba(10, 14, 39, 0.9)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#fff',
                                    backdropFilter: 'blur(10px)',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#10B981',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                    </div>
                </WalletContextProvider>
            </body>
        </html>
    );
}

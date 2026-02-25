'use client';

import React from 'react';
import Link from 'next/link';
import s from './docs.module.css';

export default function DocsPage() {
    return (
        <div style={{ background: '#06060a', color: '#ffffff', fontFamily: "'Inter', sans-serif", minHeight: '100vh' }}>
            {/* Background Effects */}
            <div className={s.bgGrid} />
            <div className={`${s.bgGlow} ${s.bgGlow1}`} />
            <div className={`${s.bgGlow} ${s.bgGlow2}`} />

            {/* Header */}
            <header className={s.header}>
                <div className={s.headerContent}>
                    <Link href="/" className={s.backLink}>← Back to Game</Link>
                    <div className={s.headerBadge}>LIVE ON SOLANA</div>
                </div>
            </header>

            {/* Main Content */}
            <main className={s.mainContainer}>
                {/* Hero */}
                <div className={s.hero}>
                    <div className={s.heroLabel}>📖 Documentation • <span>v4.0</span></div>
                    <h1 className={s.heroTitle}>Game Guide</h1>
                    <p className={s.heroSubtitle}>Everything you need to know about conquering the 50×50 grid, battling for territory, and earning rewards.</p>
                    <div className={s.statsBar}>
                        <div className={s.statItem}><div className={s.statValue}>2,500</div><div className={s.statLabel}>Territories</div></div>
                        <div className={s.statItem}><div className={s.statValue}>50×50</div><div className={s.statLabel}>Grid Size</div></div>
                        <div className={s.statItem}><div className={s.statValue}>0.025</div><div className={s.statLabel}>SOL to Mint</div></div>
                        <div className={s.statItem}><div className={s.statValue}>$EMPIRE</div><div className={s.statLabel}>Token</div></div>
                    </div>
                </div>

                {/* Table of Contents */}
                <nav className={s.toc}>
                    <div className={s.tocHeader}>
                        <div className={s.tocIcon}>📑</div>
                        <div className={s.tocTitle}>Contents</div>
                    </div>
                    <div className={s.tocGrid}>
                        {[
                            ['#overview', '1', 'Overview'],
                            ['#minting', '2', 'Minting Process'],
                            ['#territories', '3', 'Territory Types'],
                            ['#levels', '4', 'Level System'],
                            ['#battle', '5', 'Battle System'],
                            ['#freeze', '6', 'Freeze Mechanic'],
                            ['#leaderboard', '7', 'Leaderboard'],
                            ['#prizes', '8', 'Prize Pool'],
                            ['#revenue', '9', 'Revenue Sharing'],
                        ].map(([href, num, label]) => (
                            <a key={num} href={href} className={s.tocItem}>
                                <span className={s.tocNumber}>{num}</span>{label}
                            </a>
                        ))}
                    </div>
                </nav>

                {/* Section 1: Overview */}
                <section className={s.section} id="overview">
                    <div className={s.sectionHeader}>
                        <div className={`${s.sectionIcon} ${s.sectionIconPurple}`}>🏰</div>
                        <h2 className={s.sectionTitle}>Overview</h2>
                    </div>
                    <p className={s.sectionContent}>
                        Empire Blocks is a territory conquest game built on <span className={s.highlight}>Solana</span>. The game features a <span className={s.highlight}>50×50 grid</span> of 2,500 squares that players can buy, customize, and battle over.
                    </p>
                    <p className={s.sectionContent}>
                        Each square can display an image of your choice, making it perfect for advertising, art showcases, or simply claiming your territory. The game uses <span className={s.highlightGreen}>$EMPIRE tokens</span> for upgrades and rewards.
                    </p>
                    <div className={`${s.alert} ${s.alertStrategy}`}>
                        <div className={s.alertIcon}>⚔️</div>
                        <div className={s.alertContent}>
                            <h4>PURE STRATEGY</h4>
                            <p>No staking, no betting. Battles are 100% skill-based. Win = take territory. Lose = get frozen 1 hour. Simple and fair!</p>
                        </div>
                    </div>
                    <div className={`${s.card} ${s.cardGlowPurple}`}>
                        <div className={s.cardHeader}><span className={`${s.cardBadge} ${s.badgePurple}`}>Key Features</span></div>
                        <ul className={s.featureList}>
                            <li>Buy and own squares on the grid</li>
                            <li>Upload custom images to display</li>
                            <li>Use visual effects to stand out</li>
                            <li>Battle other players for their squares</li>
                            <li>Earn rewards from battles and protocol revenue</li>
                            <li>Weekly Prize Pool for top players</li>
                        </ul>
                    </div>
                </section>

                <div className={s.divider} />

                {/* Section 2: Minting */}
                <section className={s.section} id="minting">
                    <div className={s.sectionHeader}>
                        <div className={`${s.sectionIcon} ${s.sectionIconGreen}`}>🎨</div>
                        <h2 className={s.sectionTitle}>Minting Process</h2>
                    </div>
                    <p className={s.sectionContent}>
                        When you mint a territory, you upload <span className={s.highlight}>YOUR picture</span>. This picture will show on the territory on the map. When you conquer more territories, your picture spreads across the grid!
                    </p>
                    <div className={`${s.card} ${s.cardGlowGreen}`}>
                        <div className={s.cardHeader}><span className={`${s.cardBadge} ${s.badgeGreen}`}>How to Mint</span></div>
                        <div className={s.stepsContainer}>
                            {[
                                ['Select Territory', 'Click on an unclaimed territory on the grid'],
                                ['Upload Picture', 'Upload your image (PNG, JPG, GIF - max 5MB)'],
                                ['Pay Mint Fee', 'Pay 0.025 SOL mint fee'],
                                ['Confirm Transaction', 'Confirm transaction in your wallet'],
                                ['Territory is Yours!', 'Random rarity assigned - you might get a rare Corner!'],
                            ].map(([title, desc], i) => (
                                <div key={i} className={s.step}>
                                    <div className={s.stepNumber}>{i + 1}</div>
                                    <div><div className={s.stepTitle}>{title}</div><div className={s.stepDesc}>{desc}</div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={s.subsection}><h3 className={s.subsectionTitle}>Mint Fee Distribution</h3></div>
                    <div className={s.tableContainer}>
                        <table className={s.dataTable}>
                            <thead><tr><th>Recipient</th><th>Percentage</th><th>Amount</th></tr></thead>
                            <tbody>
                                <tr><td>Treasury</td><td className={s.tableHighlightPurple}>80%</td><td>0.020 SOL</td></tr>
                                <tr><td>Prize Pool</td><td>6%</td><td>0.0015 SOL</td></tr>
                                <tr><td>Burn/Buyback</td><td>4%</td><td>0.001 SOL</td></tr>
                                <tr><td>Revenue Share (Owners)</td><td className={s.tableHighlight}>4%</td><td>0.001 SOL</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className={s.divider} />

                {/* Section 3: Territory Types */}
                <section className={s.section} id="territories">
                    <div className={s.sectionHeader}>
                        <div className={`${s.sectionIcon} ${s.sectionIconYellow}`}>🗺️</div>
                        <h2 className={s.sectionTitle}>Territory Types</h2>
                    </div>
                    <p className={s.sectionContent}>
                        When you mint, you get a <span className={s.highlightGreen}>RANDOM territory type</span>! This makes minting exciting - you might get a rare Corner territory with the best bonuses!
                    </p>
                    <div className={`${s.card} ${s.cardGlowPurple}`}>
                        <div className={s.cardHeader}><span className={`${s.cardBadge} ${s.badgeYellow}`}>Random Rarity Chances</span></div>
                        <div className={s.tableContainer}>
                            <table className={s.dataTable}>
                                <thead><tr><th>Territory Type</th><th>Chance</th><th>Power Bonus</th><th>Revenue Multi</th></tr></thead>
                                <tbody>
                                    <tr><td>Standard</td><td>50%</td><td>+0</td><td>1.0x</td></tr>
                                    <tr><td>Border</td><td>30%</td><td className={s.tableHighlight}>+5</td><td>1.2x</td></tr>
                                    <tr><td>Capital</td><td>15%</td><td className={s.tableHighlight}>+15</td><td>2.5x</td></tr>
                                    <tr><td><span className={`${s.badge} ${s.inlineBadgeYellow}`}>RARE!</span> Corner</td><td className={s.tableHighlightYellow}>5%</td><td className={s.tableHighlightYellow}>+20</td><td className={s.tableHighlightYellow}>3.0x</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={`${s.alert} ${s.alertWarning}`}>
                        <div className={s.alertIcon}>⭐</div>
                        <div className={s.alertContent}>
                            <h4>Corner Territories</h4>
                            <p>Corner territories are RARE (only 5% chance) but give the BEST bonuses! +20 power bonus and 3.0x revenue multiplier. Lucky if you get one!</p>
                        </div>
                    </div>
                </section>

                <div className={s.divider} />

                {/* Section 4: Level System */}
                <section className={s.section} id="levels">
                    <div className={s.sectionHeader}>
                        <div className={`${s.sectionIcon} ${s.sectionIconBlue}`}>⬆️</div>
                        <h2 className={s.sectionTitle}>Level System</h2>
                    </div>
                    <p className={s.sectionContent}>Upgrade your territory with <span className={s.highlightGreen}>$EMPIRE tokens</span> to make it stronger! Higher level = more power in battles + more revenue share.</p>
                    <div className={s.subsection}><h3 className={s.subsectionTitle}>Level Power</h3></div>
                    <div className={s.tableContainer}>
                        <table className={s.dataTable}>
                            <thead><tr><th>Level</th><th>Stars</th><th>Power</th><th>Description</th></tr></thead>
                            <tbody>
                                <tr><td>Level 1</td><td className={s.stars}>⭐</td><td>10</td><td>Starting level</td></tr>
                                <tr><td>Level 2</td><td className={s.stars}>⭐⭐</td><td>20</td><td>Basic upgrade</td></tr>
                                <tr><td>Level 3</td><td className={s.stars}>⭐⭐⭐</td><td>35</td><td>Getting stronger</td></tr>
                                <tr><td>Level 4</td><td className={s.stars}>⭐⭐⭐⭐</td><td>55</td><td>Very strong</td></tr>
                                <tr><td>Level 5</td><td className={s.stars}>⭐⭐⭐⭐⭐</td><td className={s.tableHighlightYellow}>80</td><td><span className={`${s.badge} ${s.inlineBadgeYellow}`}>MAXIMUM!</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={s.subsection}><h3 className={s.subsectionTitle}>Upgrade Costs (in $EMPIRE TOKENS)</h3></div>
                    <div className={s.tableContainer}>
                        <table className={s.dataTable}>
                            <thead><tr><th>Upgrade</th><th>Cost (USD value)</th><th>Power Gain</th></tr></thead>
                            <tbody>
                                <tr><td>Level 1 → 2</td><td>$5 worth of tokens</td><td className={s.tableHighlight}>+10 power</td></tr>
                                <tr><td>Level 2 → 3</td><td>$10 worth of tokens</td><td className={s.tableHighlight}>+15 power</td></tr>
                                <tr><td>Level 3 → 4</td><td>$20 worth of tokens</td><td className={s.tableHighlight}>+20 power</td></tr>
                                <tr><td>Level 4 → 5</td><td>$40 worth of tokens</td><td className={s.tableHighlight}>+25 power</td></tr>
                                <tr><td><strong>TOTAL to MAX</strong></td><td><strong>$75 worth of tokens</strong></td><td className={s.tableHighlightYellow}><strong>+70 power</strong></td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={`${s.card} ${s.cardGlowPurple}`}>
                        <div className={s.cardHeader}><span className={`${s.cardBadge} ${s.badgeBlue}`}>Where Upgrade Tokens Go</span></div>
                        <div className={s.tableContainer}>
                            <table className={s.dataTable}>
                                <tbody>
                                    <tr><td>Prize Pool</td><td className={s.tableHighlight}>30%</td></tr>
                                    <tr><td>Burn (deflation)</td><td>30%</td></tr>
                                    <tr><td>Treasury</td><td>20%</td></tr>
                                    <tr><td>Genesis Owner</td><td>10%</td></tr>
                                    <tr><td>Revenue Share (Owners)</td><td className={s.tableHighlight}>10%</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <div className={s.divider} />

                {/* Section 5: Battle System */}
                <section className={s.section} id="battle">
                    <div className={s.sectionHeader}>
                        <div className={`${s.sectionIcon} ${s.sectionIconRed}`}>⚔️</div>
                        <h2 className={s.sectionTitle}>Battle System</h2>
                    </div>
                    <div className={`${s.alert} ${s.alertStrategy}`}>
                        <div className={s.alertIcon}>🎯</div>
                        <div className={s.alertContent}>
                            <h4>NO STAKING • NO BETTING • PURE SKILL</h4>
                            <p>When you attack, you DON&apos;T know if you will win or lose! Just click BATTLE and watch what happens. It&apos;s exciting and skill-based - strategize your attacks wisely!</p>
                        </div>
                    </div>
                    <div className={`${s.card} ${s.cardGlowPurple}`}>
                        <div className={s.cardHeader}><span className={`${s.cardBadge} ${s.badgeRed}`}>How Battles Work</span></div>
                        <div className={s.stepsContainer}>
                            {[
                                'Select an enemy territory adjacent to yours',
                                <span key="fee">Pay <span className={s.tableHighlightYellow}>0.01 SOL</span> battle fee</span>,
                                'Click "BATTLE" button',
                                'Watch the battle animation',
                                <span key="result">Result revealed: <span className={s.textGreen}>WIN</span> or <span className={s.textRed}>LOSE!</span></span>,
                            ].map((desc, i) => (
                                <div key={i} className={s.step}>
                                    <div className={s.stepNumber}>{i + 1}</div>
                                    <div><div className={s.stepDesc}>{desc}</div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={s.subsection}><h3 className={s.subsectionTitle}>Power Calculation (Hidden)</h3></div>
                    <div className={s.codeBlock}>Total Power = Level Power + Type Bonus + Adjacent Bonus</div>
                    <div className={s.tableContainer}>
                        <table className={s.dataTable}>
                            <thead><tr><th>Bonus Type</th><th>Value</th></tr></thead>
                            <tbody>
                                <tr><td>Level Power</td><td>10 / 20 / 35 / 55 / 80 (Level 1-5)</td></tr>
                                <tr><td>Type Bonus</td><td>Standard +0, Border +5, Capital +15, Corner +20</td></tr>
                                <tr><td>Adjacent Bonus</td><td className={s.tableHighlight}>+3 per adjacent territory you own (max +12)</td></tr>
                                <tr><td>Defender Bonus</td><td className={s.tableHighlightPurple}>+10 (defender always gets this)</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={s.subsection}><h3 className={s.subsectionTitle}>Battle Outcomes</h3></div>
                    <div className={s.outcomesGrid}>
                        <div className={`${s.outcomeCard} ${s.outcomeWin}`}>
                            <div className={s.outcomeHeader}><span className={s.outcomeIcon}>✅</span><span className={s.outcomeTitleWin}>ATTACKER WINS</span></div>
                            <ul className={s.outcomeList}>
                                <li>• Takes ownership of enemy territory</li>
                                <li>• Your picture replaces their picture</li>
                                <li>• +1 Win on Leaderboard</li>
                                <li>• Territory keeps its level (you benefit!)</li>
                            </ul>
                        </div>
                        <div className={`${s.outcomeCard} ${s.outcomeLose}`}>
                            <div className={s.outcomeHeader}><span className={s.outcomeIcon}>❌</span><span className={s.outcomeTitleLose}>ATTACKER LOSES</span></div>
                            <ul className={s.outcomeList}>
                                <li>• Your territory is FROZEN for 1 hour</li>
                                <li>• Cannot attack or be attacked while frozen</li>
                                <li>• +1 Loss on record</li>
                                <li>• No tokens lost!</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <div className={s.divider} />

                {/* Section 6: Freeze Mechanic */}
                <section className={s.section} id="freeze">
                    <div className={s.sectionHeader}>
                        <div className={`${s.sectionIcon} ${s.sectionIconBlue}`}>❄️</div>
                        <h2 className={s.sectionTitle}>Freeze Mechanic</h2>
                    </div>
                    <p className={s.sectionContent}>When you <span className={s.textRed}>LOSE</span> a battle, your attacking territory gets <span className={s.textBlue}>FROZEN for 1 hour!</span></p>
                    <div className={`${s.card} ${s.cardGlowPurple}`}>
                        <div className={s.cardHeader}><span className={`${s.cardBadge} ${s.badgeBlue}`}>What is Freeze?</span></div>
                        <ul className={s.featureList}>
                            <li>Frozen territory shows a SNOWFLAKE icon ❄️ on the map</li>
                            <li>Cannot attack from a frozen territory</li>
                            <li>Cannot be attacked while frozen (you&apos;re protected!)</li>
                            <li>Freeze lasts exactly 1 hour</li>
                            <li>Timer shows remaining freeze time</li>
                            <li>After 1 hour, territory unfreezes automatically</li>
                        </ul>
                    </div>
                    <div className={s.subsection}><h3 className={s.subsectionTitle}>Why Freeze Instead of Token Loss?</h3></div>
                    <ul className={s.featureList}>
                        <li><strong className={s.textGreen}>Fair Play</strong> - No tokens risked in battles</li>
                        <li>Still meaningful consequences for losing</li>
                        <li>Protects losers from chain attacks</li>
                        <li>Makes you think before attacking</li>
                        <li>Time-based penalty instead of financial penalty</li>
                    </ul>
                    <div className={s.tableContainer}>
                        <table className={s.dataTable}>
                            <thead><tr><th>Status</th><th>Visual</th><th>Can Attack?</th><th>Can Be Attacked?</th></tr></thead>
                            <tbody>
                                <tr><td><span className={`${s.badge} ${s.inlineBadgeGreen}`}>Normal</span></td><td>Your picture</td><td className={s.tableHighlight}>YES</td><td className={s.tableHighlight}>YES</td></tr>
                                <tr><td><span className={`${s.badge} ${s.inlineBadgeBlue}`}>Frozen</span></td><td>❄️ + Timer</td><td className={s.textRed}>NO</td><td className={s.tableHighlight}>NO (Protected)</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className={s.divider} />

                {/* Section 7: Leaderboard */}
                <section className={s.section} id="leaderboard">
                    <div className={s.sectionHeader}>
                        <div className={`${s.sectionIcon} ${s.sectionIconYellow}`}>🏆</div>
                        <h2 className={s.sectionTitle}>Leaderboard &amp; Champion</h2>
                    </div>
                    <p className={s.sectionContent}>Compete to be the <span className={s.highlight}>TOP PLAYER!</span> Your picture shows on all your territories - dominate the map and everyone sees your face everywhere!</p>
                    <div className={`${s.card} ${s.cardGlowPurple}`}>
                        <div className={s.cardHeader}><span className={`${s.cardBadge} ${s.badgeYellow}`}>Leaderboard Categories</span></div>
                        <div className={s.tableContainer}>
                            <table className={s.dataTable}>
                                <thead><tr><th>Category</th><th>How to Rank</th><th>Resets?</th></tr></thead>
                                <tbody>
                                    <tr><td>🏆 Top Conquerors</td><td>Most battle wins this week</td><td className={s.tableHighlightYellow}>Every Sunday</td></tr>
                                    <tr><td>🗺️ Biggest Empires</td><td>Most territories owned</td><td>Never</td></tr>
                                    <tr><td>🔥 Win Streak</td><td>Consecutive wins without losing</td><td>When you lose</td></tr>
                                    <tr><td>⚡ Most Powerful</td><td>Total power of all territories</td><td>Never</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={s.subsection}><h3 className={s.subsectionTitle}>Champion Display on Map</h3></div>
                    <ul className={s.featureList}>
                        <li>Your picture shows on ALL territories you own</li>
                        <li>Win battles = your picture spreads to new territories</li>
                        <li>Top player gets 👑 crown icon next to their name</li>
                        <li>Featured on homepage as &quot;Emperor of the Week&quot;</li>
                        <li>Special golden border on all their territories</li>
                    </ul>
                </section>

                <div className={s.divider} />

                {/* Section 8: Prize Pool */}
                <section className={s.section} id="prizes">
                    <div className={s.sectionHeader}>
                        <div className={`${s.sectionIcon} ${s.sectionIconGreen}`}>💰</div>
                        <h2 className={s.sectionTitle}>Prize Pool System</h2>
                    </div>
                    <p className={s.sectionContent}>Top players win <span className={s.highlightGreen}>REAL TOKEN rewards</span> from the Prize Pool every week!</p>
                    <div className={s.subsection}><h3 className={s.subsectionTitle}>Weekly Prize Distribution</h3></div>
                    <p className={s.sectionContent}>Every Sunday, the Prize Pool is distributed to TOP 10 players on the Weekly Conqueror leaderboard:</p>
                    <div className={s.prizeList}>
                        <div className={`${s.prizeItem} ${s.prizeGold}`}><div className={s.prizeRank}>🥇</div><div className={s.prizeInfo}><div className={s.prizePlace}>1st Place</div></div><div className={s.prizePercent}>30%</div></div>
                        <div className={`${s.prizeItem} ${s.prizeSilver}`}><div className={s.prizeRank}>🥈</div><div className={s.prizeInfo}><div className={s.prizePlace}>2nd Place</div></div><div className={s.prizePercent}>20%</div></div>
                        <div className={`${s.prizeItem} ${s.prizeBronze}`}><div className={s.prizeRank}>🥉</div><div className={s.prizeInfo}><div className={s.prizePlace}>3rd Place</div></div><div className={s.prizePercent}>15%</div></div>
                        <div className={s.prizeItem}><div className={s.prizeRank}>4</div><div className={s.prizeInfo}><div className={s.prizePlace}>4th Place</div></div><div className={s.prizePercent}>10%</div></div>
                        <div className={s.prizeItem}><div className={s.prizeRank}>5</div><div className={s.prizeInfo}><div className={s.prizePlace}>5th Place</div></div><div className={s.prizePercent}>7%</div></div>
                        <div className={s.prizeItem}><div className={s.prizeRank}>6-10</div><div className={s.prizeInfo}><div className={s.prizePlace}>6th - 10th Place</div></div><div className={s.prizePercent}>3% each</div></div>
                    </div>
                    <div className={`${s.card} ${s.cardGlowGreen}`}>
                        <div className={s.cardHeader}><span className={`${s.cardBadge} ${s.badgeGreen}`}>How to Win Prizes</span></div>
                        <ul className={s.featureList}>
                            <li>Win battles to climb the Weekly Conqueror leaderboard</li>
                            <li>More wins = higher rank = bigger prize share</li>
                            <li>Top 10 players at end of week win prizes</li>
                            <li>Prizes automatically sent to your wallet</li>
                            <li>New week starts fresh - everyone has a chance!</li>
                        </ul>
                    </div>
                </section>

                <div className={s.divider} />

                {/* Section 9: Revenue Sharing */}
                <section className={s.section} id="revenue">
                    <div className={s.sectionHeader}>
                        <div className={`${s.sectionIcon} ${s.sectionIconPurple}`}>📈</div>
                        <h2 className={s.sectionTitle}>Revenue Sharing</h2>
                    </div>
                    <div className={`${s.alert} ${s.alertInfo}`}>
                        <div className={s.alertIcon}>💰</div>
                        <div className={s.alertContent}>
                            <h4>PASSIVE INCOME</h4>
                            <p>Territory owners get passive income from ALL game activities! Just own a territory and earn money daily, automatically to your wallet.</p>
                        </div>
                    </div>
                    <div className={s.subsection}><h3 className={s.subsectionTitle}>Revenue Sources</h3></div>
                    <div className={s.tableContainer}>
                        <table className={s.dataTable}>
                            <thead><tr><th>Source</th><th>% to Owners</th><th>Per Transaction</th></tr></thead>
                            <tbody>
                                <tr><td>Mint (0.025 SOL)</td><td className={s.tableHighlight}>4%</td><td>0.001 SOL</td></tr>
                                <tr><td>Upgrades ($5-$40)</td><td className={s.tableHighlight}>10%</td><td>$0.50 - $4.00</td></tr>
                                <tr><td>Marketplace (10% fee)</td><td className={s.tableHighlight}>10% of fee</td><td>Varies by sale</td></tr>
                                <tr><td>Customization ($5)</td><td className={s.tableHighlight}>10%</td><td>$0.50</td></tr>
                                <tr><td>Battle (0.01 SOL)</td><td className={s.tableHighlightYellow}>20%</td><td>0.002 SOL</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={`${s.card} ${s.cardGlowPurple}`}>
                        <div className={s.cardHeader}><span className={`${s.cardBadge} ${s.badgePurple}`}>How Distribution Works</span></div>
                        <div className={s.tableContainer}>
                            <table className={s.dataTable}>
                                <tbody>
                                    <tr><td>Frequency</td><td className={s.tableHighlight}>DAILY</td></tr>
                                    <tr><td>Delivery</td><td>Automatic to wallet</td></tr>
                                    <tr><td>Minimum Claim</td><td className={s.tableHighlight}>No minimum</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={s.subsection}><h3 className={s.subsectionTitle}>Level Weight Bonus</h3></div>
                    <p className={s.sectionContent}>Your share depends on your territory LEVEL. Higher level = MORE money!</p>
                    <div className={s.tableContainer}>
                        <table className={s.dataTable}>
                            <thead><tr><th>Level</th><th>Multiplier</th><th>What It Means</th></tr></thead>
                            <tbody>
                                <tr><td>Level 1</td><td>1.0x</td><td>Normal share</td></tr>
                                <tr><td>Level 2</td><td>1.5x</td><td>50% more than Level 1</td></tr>
                                <tr><td>Level 3</td><td>2.5x</td><td>150% more than Level 1</td></tr>
                                <tr><td>Level 4</td><td>4.5x</td><td>350% more than Level 1</td></tr>
                                <tr><td>Level 5</td><td className={s.tableHighlightYellow}>8.0x</td><td><strong>700% more than Level 1!</strong></td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={`${s.alert} ${s.alertWarning}`}>
                        <div className={s.alertIcon}>⬆️</div>
                        <div className={s.alertContent}>
                            <h4>UPGRADE TO EARN MORE!</h4>
                            <p>A player with 1 territory at Level 5 earns 4x MORE than a player with 2 territories at Level 1!</p>
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <div className={s.footerCta}>
                    <h3>Ready to Build Your Empire?</h3>
                    <p>Conquer the grid • Show your face • Win prizes</p>
                    <Link href="/" className={s.ctaButton}>🎮 Start Playing</Link>
                </div>
            </main>
        </div>
    );
}

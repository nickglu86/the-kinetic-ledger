export const Footer = () => (
    <footer className="bg-surface-container-lowest py-16 px-8 mt-4 border-t border-outline-variant/10">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
                <div className="text-xl font-black text-primary tracking-tighter uppercase font-headline">The Kinetic Ledger
                </div>
                <p className="text-on-surface-variant text-sm font-body max-w-xs">Providing the world&#39;s most high-velocity
                    crypto intelligence and market data since 2018.</p>
            </div>
            <div>
                <h5 className="font-headline font-bold text-on-surface mb-6 uppercase tracking-widest text-xs">Ecosystem
                </h5>
                <ul className="space-y-4 text-sm text-on-surface-variant font-label">
                    <li><a className="hover:text-primary transition-colors" href="#">Market Cap</a></li>
                    <li><a className="hover:text-primary transition-colors" href="#">ICO Calendar</a></li>
                    <li><a className="hover:text-primary transition-colors" href="#">Yield Farm List</a></li>
                </ul>
            </div>
            <div>
                <h5 className="font-headline font-bold text-on-surface mb-6 uppercase tracking-widest text-xs">Resources
                </h5>
                <ul className="space-y-4 text-sm text-on-surface-variant font-label">
                    <li><a className="hover:text-primary transition-colors" href="#">API Documentation</a></li>
                    <li><a className="hover:text-primary transition-colors" href="#">Glossary</a></li>
                    <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                </ul>
            </div>
            <div className="bg-surface-container-low p-6 rounded-lg space-y-4 border border-outline-variant/10">
                <h5 className="font-headline font-bold text-on-surface uppercase tracking-widest text-xs">Network Status
                </h5>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-xs text-on-surface-variant font-label">All Systems Operational</span>
                </div>
                <div className="text-[10px] text-on-surface-variant font-label space-y-1">
                    <div className="flex justify-between"><span>Active Nodes:</span> <span className="text-primary">4,812</span>
                    </div>
                </div>
            </div>
        </div>
        <div
            className="max-w-screen-2xl mx-auto pt-16 mt-16 border-t border-outline-variant/10 text-center text-xs text-on-surface-variant font-label">
            © 2024 Kinetic Ledger Media Group. Data provided by PulseOracle.
        </div>
    </footer>
)
export const NewsLetter = () => (
    <div
        className="bg-gradient-to-br from-primary-container/20 to-secondary/10 p-6 rounded-xl border border-primary/20 relative overflow-hidden group">
        <div className="relative z-10">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-2">The Daily Kinetic</h3>
            <p className="text-xs text-on-surface-variant mb-4 font-body leading-relaxed">High-velocity data and
                alpha delivered to your inbox every morning. Free for pro traders.</p>
            <div className="flex flex-col gap-2">
                <input
                    className="bg-surface-container-lowest/80 border-outline-variant/20 rounded-lg text-sm px-4 py-2 focus:ring-secondary focus:border-secondary"
                    placeholder="Enter your email" type="email" />
                <button
                    className="bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-headline font-bold text-sm py-2 rounded-lg hover:shadow-[0_0_15px_rgba(177,255,206,0.4)] transition-all">Join
                    the Alpha</button>
            </div>
        </div>
        <span
            className="material-symbols-outlined absolute -bottom-6 -right-6 text-9xl opacity-5 group-hover:opacity-10 transition-opacity rotate-12">mail</span>
    </div>
)
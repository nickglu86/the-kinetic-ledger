export const MobileNav = () => (
    <nav
        className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-[#0b0e11]/80 backdrop-blur-xl border-t border-[#1c2024] z-50 rounded-t-lg">
        <a className="flex flex-col items-center text-primary" href="#">
            <span className="material-symbols-outlined">show_chart</span>
            <span className="text-[10px] uppercase font-label">Pulse</span>
        </a>
        <a className="flex flex-col items-center text-on-surface/50" href="#">
            <span className="material-symbols-outlined">trending_up</span>
            <span className="text-[10px] uppercase font-label">Rank</span>
        </a>
        <a className="flex flex-col items-center text-on-surface/50" href="#">
            <span className="material-symbols-outlined">newspaper</span>
            <span className="text-[10px] uppercase font-label">News</span>
        </a>
        <a className="flex flex-col items-center text-on-surface/50" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[10px] uppercase font-label">Menu</span>
        </a>
    </nav>
)
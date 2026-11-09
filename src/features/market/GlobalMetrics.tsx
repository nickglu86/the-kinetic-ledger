import { safeFetch } from "@/lib/fetcher"
import { ENDPOINTS } from "@/lib/endpoints"
import { FearAndGreedResponse, GlobalData, GlobalResponse } from "@/types/api";
import { getHalvingData } from "@/lib/utils";
import { PercentChange } from "@/components/ui/PercentChange";
import { Unavailable } from "@/components/ui/Unavailable";
import { FearGreedGauge } from "./FearGreedGauge";

const getMarketMetrics = (globalData: GlobalData) => {
    const btcDominance = Number(globalData.market_cap_percentage.btc.toFixed(1));
    const ethDominance = Number(globalData.market_cap_percentage.eth.toFixed(1));
    return {
        totalMarketCap: (globalData.total_market_cap.usd / 1000000000000).toFixed(2),
        marketCapDailyChange: globalData.market_cap_change_percentage_24h_usd,
        btcDominance,
        ethDominance,
        othersDominance: (100 - btcDominance - ethDominance).toFixed(1),
    };
};

export const GlobalMetrics = async () => {
    // Fetched in parallel; each returns null on failure so the cards degrade independently.
    const [globalRes, fearAndGreedRes] = await Promise.all([
        safeFetch<GlobalResponse>(ENDPOINTS.global),
        safeFetch<FearAndGreedResponse>(ENDPOINTS.fearAndGreed),
    ]);

    const metrics = globalRes?.data ? getMarketMetrics(globalRes.data) : null;
    const fearAndGreedToday = fearAndGreedRes?.data?.[0] ?? null;
    const { daysLeft, progressPercent } = getHalvingData();

    // console.log(fearAndGreedData)

    return (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {metrics ? (
            <>
            <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between group hover:bg-surface-container-high transition-all">
                <div className="flex flex-col ">
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Total Market Cap</p>
                    <h3 className="font-headline text-xl font-bold text-primary mt-3">${metrics.totalMarketCap}T</h3>
                    <span className="text-[12px] mt-1">
                        <span className="text-on-surface-variant font-normal mr-1">24h</span>
                        <PercentChange value={metrics.marketCapDailyChange} />
                    </span>
                </div>
                <div className="w-16 h-8 bg-primary/10 rounded flex items-end px-1 pb-1">
                    <div className="flex gap-0.5 items-end w-full h-full">
                        <div className="bg-primary w-full h-[40%]"></div>
                        <div className="bg-primary w-full h-[60%]"></div>
                        <div className="bg-primary w-full h-[55%]"></div>
                        <div className="bg-primary w-full h-[85%]"></div>
                    </div>
                </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h3 className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Dominance</h3>
                    <div className="grid grid-cols-3 gap-2">

                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#f7931a]"></span>
                                <span className="text-[10px] font-label text-on-surface-variant">Bitcoin</span>
                            </div>
                            <div className="font-headline font-bold text-[14px] text-on-surface">{metrics.btcDominance}%</div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#627eea]"></span>
                                <span className="text-[10px] font-label text-on-surface-variant">Ethereum</span>
                            </div>
                            <div className="font-headline font-bold text-[14px] text-on-surface">{metrics.ethDominance}%</div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-outline-variant"></span>
                                <span className="text-[10px] font-label text-on-surface-variant">Others</span>
                            </div>
                            <div className="font-headline font-bold text-[14px] text-on-surface">{metrics.othersDominance}%</div>
                        </div>
                    </div>

                    <div className="w-full h-1.5 flex rounded-full overflow-hidden bg-surface-container-highest ">
                        <div className="h-full bg-[#f7931a]" style={{ width: `${metrics.btcDominance}%` }}></div>
                        <div className="h-full bg-[#627eea]" style={{ width: `${metrics.ethDominance}%` }}></div>
                        <div className="h-full bg-outline-variant" style={{ width: `${metrics.othersDominance}%` }}></div>
                    </div>
                </div>

                {/* <div>
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">BTC Dominance</p>
                    <h3 className="font-headline text-xl font-bold text-secondary">{metrics.btcDominance}%</h3>
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle className="text-outline-variant/20" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4"></circle>
                        <circle className="text-secondary" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeDasharray="125.6" strokeDashoffset="60" strokeWidth="4"></circle>
                    </svg>
                </div> */}
            </div>
            </>
            ) : (
            <>
                <Unavailable label="Total Market Cap" />
                <Unavailable label="Dominance" />
            </>
            )}
            <div className="bg-surface-container-low p-4 rounded-xl">
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">BTC Halving Countdown</p>
                <div className="flex items-baseline gap-1">
                    <span className="font-headline text-xl font-bold">{daysLeft}</span>
                    <span className="text-xs text-on-surface-variant">Days Left</span>
                </div>
                <div className="w-full bg-surface-container-lowest h-1.5 rounded-full mt-2 mb-1 overflow-hidden">
                    <div className="bg-tertiary h-full shadow-[0_0_8px_rgba(172,137,255,0.5)]" style={{ width: `${progressPercent.toFixed(2)}%` }}></div>
                </div>
                <span className="text-[10px] font-label text-on-surface-variant pt-4">*Bitcoin halving is expected to occur in April 2028</span>
            </div>
            {fearAndGreedToday ? (
            <div className="bg-surface-container-low p-4 rounded-xl">

                <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">Fear &amp; Greed Index</p>

                </div>
                <div className="flex flex-col items-center">
                    <FearGreedGauge value={Number(fearAndGreedToday.value)} label={fearAndGreedToday.value_classification} />
                </div>
            </div>
            ) : (
                <Unavailable label="Fear & Greed Index" />
            )}
        </section>
    )
}
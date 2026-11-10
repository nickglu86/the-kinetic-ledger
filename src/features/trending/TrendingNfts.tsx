import { getTrending } from "@/server/data/trending";

export const TrendingNFTs = async () => {
  const trending = await getTrending();
  // Non-critical section: hide it entirely if the fetch fails.
  if (!trending) return null;

  const { nfts } = trending;

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-headline text-3xl font-bold">Trending NFTs</h2>
      </div>
      <div className="flex flex-nowrap overflow-x-auto gap-6 pb-2 [scrollbar-width:thin]
                [scrollbar-color:#000_transparent]">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            className="bg-surface-container hover:bg-surface-container-high rounded-xl overflow-hidden flex flex-col group w-65 flex-shrink-0 transition-all cursor-pointer"
          >
            <div
              className="h-[3px] w-full flex-shrink-0"
              style={{
                backgroundImage: `url(${nft.thumb})`,
                backgroundSize: "400% 400%",
                backgroundPosition: "top right",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className="p-4 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    data-alt="Bored Ape Yacht Club NFT profile avatar"
                    src={nft.thumb}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{nft.name}</h4>
                  <p className="text-[10px] text-on-surface-variant font-label uppercase">
                    Floor: {nft.data.floor_price}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">Volume</span>
                <span className="font-bold text-secondary">
                  {nft.data.h24_volume}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

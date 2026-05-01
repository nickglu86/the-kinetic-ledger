type Props = { value: number; label: string }

export const FearGreedGauge = ({ value, label }: Props) => {
    const angle = Math.PI * (1 - value / 100)
    const cx = 65 + 53 * Math.cos(angle)
    const cy = 61 - 53 * Math.sin(angle)

    return (
        <div style={{ position: 'relative', width: 130, height: 70, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            <svg width="130" height="70" viewBox="0 0 130 70">
                {/* Segments */}
                <path d="M 12 60.99999999999999 A 53 53 0 0 1 18.91676873622339 34.82108107103576" stroke="#EA3943" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 23.008648902174897 28.66230631323281 A 53 53 0 0 1 44.46167391803855 12.141252965809464" stroke="#EA8C00" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 51.46137482940311 9.75836040396365 A 53 53 0 0 1 78.5386251705969 9.75836040396365" stroke="#F3D42F" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 85.53832608196146 12.141252965809471 A 53 53 0 0 1 106.99135109782512 28.662306313232826" stroke="#93D900" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 111.08323126377661 34.82108107103576 A 53 53 0 0 1 118 61" stroke="#16C784" strokeWidth="6" strokeLinecap="round" fill="none" />

                {/* Indicator */}
                <circle cx={cx} cy={cy} r="6" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <circle cx={cx} cy={cy} r="5" fill="white" />
            </svg>

            <div style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', marginBottom: 2.5 }}>
                <div className="font-headline font-bold text-xl text-on-surface">{value}</div>
                <div className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">{label}</div>
            </div>
        </div>
    )
}

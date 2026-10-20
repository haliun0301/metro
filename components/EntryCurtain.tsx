type EntryCurtainProps = {
  language: 'en' | 'zh';
  title: { en: string; zh: string };
  progress: number;
  variant: 'stations' | 'city';
};

export default function EntryCurtain({ language, title, progress, variant }: EntryCurtainProps) {
  const curtainOffset = (side: 'left' | 'right') =>
    `${(side === 'left' ? -1 : 1) * progress * 100}%`;
  const isCity = variant === 'city';

  return (
    <section
      className="absolute inset-0 z-[1000] overflow-hidden text-[#26383D]"
      style={{ pointerEvents: progress >= 0.999 ? 'none' : 'auto' }}
    >
      {(['left', 'right'] as const).map((side) => (
        <div
          key={side}
          className="absolute inset-y-0 overflow-hidden bg-[#FFFFFF]"
          style={{
            left: side === 'left' ? 0 : '50%',
            right: side === 'left' ? '50%' : 0,
            transform: `translateX(${curtainOffset(side)})`,
            willChange: 'transform',
          }}
        >
          <div className={`pointer-events-none absolute inset-0 ${isCity ? 'bg-[#26383D]/6' : 'bg-[#EF9953]/8'}`} />
        </div>
      ))}

      <div
        className="pointer-events-none relative z-10 flex h-full flex-col items-start justify-center px-[clamp(32px,7vw,112px)]"
        style={{
          opacity: Math.min(1, Math.max(0, (1 - progress) / 0.35)),
          transform: 'translateY(-10vh)',
          willChange: 'opacity, transform',
        }}
      >
        <span className={`text-xs font-bold uppercase tracking-[0.24em] ${isCity ? 'text-[#26383D]' : 'text-[#EF9953]'}`}>
          {isCity
            ? language === 'zh' ? '城市变迁图集' : 'Urban transformation atlas'
            : 'Shenzhen Metro'}
        </span>
        <h1 className="mt-3 text-[clamp(38px,6vw,84px)] font-bold leading-[.98] tracking-[-0.045em]">
          {title[language]}
        </h1>
      </div>
    </section>
  );
}

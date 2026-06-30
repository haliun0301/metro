interface ShuibeiOverviewMapProps {
  imageSrc: string;
  language: 'en' | 'zh';
  activeNoteId?: string | null;
  onHighlight?: (noteId: string | null) => void;
  fillContainer?: boolean;
}

export default function ShuibeiOverviewMap({
  imageSrc,
  language,
  fillContainer = false,
}: ShuibeiOverviewMapProps) {
  return (
    <div
      className={fillContainer ? 'relative h-full w-full overflow-hidden' : 'relative w-full overflow-hidden rounded-[22px] border border-black/10 bg-white'}
    >
      <img
        src={imageSrc}
        alt={language === 'zh' ? '水贝片区总览图' : 'Shuibei area overview map'}
        className={fillContainer ? 'h-full w-full object-contain' : 'block h-auto w-full object-contain'}
        draggable={false}
      />

    </div>
  );
}

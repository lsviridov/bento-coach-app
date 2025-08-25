import { SLOT_CENTER, WIDTH } from './chart-7-const';

const DAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

export function DayLabels7() {
  return (
    <div className="relative h-5" style={{ width: WIDTH }}>
      {DAYS.map((d, i) => (
        <span
          key={i}
          className="absolute -translate-x-1/2 text-[11px] leading-5 text-muted-foreground"
          style={{ left: SLOT_CENTER(i) }}
          aria-hidden
        >
          {d}
        </span>
      ))}
    </div>
  );
}

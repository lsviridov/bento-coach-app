import React from 'react';
import { BARS7, WIDTH, SLOT_CENTER } from './chart-7-const';

type Props = {
  values: number[];          // 7 значений 0..1
  color: string;             // css цвет палочек
  targetBand?: [number, number]; // зона цели, напр. [0.8, 1]
  todayIndex: number;        // 0..6
  height?: number;           // 44..56
};

export function MiniBars7({ values, color, targetBand=[0.8,1], todayIndex, height = BARS7.HEIGHT }: Props) {
  const { BAR_W, GAP, RADIUS } = BARS7;
  const maxH = height - 4;

  return (
    <svg width={WIDTH} height={height} role="img" aria-label="Мини-график за 7 дней">
      {/* baseline */}
      <line x1="0" y1={height-1} x2={WIDTH} y2={height-1} stroke="hsl(var(--border))" strokeWidth="1" />

      {/* зона цели */}
      {targetBand && (
        <rect
          x={-2}
          width={WIDTH+4}
          y={Math.max(0, height - (targetBand[1]*maxH) - 1)}
          height={Math.max(0, (targetBand[1]-targetBand[0]) * maxH)}
          fill="hsl(var(--brand))"
          opacity={0.08}
          rx={4}
        />
      )}

      {/* бары в фикс-ячейках */}
      {values.map((v, i) => {
        const h = Math.max(2, Math.min(1, v) * maxH);
        const x = i * (BAR_W + GAP);
        const y = height - h - 1;
        return <rect key={i} x={x} y={y} width={BAR_W} height={h} rx={RADIUS} fill={color} />;
      })}

      {/* маркёр "сегодня" по центру ячейки */}
      {todayIndex >= 0 && (
        <circle cx={SLOT_CENTER(todayIndex)} cy={height-1} r={3} fill={color} />
      )}
    </svg>
  );
}

import { useTrendsWeek } from '../model/useTrends';
import { MiniBars7 } from './MiniBars7';
import { DayLabels7 } from './DayLabels7';
import { WIDTH } from './chart-7-const';

export default function TrendsWeek() {
  const { data, isLoading, isError } = useTrendsWeek();

  if (isLoading) return <Skeleton />;
  if (isError || !data) return <ErrorState />;

  // Пн=0 … Вс=6
  const todayIdx = (new Date().getDay() + 6) % 7;
  const totalDelta = Math.round((data.protein.deltaPct + data.water.deltaPct) / 2);

  return (
    <section className="rounded-3xl border p-4 bg-card">
      <header className="mb-3 flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">Тренды недели</h3>
        <span className="text-sm text-muted-foreground">
          с {new Date(data.startISO).toLocaleDateString()}
        </span>
      </header>

      {/* ЕДИНЫЙ GRID, шкала по центру второй колонки */}
      <div className="grid grid-cols-[max-content,1fr,max-content] items-center gap-x-3 gap-y-2">
        {/* Белок */}
        <div className="text-[15px] font-medium">Белок</div>
        <div className="justify-self-center" style={{ width: WIDTH }}>
          <MiniBars7
            values={data.protein.values}
            color="hsl(var(--brand))"
            targetBand={[0.8, 1]}
            todayIndex={todayIdx}
          />
        </div>
        <Delta value={data.protein.deltaPct} />

        {/* Вода */}
        <div className="text-[15px] font-medium">Вода</div>
        <div className="justify-self-center" style={{ width: WIDTH }}>
          <MiniBars7
            values={data.water.values}
            color="hsl(var(--accent))"
            todayIndex={todayIdx}
          />
        </div>
        <Delta value={data.water.deltaPct} />

        {/* Подписи дней — в той же колонке, центрируются вместе со шкалой */}
        <div />
        <div className="justify-self-center" style={{ width: WIDTH }}>
          <DayLabels7 />
        </div>
        <div />
      </div>

      <hr className="my-3 border-border" />

      <footer className="flex items-center gap-2 text-sm">
        <span className="text-emerald-600">↗</span>
        <span className="font-medium">
          {formatDelta(totalDelta)} к прошлой неделе
        </span>
      </footer>
    </section>
  );
}

function Delta({ value }: { value: number }) {
  const v = Math.round(value);
  const positive = v >= 0;
  return (
    <div
      className={`justify-self-end text-sm [font-variant-numeric:tabular-nums] ${
        positive ? 'text-emerald-600' : 'text-rose-600'
      }`}
    >
      {formatDelta(v)}
    </div>
  );
}

function formatDelta(n: number) {
  return `${n >= 0 ? '+' : ''}${n}%`;
}

function Skeleton() {
  return <div className="h-36 rounded-3xl animate-pulse bg-secondary" />;
}
function ErrorState() {
  return (
    <div className="rounded-3xl border p-4 text-sm text-muted-foreground">
      Не удалось загрузить тренды
    </div>
  );
}

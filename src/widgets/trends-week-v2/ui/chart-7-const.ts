// Единая геометрия для обоих рядов и подписей
export const BARS7 = {
  N: 7,
  BAR_W: 14,     // ширина столбика
  GAP: 12,       // расстояние между столбиками
  RADIUS: 4,
  HEIGHT: 56     // высота мини-графика
};

export const WIDTH =
  BARS7.N * BARS7.BAR_W + (BARS7.N - 1) * BARS7.GAP;

export const SLOT_CENTER = (i: number) =>
  i * (BARS7.BAR_W + BARS7.GAP) + BARS7.BAR_W / 2;

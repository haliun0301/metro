export interface MetroArea {
  en: string;
  zh: string;
}

export const METRO_AREAS: MetroArea[] = [
  { en: 'Bitou area', zh: '碧头片区' },
  { en: 'Chegongmiao area', zh: '车公庙片区' },
  { en: 'Xiangmi Lake area', zh: '香蜜湖片区' },
  { en: 'Buji area', zh: '布吉片区' },
  { en: 'Biyan-Guangming Farm area', zh: '碧眼－光明农场片区' },
  { en: 'Nanyou area', zh: '南油片区' },
  { en: 'Shatian area', zh: '沙田片区' },
  { en: 'Shuibei–Tianbei area', zh: '水贝－田贝片区' },
  { en: 'University Town area', zh: '大学城片区' },
  { en: 'Huangbeiling area', zh: '黄贝岭片区' },
  { en: 'Qianhaiwan area', zh: '前海湾片区' },
  { en: 'Huaqiang North area', zh: '华强北片区' },
  { en: 'Baiwang (Baimang) area', zh: '白芒片区' },
  { en: 'Fanshen area', zh: '翻身片区' },
  { en: 'Shekou area', zh: '蛇口片区' },
  { en: 'Tanglang–Changlingpi area', zh: '塘朗－长岭陂片区' },
  { en: 'Shenzhen University–High-tech Park area', zh: '深大－高新园片区' },
  { en: 'Houhai area', zh: '后海片区' },
  { en: 'Futian CBD area', zh: '福田CBD片区' },
  { en: 'Xixiang area', zh: '西乡片区' },
  { en: 'Meilin Checkpoint area', zh: '梅林关片区' },
  { en: 'Longcheng Square area', zh: '龙城广场片区' },
  { en: 'Fenghuang Town–Guangming Town area', zh: '凤凰城－光明城片区' },
  { en: 'Shatoujiao area', zh: '沙头角片区' },
  { en: 'Universiade area', zh: '大运片区' },
  { en: 'Tongle area', zh: '同乐片区' },
  { en: 'Hongshan area', zh: '红山片区' },
];

export function normalizeMetroAreaName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\(.*?\)/g, '')
    .replace(/[–—‒−‑]/g, ' ')
    .replace(/[^\w\s\u4e00-\u9fff-]/g, ' ')
    .replace(/\b(area|片区|区)\b/g, ' ')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isMetroAreaMatch(candidate: string | undefined, targetArea: MetroArea): boolean {
  const candidateName = normalizeMetroAreaName(String(candidate || ''));
  if (!candidateName) return false;

  const targets = [normalizeMetroAreaName(targetArea.en), normalizeMetroAreaName(targetArea.zh)];

  return targets.some((target) => {
    if (!target) return false;
    if (candidateName === target || candidateName.includes(target) || target.includes(candidateName)) {
      return true;
    }

    const targetTokens = Array.from(new Set(target.split(' ').filter(Boolean)));
    const candidateTokens = Array.from(new Set(candidateName.split(' ').filter(Boolean)));
    const matchedCount = targetTokens.filter(
      (token) => candidateTokens.includes(token) && token.length > 2
    ).length;

    return matchedCount >= 2 || (targetTokens.length === 1 && matchedCount === 1);
  });
}

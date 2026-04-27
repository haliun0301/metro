import type { AreaPageContentOverride } from './types';
import { qianhaiwanAreaPage } from './qianhaiwanArea';
import { shuibeiAreaPage } from './shuibeiArea';

export const AREA_PAGE_CONTENT: Record<string, AreaPageContentOverride> = {
  'qianhaiwan-area': qianhaiwanAreaPage,
  'qianhaiwan': qianhaiwanAreaPage,
  liyumen: qianhaiwanAreaPage,
  'shuibei-area': shuibeiAreaPage,
  'shuibei-tianbei-area': shuibeiAreaPage,
  'shuibei-tianbei': shuibeiAreaPage,
  shuibei: shuibeiAreaPage,
  tianbei: shuibeiAreaPage,
  // Add more area files here.
  // Example:
  // 'houhai-area': houhaiAreaPage,
  // 'shekou-area': shekouAreaPage,
};

/*
  data/stationDetailMedia.ts
  - Tiny utility that generates placeholder SVG data URIs used on station detail pages.
  - These images are lightweight illustrations for the research map and thematic cards.
  - Replace or add entries in `stationDetailMedia` to change visuals shown on detail pages.
*/

function svgDataUri(title: string, subtitle: string, colorA: string, colorB: string, accent: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="100%" stop-color="${colorB}" />
        </linearGradient>
        <linearGradient id="glow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#bg)" />
      <circle cx="260" cy="210" r="170" fill="${accent}" opacity="0.16" />
      <circle cx="1280" cy="180" r="120" fill="#ffffff" opacity="0.08" />
      <circle cx="1400" cy="650" r="240" fill="${accent}" opacity="0.12" />
      <rect x="120" y="120" width="1360" height="660" rx="36" fill="url(#glow)" stroke="#ffffff" stroke-opacity="0.16" />
      <path d="M250 610 C410 460, 560 490, 740 390 S1090 280, 1330 390" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="12" stroke-linecap="round"/>
      <path d="M280 690 C500 540, 670 620, 860 520 S1180 430, 1360 500" fill="none" stroke="${accent}" stroke-opacity="0.68" stroke-width="8" stroke-dasharray="18 14" stroke-linecap="round"/>
      <g fill="#ffffff">
        <circle cx="420" cy="520" r="18" />
        <circle cx="690" cy="430" r="18" />
        <circle cx="980" cy="350" r="18" />
        <circle cx="1210" cy="390" r="18" />
      </g>
      <text x="160" y="720" fill="#ffffff" font-size="62" font-family="Arial, sans-serif" font-weight="700">${title}</text>
      <text x="160" y="785" fill="#dbeafe" font-size="30" font-family="Arial, sans-serif">${subtitle}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const stationDetailMedia = {
  researchMap: svgDataUri('Research Area Overview', 'Station cluster, mobility structure, and urban context', '#0b1830', '#11284b', '#67e8f9'),
  thematicConnection: svgDataUri('Thematic Linkage', 'Area stories connect with social and spatial themes', '#211236', '#3b1d59', '#c084fc'),
  beforeUrbanFabric: svgDataUri('Urban Fabric · Earlier', 'Lower density blocks and emerging corridors', '#3d3024', '#5f4d36', '#f59e0b'),
  afterUrbanFabric: svgDataUri('Urban Fabric · Later', 'Denser development and stronger metro influence', '#0d2530', '#10495a', '#22d3ee'),
  beforeTransitEdge: svgDataUri('Transit Edge · Earlier', 'Fragmented frontage and weaker station gateway', '#332036', '#5b3252', '#fb7185'),
  afterTransitEdge: svgDataUri('Transit Edge · Later', 'Integrated frontage and clearer station identity', '#122235', '#183f66', '#60a5fa'),
  beforeGreenNetwork: svgDataUri('Green Network · Earlier', 'Open land and sparse public-space stitching', '#22362f', '#355247', '#4ade80'),
  afterGreenNetwork: svgDataUri('Green Network · Later', 'Parks, streets, and transit-linked public realm', '#0d2f2b', '#14584f', '#2dd4bf'),
};
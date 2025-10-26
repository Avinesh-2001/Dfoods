// Utility function to generate placeholder images for products
export const generatePlaceholderImage = (text: string, color1: string, color2: string): string => {
  const svg = `
    <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" fill="url(#gradient)"/>
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
          <stop stop-color="${color1}"/>
          <stop offset="1" stop-color="${color2}"/>
        </linearGradient>
      </defs>
      <style>
        .text { font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; fill: white; text-anchor: middle; }
      </style>
      <text x="150" y="150" class="text">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Predefined placeholder images for different product types
export const placeholderImages = {
  jaggeryCubes: generatePlaceholderImage("JAGGERY_CUBES", "#E67E22", "#D35400"),
  jaggeryPowder: generatePlaceholderImage("JAGGERY_POWDER", "#F39C12", "#E67E22"),
  cardamomJaggery: generatePlaceholderImage("CARDAMOM_JAGGERY", "#D35400", "#A04000"),
  gingerJaggery: generatePlaceholderImage("GINGER_JAGGERY", "#E67E22", "#C0392B"),
  turmericJaggery: generatePlaceholderImage("TURMERIC_JAGGERY", "#F39C12", "#E67E22"),
  plainJaggery: generatePlaceholderImage("PLAIN_JAGGERY", "#8B4513", "#A0522D"),
  coffeeJaggery: generatePlaceholderImage("COFFEE_JAGGERY", "#D35400", "#E67E22"),
  coconutJaggery: generatePlaceholderImage("COCONUT_JAGGERY", "#E67E22", "#F39C12"),
  jaggerySyrup: generatePlaceholderImage("JAGGERY_SYRUP", "#F39C12", "#D35400"),
  saffronJaggery: generatePlaceholderImage("SAFFRON_JAGGERY", "#C0392B", "#E67E22"),
  mixedFruitJaggery: generatePlaceholderImage("MIXED_FRUIT_JAGGERY", "#E67E22", "#F39C12"),
  jaggeryGranules: generatePlaceholderImage("JAGGERY_GRANULES", "#D35400", "#A04000"),
  cinnamonJaggery: generatePlaceholderImage("CINNAMON_JAGGERY", "#E67E22", "#C0392B"),
  giftBox: generatePlaceholderImage("GIFT_BOX", "#F39C12", "#E67E22"),
  comboPack: generatePlaceholderImage("COMBO_PACK", "#8B4513", "#D35400"),
};

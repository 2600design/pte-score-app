const DI_PRACTICE_SET_SRC = 'Data%20visualisation%20practice%20set.png';

function createDiPracticeSetCrop(x, y, width = 138, height = 212) {
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="width:min(100%, 540px);border-radius:14px;overflow:hidden;display:block;margin:0 auto">
  <rect width="${width}" height="${height}" fill="#ffffff"/>
  <image href="${DI_PRACTICE_SET_SRC}" x="${-x}" y="${-y}" width="734" height="734" preserveAspectRatio="xMinYMin slice"/>
</svg>`;
}

window.DI_TEMPLATES = [
  {
    id: 'di-practice-01',
    type: 'line',
    title: 'Population Growth in a Country (2010–2020)',
    image: '/public/di-images/line/population-growth.png',
    difficulty: 'easy',
    description: 'Describe the upward population growth trend from 2010 to 2020, mentioning the starting value around 35 million and the ending value near 50 million.',
  },
  {
    id: 'di-practice-02',
    type: 'line',
    title: 'Average Temperature Changes (1990–2020)',
    image: '/public/di-images/line/temperature-trend.png',
    difficulty: 'easy',
    description: 'Describe the steady rise in average temperature from approximately 14°C in 1990 to about 17°C in 2020, and note the consistent upward trend.',
  },
  {
    id: 'di-practice-03',
    type: 'line',
    title: 'Company Sales Over Time',
    image: '/public/di-images/line/sales-trend.png',
    difficulty: 'easy',
    description: 'Describe the quarterly sales trend from Q1 to Q4, noting the overall increase in sales figures and highlighting any notable changes between quarters.',
  },
  {
    id: 'di-practice-04',
    type: 'bar',
    title: 'Internet Usage by Age Group',
    image: '/public/di-images/bar/age-groups.png',
    difficulty: 'easy',
    description: 'Describe how internet usage percentage varies across age groups from 18–24 to 55+, noting the highest usage at 68% for the 25–34 group and the clear decline with age.',
  },
  {
    id: 'di-practice-05',
    type: 'bar',
    title: 'Books Sold by Genre',
    image: '/public/di-images/bar/internet-usage.png',
    difficulty: 'easy',
    description: 'Compare the number of books sold (in thousands) across five genres. Note that Fiction leads with 45,000 copies and Others is the lowest at 10,000.',
  },
  {
    id: 'di-practice-06',
    type: 'bar',
    title: 'Quarterly Profit Comparison',
    image: '/public/di-images/bar/product-sales.png',
    difficulty: 'easy',
    description: 'Compare quarterly profits in millions across Q1 to Q4, noting Q3 had the highest profit at 4.1 million and describing the overall trend throughout the year.',
  },
  {
    id: 'di-practice-07',
    type: 'pie',
    title: 'Market Share of Smartphone Companies',
    image: '/public/di-images/pie/market-share.png',
    difficulty: 'easy',
    description: 'Describe the market share distribution among five companies — Apple leads at 35%, followed by Samsung at 28%, Huawei at 18%, Xiaomi at 10%, and Others at 9%.',
  },
  {
    id: 'di-practice-08',
    type: 'pie',
    title: 'Monthly Budget Allocation',
    image: '/public/di-images/pie/budget-allocation.png',
    difficulty: 'easy',
    description: 'Summarize how the monthly budget is split across six categories — Housing takes the largest share at 30%, while Entertainment is the smallest at 10%.',
  },
  {
    id: 'di-practice-09',
    type: 'pie',
    title: 'Energy Consumption by Source',
    image: '/public/di-images/pie/energy-use.png',
    difficulty: 'easy',
    description: 'Describe the proportion of energy consumed from five sources — Coal dominates at 40%, followed by Natural Gas at 25%, Renewable at 20%, Nuclear at 10%, and Others at 5%.',
  },
  {
    id: 'di-practice-13',
    type: 'map',
    title: 'Migration to Different Regions in 2020',
    image: '/public/di-images/map/migration-map.png',
    difficulty: 'medium',
    description: 'Describe the migration flows shown on the map, comparing figures for each destination region — Asia leads at 120,000, followed by Europe at 80,000, North America at 50,000, South America at 40,000, Africa at 30,000, and Oceania at 20,000.',
  },
  {
    id: 'di-practice-14',
    type: 'map',
    title: 'Population Density by Country',
    image: '/public/di-images/map/population-density.png',
    difficulty: 'medium',
    description: 'Describe the global population density distribution, identifying the most densely populated regions (>100 per km²) and contrasting them with the least densely populated areas using the colour key.',
  },
  {
    id: 'di-practice-15',
    type: 'map',
    title: 'Main Export Products by Country',
    image: '/public/di-images/map/global-distribution.png',
    difficulty: 'medium',
    description: 'Describe the dominant export industries shown by country across the world map — including Technology, Oil & Gas, Agriculture, Automotive, and Textiles — and compare the distribution across regions.',
  },
];

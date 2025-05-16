// For a real application, replace this in-memory store with a database.
// This is a simplified in-memory store for demonstration purposes.

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Function to generate a URL-friendly slug
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

const initialContentEURUSD = `
# Fundamental Outlook for EUR/AUD (60-Day Horizon)

## Global Economic Analysis

**Monetary Policy Divergence:** By spring 2025 both the ECB and RBA have shifted away from tightening. In mid‐April the ECB cut its deposit rate by 25 bps to 2.25%, citing a well‑entrenched disinflation path and weakening growth expectations due to trade tensions.  President Lagarde emphasized a data‑dependent, meeting‑by‑meeting approach to ensure inflation converges sustainably to the 2% target.  In contrast, the RBA has only just begun easing: it delivered its first cut since 2020 (25 bps to 4.10%) in February 2025 after inflation fell more than expected.  RBA Governor Bullock stressed that policy is still “restrictive” and any further cuts will be gradual, pending confidence that inflation stays near target.  Markets now expect the RBA to cut again in May and twice more by year‑end as core inflation hovers near 3%, but Fed officials remain more cautious.  Thus for now Australia’s cash rate remains higher (4.10%) than the ECB’s policy rates (2.25%–2.65%), suggesting a continued interest‐rate advantage for AUD carry.

**Inflation and Growth Trends:** Inflation in both regions is moderating toward central bank targets.  Euro‑area inflation fell to ~2.2% in early 2025, with core services inflation easing as wage‑cost pressures subsided.  ECB staff project euro inflation around 2% over the medium term.  Growth is weak: Q1 GDP is tracking at roughly 0.3–0.4% quarter‑on‑quarter (about 1.0–1.5% annualized), and risks are skewed to the downside as U.S. tariffs cloud global demand.  By contrast, Australia’s inflation is trending steadily into the 2–3% target range: headline CPI slowed to ~2.4% in February and trimmed‐mean (core) inflation is ~2.7–2.9%.  RBA forecasts now expect core inflation to fall to ~2.7% by mid‑2025.  Australian growth has rebounded: late‑2024 saw GDP growth of ~0.6% q/q, and full‑year 2025 is forecast around 2.0–2.5%.  A tight jobs market (unemployment ~3.7–4.0%) supports spending.  Overall, Australia’s economy appears more resilient, while the eurozone faces anaemic growth. **Historical precedent:** Similar dynamics emerged in mid‑2019, when slowing global demand and commodity prices pressured the AUD relative to the EUR (then enjoying firmer growth), sending EUR/AUD sharply higher.

**Global Geopolitical Risks:** Both regions cite heightened geopolitical uncertainty.  The IMF and ECB note “unprecedented” trade‐policy headwinds (global tariffs and fragmentation) undermining world trade and investment.  The RBA also highlights U.S. tariffs on China as a key downside risk that could slow global growth.  These risks weigh on sentiment and may trigger safe‑haven flows.  Energy and commodity markets are sensitive: for example, renewed Middle East or Ukraine conflicts could spike oil prices (harming eurozone inflation/growth) or send capital into U.S. Treasuries and JPY.  Conversely, any détente (e.g. U.S.–China tariff rollbacks) could relieve uncertainty.  **Precedent:** In 2018–19 trade‐tension episodes, AUD sold off as commodity demand fell while EUR remained stable, driving EUR/AUD higher.

## Regional & National Economic Analysis

**ECB Policy Statements:** Recent ECB communications have turned clearly dovish.  In April 2025 the ECB not only cut rates but dropped earlier language that policy was becoming “less restrictive,” underscoring readiness to ease further if needed. Lagarde’s press conferences stressed uncertainty (“exceptional uncertainty”) and repeated that no rate path is pre‑committed.  The ECB remains focused on keeping inflation on a “sustainable” downward track.  Staff have even revised down growth forecasts (2025 euro‑area GDP ~0.9%), reflecting the hit from tariffs.  The takeaway is that the ECB is in easing mode and will likely stay data‑driven.

**RBA Policy Statements:** The RBA’s language has also moderated. After the February cut, Governor Bullock emphasized that inflation is “tracking down” and the Board is easing “a little bit” of restrictiveness, but stressed that further cuts depend on additional evidence. By April, she noted that Australia’s inflation is in the range and unemployment low, so the existing rate “is restrictive” and the economy is “well positioned for shocks”.  The new board has removed explicit guidance of “caution on prospects of further easing” and adopted a ‘data‑dependent’ stance.  In sum, RBA rhetoric acknowledges inflation has peaked and will fall, but it insists on patience given the still‑tight labor market.

**Labour Markets:** Australia’s labour market remains very tight.  Unemployment (~3.7%) and underemployment are near cycle lows, better than RBA had assumed a year ago.  The RBA does expect unemployment to rise modestly to ~4¼%, but even that is with tight conditions.  By contrast, the eurozone unemployment rate is higher (~6.1% as of Feb 2025).  Employment growth is slowing in Europe, and wage growth has moderated, whereas in Australia wages are forecast to ease only slightly (WPI growth ~3% into 2026).

**Consumer Sentiment & Spending:** Australian consumer confidence has been weak: the Westpac–Melbourne index fell to a six‑month low (~90.1) in April 2025, dragged down by tariff war fears and market volatility. Retail spending is only modestly rebounding: February 2025 retail sales rose just 0.2% m/m after January’s gain, and commentators note consumers remain cautious.  Slower inflation and real income gains are the upside, but spending growth remains “tepid”.  In the euro area, consumer morale is similarly subdued: the EC’s April survey shows confidence at –16.7 (below long‑run average).  Retail volumes are roughly flat: March 2025 retail trade was flat to ‑0.1% m/m in the Eurozone.  In sum, consumers in both regions are restrained, with no clear lead.

**Fiscal and Debt Metrics:** Australia’s public finances are in comparatively strong shape.  Australia ran a budget surplus (~+0.9% of GDP) in 2022‑23 with gross debt ~44% of GDP. By contrast, the euro area collectively had a 2024 deficit of about –3.0% of GDP and debt around 89%.  This fiscal buffer gives Australia more policy room; Rating agencies currently view Australia’s “AAA” status favorably.  High sovereign debt and deficit ratios in Europe (especially in Italy, France) keep euro pressures elevated.  **Precedent:** Countries with surging deficits (e.g. Italy in 2018) have seen sudden swings in EUR risk premia; by contrast Australia’s stable budget tends to underpin AUD in stress periods.

## Industry & Sector Analysis

**Australia – Commodities:** Australia’s export base is dominated by resources.  Strong demand for iron ore, coal, and LNG drove a rebound in the trade surplus (e.g. a AUD6.9 bn goods surplus in March 2025).  However, forecasts point to softer commodity earnings ahead.  The government’s March 2025 Resources report projects iron ore export earnings to fall from AUD117 bn in 2024–25 to ~AUD109 bn in 2025–26 as Chinese construction slows.  Similarly, metallurgical coal forecasts have been trimmed.  Risks include any tariff disruptions to commodity trade: notably, a new 10% U.S. duty on certain Australian goods (meats, alcohol) was announced for April 2025, which—though small in direct value—is a reminder that geopolitical shifts could hinder trade.  **Sector Demand:** For as long as Chinese infrastructure and industrial activity remain strong, Australia’s resource exports should hold up.  But if China’s property/industrial slowdown deepens without offsetting stimulus, it could sharply cut iron ore and coal demand (as in 2015), hurting AUD.

**Eurozone – Manufacturing/Industry:** Europe remains an industrial exporter.  Recent data show the Eurozone still posts a goods trade surplus (e.g. ~€25 bn in Feb 2025), with strong export segments in chemicals and machinery.  However, global demand is sluggish: U.S. and Chinese tariffs are damping order books for autos and machinery.  The European Commission notes that firms are facing export barriers and reduced investment.  Energy costs are also lower (gas prices off 2022 highs), which eases some pressure on manufacturing input costs.  Overall, Europe’s export sectors are stable but lack momentum.

**Tourism & Services:** Both regions rely on services/travel to some extent.  Europe benefits from tourism (southeastern Europe, France, etc.), which has rebounded post-pandemic.  Australia sees tourism as smaller relative to GDP.  Current indicators of service activity (PMIs, orders) show modest growth in Europe and Australia, not a decisive factor for the exchange rate.

**Trade Balances:** Australia’s current account is in surplus thanks to commodities. Europe’s current account with the world is also typically in surplus but heavily influenced by energy imports and intra-EU trade.  The key difference is in risk sensitivity: a negative shock to Chinese growth would slam Australia’s trade balance but would not directly affect Europe to the same degree.

## Currency-Specific Analysis

**Relative Economic Strength & Interest Differentials:** Australia’s comparatively higher real interest rates and growth give the AUD a structural advantage.  Even after cuts, RBA’s cash rate (~3.85–4.10% in mid‑2025) remains well above ECB rates (~2.25% deposit), so AUD still offers carry.  Historically, wider real rate differentials have tracked with AUD depreciation, and in 2024–25 the narrowing differential (AUS↓, US/EU→) has underpinned AUD strength.  Additionally, Australia’s banking sector is well capitalized and the currency is underpinned by a long history of prudent monetary/fiscal policy.

**Commodity Correlations and Risk Sentiment:** The AUD is traditionally a “risk‑on” currency tied to commodities. In normal conditions, rising global growth and commodity prices push AUD up (and EUR/AUD down), while risk‑off events hurt AUD.  Recent analysis notes the Australian dollar has “lost its correlation” with U.S. equity markets – it rose ~2% in Q1 2025 even as stocks fell. This break suggests a potential shift in investor behavior.  If it persists, we may see weaker commodity‑AUD links.  For example, after February’s U.S. tariff truce, AUD staged an unusual rally despite global trade jitters.

The EUR has different drivers.  The euro often reflects broad EMU fundamentals and safe‑haven shifts.  In pure risk‑off, investors usually flock to USD/JPY rather than EUR; thus EUR tends to move less predictably.  A stronger EUR may correlate with positive growth surprises or hawkish ECB signals.  Conversely, a global growth scare tends to weaken AUD more than EUR, pushing EUR/AUD up. **Precedent:** In late 2014–2015, China’s slowdown and commodity collapse sent AUD tumbling while EUR declined modestly, causing EUR/AUD to surge.

**Market Positioning & Sentiment:** Current positioning is mixed. According to a recent industry report, retail traders are heavily net-short EUR/AUD (over 80% short), a contrarian signal. By contrast, institutional flows have favored AUD: hedge funds have reduced net euro longs and AUD speculative shorts. The CFTC’s COT data (via reports) shows a steady decline in net EUR longs. This suggests professional traders lean AUD‑bullish.  Overall, sentiment indicators imply potential crowding in AUD trades; however, given the recent breakdown in AUD-risk correlation, technical and flow factors should be monitored closely.

## Trade Execution & Portfolio Management

**Positioning Strategy:** The above fundamentals (higher Aussie rates and resilient growth vs. weak Europe) imply a slight bearish bias on EUR/AUD over 60 days – i.e. favoring *AUD strength*.  In practice, this would translate to a **short EUR/AUD** position under base-case conditions.  For example, if Australian inflation continues easing and RBA cuts as expected, the interest rate gap will compress, keeping EUR/AUD bid down.  Conversely, a stalled European economy and further ECB cuts would also weigh on the euro.  However, given shifts in AUD behavior, one should hedge against sudden reversals.

**Risk Management:** Because currency moves can accelerate in crises, position sizes should be conservative.  Set stop-losses around recent technical levels (e.g. slightly above the 2025 range highs ~1.75–1.76) to guard against sharp EUR rallies.  Use trailing stops if the trade goes in your favor.  Monitor volatility: spikes in commodity prices or unexpected data could cause rapid swings.

**Key Data/Events to Watch:** The next ECB meeting (June 6–7) and RBA meetings (e.g. May 20) are critical. Watch for central bank commentary on rates.  Important macro releases include eurozone CPI and German factory orders (implications for ECB), and Australian employment/inflation data (for RBA).  Global events – U.S. Fed signals, China PMI/economic stimulus news, and any trade‑war developments – will influence risk sentiment.  Also track commodity indices (iron ore, coal, gold) for AUD drivers.

**Scenario Indicators:**

* **Bearish EUR/AUD (AUD-strong) triggers:**
  * **Expected path continues:** RBA cuts rates gradually while ECB persists in further easing. Market prices move to AUD carry neutrality (e.g. RBA funds 3.60–3.85% by year-end vs ECB ~2.0%).
  * **Commodity rebound:** Signs of Chinese stimulus boost iron ore and metal prices, lifting AUD. NAB notes that historically Chinese fiscal expansion has supported commodity exports.
  * **Risk-on tilt:** Global equity rallies renew demand for risk currencies, favoring AUD.

* **Bullish EUR/AUD (EUR-strong) triggers:**
  * **Policy pivot:** If ECB unexpectedly signals a pause or reversal (e.g. higher inflation surprises or faster–than–expected growth), the interest gap could widen in euro’s favor. A shock similar to early 2024 (when euro area inflation beat expectations) would strengthen EUR.
  * **Australian shocks:** A sudden collapse in Chinese demand (or an AUD-specific shock, e.g. credit squeeze) could knock AUD sharply. For instance, a plunge in iron ore prices below ~$80/t could rekindle 2015–2016‑style AUD selloff.
  * **Safe-haven flows:** Global risk aversion (e.g. a major geopolitical crisis) might push flows into USD/JPY and press EUR moderately higher versus AUD.
  * **Fiscal or political surprise:** Any sign Europe will undertake large fiscal stimulus or debt monetization (raising inflation expectations) could boost EUR.

**Historical Context:** Past episodes offer guidance.  In late 2015, a Chinese growth scare and commodity crash sent EUR/AUD from ~1.50 to ~1.60. In mid‑2020, during the COVID‑19 shock, AUD plunged and EUR (after a brief dip) recovered, spiking EUR/AUD over 1.75.  These illustrate how AUD is often the weaker leg in global stress.  Conversely, in 2017–18, strong global growth and U.S. tax cuts had lifted all risk assets including the AUD, which undercut EUR/AUD.

**Conclusion:** On balance, fundamental factors favor AUD (lower EUR/AUD) over the next 60 days, but positions should be managed with tight stops given the potential for abrupt policy pivots or risk shocks.  Clear “game‑changers” like a Fed/ECB policy reversal or a new tier of trade tariffs would mandate immediate reassessment.  Watching those indicators will determine whether to stay with the current bias or switch to the opposite view.

**Sources:** This analysis draws on central bank releases, market polls and economic reports, among other reputable data. Each projection is grounded in analogous historical episodes. (Citations in brackets.)
`.trim();

const initialTitle = "Fundamental Outlook for EUR/AUD (60-Day Horizon)";

let posts: Post[] = [
  {
    id: '1',
    slug: slugify(initialTitle),
    title: initialTitle,
    content: initialContentEURUSD,
    createdAt: new Date('2024-07-28T10:00:00Z'),
    updatedAt: new Date('2024-07-28T10:00:00Z'),
  },
];

export async function getPosts(): Promise<Post[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getPostById(id: string): Promise<Post | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return posts.find(post => post.id === id);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return posts.find(post => post.slug === slug);
}

export async function addPost(data: { title: string; content: string }): Promise<Post> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const newPost: Post = {
    id: String(Date.now()), // Simple unique ID
    slug: slugify(data.title),
    title: data.title,
    content: data.content,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  // Check for duplicate slugs, append a number if necessary (simplified)
  let currentSlug = newPost.slug;
  let counter = 1;
  while (posts.some(p => p.slug === currentSlug)) {
    currentSlug = `${newPost.slug}-${counter}`;
    counter++;
  }
  newPost.slug = currentSlug;
  
  posts.push(newPost);
  return newPost;
}

export async function updatePost(id: string, data: { title?: string; content?: string }): Promise<Post | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const postIndex = posts.findIndex(post => post.id === id);
  if (postIndex === -1) {
    return undefined;
  }
  const existingPost = posts[postIndex];
  const updatedPost = {
    ...existingPost,
    ...data,
    updatedAt: new Date(),
  };
  if (data.title && data.title !== existingPost.title) {
    updatedPost.slug = slugify(data.title);
    // Handle slug uniqueness for updated post
    let currentSlug = updatedPost.slug;
    let counter = 1;
    while (posts.some(p => p.id !== id && p.slug === currentSlug)) {
        currentSlug = `${slugify(data.title)}-${counter}`;
        counter++;
    }
    updatedPost.slug = currentSlug;
  }

  posts[postIndex] = updatedPost;
  return updatedPost;
}

export async function deletePost(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const initialLength = posts.length;
  posts = posts.filter(post => post.id !== id);
  return posts.length < initialLength;
}

export function formatContentForDisplay(content: string): string {
  let html = content;

  // Process headings (most specific first, multiline)
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-3 mb-1">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-4 mb-2">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-6 mb-3">$1</h1>');
  
  // Process bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  const lines = html.split('\n');
  let outputHtml = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.startsWith('* ')) {
      if (!inList) {
        outputHtml.push('<ul class="list-disc list-inside my-2 pl-4">');
        inList = true;
      }
      outputHtml.push(`<li>${line.substring(2)}</li>`);
    } else {
      if (inList) {
        outputHtml.push('</ul>');
        inList = false;
      }
      // If it's not a heading (already processed), not empty, and not a list item
      if (!line.match(/^<(?:h[1-3]|ul|li).*>/) && line.trim() !== '') {
         // If the line is part of what looks like a paragraph continuation, don't wrap it in <p> yet.
         // This simple parser wraps each non-blank, non-heading/list line in <p>.
         // This may result in too many <p> tags if original text relies on single newlines within paragraphs.
         // A more robust solution would identify paragraph blocks first.
         // For now, this will treat each such line as a paragraph.
        outputHtml.push(`<p class="my-1">${line}</p>`);
      } else {
        outputHtml.push(line); // Push already processed headings, empty lines, or list elements
      }
    }
  }

  if (inList) { // Close list if file ends with list items
    outputHtml.push('</ul>');
  }
  
  // Join lines and attempt to merge consecutive <p> tags if they were due to single newlines.
  // This is tricky; a simpler approach is to ensure CSS handles spacing or content is authored with double newlines for paragraphs.
  // The current logic might over-generate <p> tags.
  // For this scaffold, we'll accept this limitation.
  return outputHtml.join('\n');
}

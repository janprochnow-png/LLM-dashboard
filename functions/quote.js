export async function handler(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store"
  };
  try {
    const syms = (event.queryStringParameters?.t || "").trim();
    if (!syms) return { statusCode: 400, headers, body: JSON.stringify({error:"missing t"}) };
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(syms)}`;
    const resp = await fetch(url, { headers:{ "User-Agent":"Mozilla/5.0" }});
    const data = await resp.json();
    const out = {};
    (data.quoteResponse?.result || []).forEach(q => {
      out[q.symbol] = {
        price: q.regularMarketPrice ?? q.postMarketPrice ?? null,
        dayPct: q.regularMarketChangePercent ?? null
      };
    });
    return { statusCode: 200, headers, body: JSON.stringify(out) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({error: String(e)}) };
  }
}
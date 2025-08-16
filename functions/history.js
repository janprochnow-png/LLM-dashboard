export async function handler(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store"
  };
  try {
    const t = (event.queryStringParameters?.t || "").trim();
    const start = event.queryStringParameters?.start;
    const end = event.queryStringParameters?.end;
    if (!t || !start || !end) return { statusCode: 400, headers, body: JSON.stringify({error:"missing params"}) };
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(t)}?period1=${encodeURIComponent(start)}&period2=${encodeURIComponent(end)}&interval=1d`;
    const resp = await fetch(url, { headers:{ "User-Agent":"Mozilla/5.0" }});
    const j = await resp.json();
    const res = j.chart?.result?.[0];
    const ts = res?.timestamp || [];
    const close = res?.indicators?.quote?.[0]?.close || [];
    const out = ts.map((sec,i)=>({ ts: sec, close: close[i] }));
    return { statusCode: 200, headers, body: JSON.stringify(out) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({error: String(e)}) };
  }
}
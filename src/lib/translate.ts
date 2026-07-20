export async function translateToEN(text: string): Promise<string> {
  if (!text?.trim()) return text;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return (data[0]?.[0]?.[0] as string) || text;
  } catch {
    return text;
  }
}

export async function translateArrayToEN(items: string[]): Promise<string[]> {
  if (!items?.length) return items;
  return Promise.all(items.map(translateToEN));
}

// app/api/fetchPreview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { parseHTML } from 'linkedom';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }
  try {
    const response = await fetch(url);
    const data = await response.text();
    const { document } = parseHTML(data);

    const titleMatch =
      document.querySelector('meta[name="og:title"]') ||
      document.querySelector('meta[property="og:title"]') ||
      document.querySelector('meta[name="twitter:title"]') ||
      document.querySelector('meta[property="twitter:title"]');

    const descriptionMatch =
      document.querySelector('meta[name="og:description"]') ||
      document.querySelector('meta[property="og:description"]') ||
      document.querySelector('meta[name="twitter:description"]') ||
      document.querySelector('meta[property="twitter:description"]');

    const imageMatch =
      document.querySelector('meta[name="og:image"]') ||
      document.querySelector('meta[property="og:image"]') ||
      document.querySelector('meta[name="twitter:image"]') ||
      document.querySelector('meta[name="twitter:image:src"]') ||
      document.querySelector('meta[property="twitter:image"]') ||
      document.querySelector('meta[property="twitter:image:src"]');

    const title = titleMatch ? titleMatch.getAttribute('content') : '';
    const description = descriptionMatch
      ? descriptionMatch.getAttribute('content')
      : '';
    const image = imageMatch ? imageMatch.getAttribute('content') : '';
    const domain = new URL(url).hostname;

    return NextResponse.json({ title, description, image, domain });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch preview' },
      { status: 500 }
    );
  }
}

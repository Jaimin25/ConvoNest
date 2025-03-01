export const metadata = {
  title: 'ConvoNest',
  description: 'Place to have some fun conversations',
  openGraph: {
    title: 'ConvoNest',
    description:
      'ConvoNest is a realtime web application for chatting, where you can add friends and chat with them individually or in a group.',
    images: [
      {
        url: `https://raw.githubusercontent.com/Jaimin25/ConvoNest/refs/heads/main/public/Link%20Preview%20-%20ConvoNest.png`,
        width: 1200,
        height: 630,
        alt: 'ConvoNest'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jaimin_chovatia',
    creator: '@jaimin_chovatia',
    title: 'ConvoNest - Chat App',
    description:
      'ConvoNest is a realtime web application for chatting, where you can add friends and chat with them individually or in a group.',
    images: [
      {
        url: 'https://raw.githubusercontent.com/Jaimin25/ConvoNest/refs/heads/main/public/Link%20Preview%20-%20ConvoNest.png',
        width: 1200,
        height: 630,
        alt: 'ConvoNest'
      }
    ]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

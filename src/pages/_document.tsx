import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add the GitHub Pages redirect script */}
        {process.env.NODE_ENV === 'production' && (
          <script src="/SynapseIQ-/gh-pages-redirect.js" />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

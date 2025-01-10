import type { NextPage } from 'next'
import Head from 'next/head'
import StarryLayout from '@/components/StarryLayout'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Debo | Full Stack Data Scientist</title>
        <meta name="description" content="Portfolio of Debo - Full Stack Data Scientist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <StarryLayout />
      </main>
    </>
  )
}

export default Home
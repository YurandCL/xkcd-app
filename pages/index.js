import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

import { Layout } from '../components/Layout'

import fs from 'fs/promises'
import { useI18N } from 'context/i18n'
import { LATEST_COMICS } from 'constants/translations'
import { COMIC } from 'constants/paths'

export default function Home({ latestComics }) {
  const {t} = useI18N()
  return (
    <div>
      <Head>
        <meta name="description" content="Comics for developers" />
      </Head>

      <Layout>
        <h2 className="mb-10 text-3xl text-gray-300 font-bold text-center">
          {t(LATEST_COMICS)}
        </h2>
        <section className="grid max-w-xl grid-cols-2 gap-4 m-auto sm:grid-cols-2 md:grid-cols-3">
          {
            latestComics.map(comic => (
              <Link key={comic.id} href={`/${COMIC}/${comic.id}`}>
                <a className="pb-4 m-auto mb-4">
                  <h3 className="pb-2 text-sm font-bold text-center text-gray-300">{comic.title}</h3>
                  <Image width={300} height={300} objectFit='contain' src={comic.img} alt={comic.alt} />
                </a>
              </Link>
            ))
          }
        </section>
      </Layout>
    </div>
  )
}

export async function getStaticProps() {
  const files = await fs.readdir('./comics')
  const latestComicsFiles = files.slice(-8, files.length)

  const promisesReadFiles = latestComicsFiles.map(async (file) => {
    const content = await fs.readFile(`./comics/${file}`, 'utf-8')
    return await JSON.parse(content)
  }).reverse()

  const latestComics = await Promise.all(promisesReadFiles)

  return {
    props: {
      latestComics
    }
  }
}

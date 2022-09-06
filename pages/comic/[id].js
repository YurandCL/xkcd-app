import Image from 'next/image'
import Link from 'next/link'

import { useI18N } from 'context/i18n'
import { Layout } from 'components/Layout'

import { readdir, readFile, stat } from 'fs/promises'
import { basename } from 'path'
import { COMIC } from 'constants/paths'
import { NEXT, PREVIOUS } from 'constants/translations'

export default function Comic({ img, alt, title, width, height, hasPrevious, hasNext, prevId, nextId }) {
  const { t } = useI18N()
  return (
    <>
      <Layout>
        <section className="max-w-lg m-auto">
          <h1 className="mb-4 text-lg font-bold text-gray-300 text-center">{title}</h1>

          <div className="max-w-xs m-auto mb-4">
            <Image
              layout="responsive"
              width={width}
              height={height}
              src={img}
              alt={alt} />
          </div>

          <p className="text-gray-300">{alt}</p>

          <div className="flex justify-between mt-4 font-bold">
            <div>
              {hasPrevious && <Link href={`/${COMIC}/${prevId}`}>
                <a className="text-gray-300">👈 {t(PREVIOUS)}</a>
              </Link>}
            </div>
            <div>
              {hasNext && <Link href={`/${COMIC}/${nextId}`}>
                <a className="text-gray-300">{t(NEXT)} 👉</a>
              </Link>}
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

export async function getStaticPaths({locales}) {
  const files = await readdir('./comics')
  let paths = []

  locales.forEach(locale => {
    paths = paths.concat(files.map(file => {
      const id = basename(file, '.json')
      return{params: {id}, locale}
    }))
  })

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const { id } = params
  const content = await readFile(`./comics/${id}.json`, 'utf-8')
  const comic = JSON.parse(content)

  const idNumber = +id
  const prevId = idNumber - 1
  const nextId = idNumber + 1

  const [prevResult, nextResult] = await Promise.allSettled([
    stat(`./comics/${prevId}.json`),
    stat(`./comics/${nextId}.json`),
  ])

  const hasPrevious = prevResult.status === 'fulfilled'
  const hasNext = nextResult.status === 'fulfilled'

  return {
    props: {
      ...comic,
      hasPrevious,
      hasNext,
      prevId,
      nextId
    }
  }
}

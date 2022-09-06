import Image from 'next/image'
import Link from 'next/link'

import { Layout } from 'components/Layout'

import { readdir, readFile, stat } from 'fs/promises'
import { basename } from 'path'

export default function Comic({ img, alt, title, width, height, hasPrevious,hasNext,prevId,nextId }) {
  return (
    <>
      <Layout>
        <section className="max-w-lg m-auto">
          <h1 className="mb-4 text-lg font-bold text-center">{title}</h1>

          <div className="max-w-xs m-auto mb-4">
            <Image
              layout="responsive"
              width={width}
              height={height}
              src={img}
              alt={alt} />
          </div>

          <p>{alt}</p>

          <div className="flex justify-between mt-4 font-bold">
            <div>
              {hasPrevious && <Link href={`/comic/${prevId}`}>
                <a className="text-gray-600">👈 Previous</a>
              </Link>}
            </div>
            <div>
              {hasNext && <Link href={`/comic/${nextId}`}>
                <a className="text-gray-600">Next 👉</a>
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

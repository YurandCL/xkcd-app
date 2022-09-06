import Image from 'next/image'
import Link from 'next/link'

import { useI18N } from 'context/i18n'
import { Layout } from 'components/Layout'

import { search } from 'services/search'
import { SEARCH_RESULTS_TITLE } from 'constants/translations'
import { COMIC } from 'constants/paths'

export default function Search({ query, results }) {
  const { t } = useI18N()

  return (
    <>
      <Layout>
        <h1 className="text-center text-lg font-bold text-gray-300">{t(SEARCH_RESULTS_TITLE, results.length, query) }</h1>

        <div className="gap-1 justify-center flex flex-col">
          {results && results.map((result) => (
            <Link href={`/${COMIC}/${result.id}`} key={result.id} >
              <a className="flex gap-1 overflow-hidden justify-center">
                <Image width={50} height={50} src={result.img} alt={result.alt} />
                <div className="flex flex-col w-3/4">
                  <h1 className="font-bold text-gray-300">{result.title}</h1>
                  <p className="text-gray-500 text-ellipsis whitespace-nowrap overflow-hidden">{result.alt}</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </Layout>
    </>
  )
}

export async function getServerSideProps(context) {
  const { query } = context
  const { q = '' } = query

  const { results } = await search({ query: q })

  return {
    props: {
      query: q,
      results
    }
  }
}

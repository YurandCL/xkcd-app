import Image from 'next/image'
import Link from 'next/link'

import { useI18N } from 'context/i18n'
import { Layout } from 'components/Layout'

import { search } from 'services/search'
import { SEARCH_RESULTS_TITLE } from 'constants/translations'

export default function Search({ query, results }) {
  const {t} = useI18N()
  return (
    <>
      <Layout>
        <h1>{t(SEARCH_RESULTS_TITLE, results.length, query) }</h1>

        {results && results.map((result) => (
          <Link href={`/comic/${result.id}`} key={result.id} >
            <a className="flex">
              <Image width={50} height={50} src={result.img} alt={result.alt} />
              <h1>{result.title}</h1>
            </a>
          </Link>
        ))}
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

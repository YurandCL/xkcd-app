import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
// import { search } from 'services/search'

export function Header() {
  const {asPath, locale, locales } = useRouter()
  const [results, setResults] = useState([])
  const searchRef = useRef(null)

  const getValue = () => searchRef.current?.value

  const handleChange = () => {

    const query = getValue()

    if (!query) return setResults([])

    fetch(`/api/search?q=${query}`)
      .then(res => res.json())
      .then(searchResults => {
        setResults(searchResults)
      })
  }

  const restOfLocales = locales.filter((l) => l !== locale)

  return (
    <header className="flex items-center justify-between max-w-xl p-4 m-auto" >

      <h1 className="font-bold" >
        <Link href="/">
          <a className="text-gray-600">
            next
            <span className="font-light">
              xkcd
            </span>
          </a>
        </Link>
      </h1>

      <nav>
        <ul className="flex flex-row gap-2">
          <li>
            <Link href="/"><a className="text-sm font-bold text-gray-600">Home</a></Link>
          </li>
          <li>
            {restOfLocales.map((language) => (
              <Link href={asPath} locale={language} key={language}>
                <a className="text-sm font-bold text-gray-600">
                  {language}
                </a>
              </Link>
            ))}
          </li>
          <li>
            <input
              className="border-slate-400 border-solid border text-base rounded-md px-2"
              placeholder="search..."
              type="text"
              ref={searchRef}
              onChange={handleChange}
            />
            <div className="relative">
              {
                Boolean(results.length) && (
                  <div className="absolute w-full top-0 left-0 z-10">
                    <ul className="w-full border rounded-lg shadow-xl border-gray-50 overflow-hidden bg-slate-100">
                      <li className="m-0">
                        <Link href={`/search?q=${getValue()}`}>
                          <a className="block px-2 py-1 overflow-hidden text-sm font-semibold hover:bg-slate-200 text-ellipsis whitespace-nowrap text-gray-400">
                            Show {results.length} results
                          </a>
                        </Link>
                      </li>
                      {results.map((result) => (
                        <li className="m-0" key={result.id}>
                          <Link href={`/comic/${result.id}`} >
                            <a className="block px-2 py-1 overflow-hidden text-sm font-semibold hover:bg-slate-200 text-ellipsis whitespace-nowrap">
                              {result.title}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              }
            </div>
          </li>
        </ul>
      </nav>

    </header>
  )
}

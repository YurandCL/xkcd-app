import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

import { useI18N } from 'context/i18n'

import { COMIC, HOME, SEARCH } from 'constants/paths'
import { SHOW_RESULTS } from 'constants/translations'

export function Header() {
  const {t} = useI18N()
  const {asPath, locale, locales } = useRouter()
  const [results, setResults] = useState([])
  const searchRef = useRef(null)

  const getValue = () => searchRef.current?.value

  const handleChange = () => {

    const query = getValue()

    if (!query) return setResults([])

    fetch(`/api/${SEARCH}?q=${query}`)
      .then(res => res.json())
      .then(searchResults => {
        setResults(searchResults)
      })
  }

  const restOfLocales = locales.filter((l) => l !== locale)

  return (
    <header className="flex items-center justify-between max-w-xl p-4 m-auto" >

      <h1 className="font-bold" >
        <Link href={`${HOME}`}>
          <a className="text-gray-400">
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
            <Link href={`${HOME}`}><a className="text-sm font-bold text-gray-400">Home</a></Link>
          </li>
          <li>
            <input
              className="border-slate-400 border-solid border text-base rounded-md px-2 bg-gray-700 text-gray-200"
              placeholder="search..."
              type="text"
              ref={searchRef}
              onChange={handleChange}
              onFocus={handleChange}
            />
            {Boolean(results.length) &&
              <div
                className="w-full absolute h-full bg-transparent top-0 left-0 z-10"
                onClick={()=>setResults([])}
              ></div>
            }
            <div className="relative">
              {
                Boolean(results.length) && (
                  <div className="absolute w-full top-0 left-0 z-10">
                    <ul className="w-full border rounded-lg shadow-xl border-neutral-50 overflow-hidden bg-neutral-700">
                      <li className="m-0">
                        <Link href={`/${SEARCH}?q=${getValue()}`}>
                          <a className="block px-2 py-1 overflow-hidden text-sm font-semibold hover:bg-slate-600 text-ellipsis whitespace-nowrap text-gray-400">
                            {t(SHOW_RESULTS, results.length )}
                          </a>
                        </Link>
                      </li>
                      {results.map((result) => (
                        <li className="m-0" key={result.id}>
                          <Link href={`/${COMIC}/${result.id}`} >
                            <a
                              className="block px-2 py-1 overflow-hidden text-sm font-semibold hover:bg-slate-600 text-ellipsis whitespace-nowrap text-gray-300"
                              onClick={()=>setResults([])}
                            >
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
          <li>
            {restOfLocales.map((language) => (
              <Link href={asPath} locale={language} key={language}>
                <a className="text-sm font-bold text-gray-400">
                  {language}
                </a>
              </Link>
            ))}
          </li>
        </ul>
      </nav>

    </header>
  )
}

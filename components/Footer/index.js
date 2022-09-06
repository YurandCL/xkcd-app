import { useI18N } from 'context/i18n'

import { ALL_COMICS_BY_XKCD } from 'constants/translations'

export function Footer() {
  const {t} = useI18N()
  return (
    <footer className="bg-neutral-800 py-4 font-bold text-center text-gray-300" >
      <a href="https://xkcd.com" target="_blank" rel="noopener noreferrer">
        {t(ALL_COMICS_BY_XKCD)}
      </a>
    </footer>
  )
}

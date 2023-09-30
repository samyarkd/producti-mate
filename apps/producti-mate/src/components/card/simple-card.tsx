import { useThemeParams } from '@twa.js/sdk-react'
import clsx from 'clsx'

interface SimpleCardProps {
  name: string
  initials: string
}

export default function SimpleCard(props: SimpleCardProps) {
  const themeParams = useThemeParams()

  return (
    <li key={props.name} className="col-span-1 flex rounded-md shadow-sm">
      <div
        style={{
          backgroundColor: themeParams?.linkColor || 'white',
          color: themeParams?.textColor || 'black',
        }}
        className={clsx(
          'flex-shrink-0 flex items-center justify-center w-16 text-sm font-medium rounded-l-md'
        )}
      >
        {props.initials}
      </div>
      <div style={{
        backgroundColor: themeParams?.secondaryBackgroundColor || 'white',
        color: themeParams?.textColor || 'black',
        borderColor: themeParams?.hintColor || 'gray',
      }} className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b ">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <span className="font-medium">
            {props.name}
          </span>
          <p style={{
            color: themeParams.hintColor || 'gray',
          }}>100 Exp</p>
        </div>
      </div>
    </li>
  )
}

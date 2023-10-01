import { useThemeParams } from "@twa.js/sdk-react"

export const Divider = () => {
  const themeParams = useThemeParams()

  return <div className="border-b w-full mb-4 border-b-solid " style={{
    borderColor: themeParams?.hintColor || "#000000"
  }} />
}

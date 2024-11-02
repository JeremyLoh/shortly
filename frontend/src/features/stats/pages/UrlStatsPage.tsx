import { useState } from "react"
import Header from "../../../components/Header/Header.tsx"
import Footer from "../../../components/Footer/Footer.tsx"
import ShortUrlStatForm from "../components/ShortUrlStatForm/ShortUrlStatForm.tsx"
import UrlStatCard from "../components/UrlStatCard/UrlStatCard.tsx"
import { UrlStat } from "../../../endpoints/urlStatistic.ts"

function UrlStatsPage() {
  const [urlStat, setUrlStat] = useState<UrlStat>()
  function handleUrlStat(urlStat: UrlStat) {
    setUrlStat(urlStat)
  }
  return (
    <>
      <Header />
      <h1>Link Statistics</h1>
      <ShortUrlStatForm handleUrlStat={handleUrlStat} />
      {urlStat && <UrlStatCard urlStat={urlStat} />}
      <Footer />
    </>
  )
}

export default UrlStatsPage

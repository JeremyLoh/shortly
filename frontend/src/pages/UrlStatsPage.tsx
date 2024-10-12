import Header from "../components/Header"
import Footer from "../components/Footer"
import ShortUrlStatForm from "../components/ShortUrlStatForm"
import { UrlStat } from "../endpoints/urlStatistic"
import { useState } from "react"
import UrlStatCard from "../components/UrlStatCard"

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

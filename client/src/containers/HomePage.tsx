import Layout from "components/Layout"
import { JinxSodaLogoStacked } from "components/logos/JinxSodaLogoStacked"

const HomePage = () => {
  return (
    <Layout title="Jinx | Home" content="Home Page">
      <div className="flex justify-center mt-[100px]">
        <JinxSodaLogoStacked />
      </div>
      <h1 className="flex justify-center font-face-syne-bold text-3xl text-jinxBlue">
        This is your home for all things Jinx Soda!
      </h1>
    </Layout>
  )
}

export default HomePage

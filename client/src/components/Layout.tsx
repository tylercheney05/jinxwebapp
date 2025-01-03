import Navbar from "./navbar/Navbar"
import { Helmet } from "react-helmet"

interface Props {
  title: string
  content: string
  children: React.ReactNode
}

const Layout = ({ title, content, children }: Props) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={content} />
      </Helmet>
      <Navbar />
      <div className="pt-11 pb-5 px-5">{children}</div>
    </>
  )
}

export default Layout

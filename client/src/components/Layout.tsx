import Navbar from "./navbar/Navbar"
import { Helmet } from "react-helmet"
import { cn } from "lib/utils"

interface Props {
  title: string
  content: string
  backgroundColor?: "jinxBlue-background" | "white" | "secondary"
  children: React.ReactNode
}

const Layout = ({ title, content, backgroundColor = "jinxBlue-background", children }: Props) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={content} />
      </Helmet>
      <Navbar />
      <div className={cn("min-h-screen pt-11 pb-5 px-5", `bg-${backgroundColor}`)}>{children}</div>
    </>
  )
}

export default Layout

import { FormLabel } from "components/ui"
import { Menu } from "types"

interface Props {
  data: Menu[] | undefined
  title: string
}

const Header = ({ data, title }: Props) => {
  return <>{data?.length && data?.length > 0 ? <FormLabel>{title}</FormLabel> : null}</>
}

export default Header

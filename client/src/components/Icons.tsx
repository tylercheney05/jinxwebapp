import { LoaderCircle, Menu, Plus, CandyOff } from "lucide-react"

interface Props {
  className?: string
  size?: string
}

const LoadingIcon = ({ className, size }: Props) => <LoaderCircle className={className} size={size} />
LoadingIcon.displayName = "LoadingIcon"

const MenuIcon = ({ className, size }: Props) => <Menu className={className} size={size} />
MenuIcon.displayName = "MenuIcon"

const PlusIcon = ({ className, size }: Props) => <Plus className={className} size={size} />
PlusIcon.displayName = "PlusIcon"

const ZeroSugarIcon = ({ className, size }: Props) => <CandyOff className={className} size={size} />
ZeroSugarIcon.displayName = "ZeroSugarIcon"

export { LoadingIcon, MenuIcon, PlusIcon, ZeroSugarIcon }

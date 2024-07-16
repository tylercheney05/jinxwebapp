import { LoaderCircle, Menu, Plus, CandyOff, CupSoda, Candy, CircleAlert } from "lucide-react"

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

const SugarIcon = ({ className, size }: Props) => <Candy className={className} size={size} />
SugarIcon.displayName = "SugarIcon"

const ZeroSugarIcon = ({ className, size }: Props) => <CandyOff className={className} size={size} />
ZeroSugarIcon.displayName = "ZeroSugarIcon"

const SodaIcon = ({ className, size }: Props) => <CupSoda className={className} size={size} />
SodaIcon.displayName = "SodaIcon"

const WarningIcon = ({ className, size }: Props) => <CircleAlert className={className} size={size} />
WarningIcon.displayName = "WarningIcon"

export { LoadingIcon, MenuIcon, PlusIcon, SugarIcon, ZeroSugarIcon, SodaIcon, WarningIcon }

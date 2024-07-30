import { LoaderCircle, Menu, Plus, CandyOff, CupSoda, Candy, CircleAlert, MapPinOff, MapPin } from "lucide-react"

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

const LocationIcon = ({ className, size }: Props) => <MapPin className={className} size={size} />
LocationIcon.displayName = "LocationIcon"

const NoLocationIcon = ({ className, size }: Props) => <MapPinOff className={className} size={size} />
NoLocationIcon.displayName = "LocationIcon"

export {
  LoadingIcon,
  MenuIcon,
  PlusIcon,
  SugarIcon,
  ZeroSugarIcon,
  SodaIcon,
  WarningIcon,
  NoLocationIcon,
  LocationIcon,
}

import {
  Menu,
  Plus,
  CandyOff,
  CupSoda,
  Candy,
  CircleAlert,
  MapPinOff,
  MapPin,
  ClipboardPlus,
  Trash2,
  MoreVertical,
  CheckCheck,
} from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { SizeProp } from "@fortawesome/fontawesome-svg-core"

interface Props {
  className?: string
  size?: string
}

const LoadingIcon = ({ className, size }: { className?: string; size?: SizeProp }) => (
  <FontAwesomeIcon className={className} size={size} icon={faSpinner} spinPulse />
)
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

const AddCustomOrderIcon = ({ className, size }: Props) => <ClipboardPlus className={className} size={size} />
AddCustomOrderIcon.displayName = "AddCustomOrder"

const DeleteIcon = ({ className, size }: Props) => <Trash2 className={className} size={size} />
DeleteIcon.displayName = "DeleteIcon"

const DoubleCheckIcon = ({ className, size }: Props) => <CheckCheck className={className} size={size} />
DoubleCheckIcon.displayName = "DoubleCheckIcon"

const MoreVerticalIcon = ({ className, size }: Props) => <MoreVertical className={className} size={size} />
MoreVerticalIcon.displayName = "MoreVerticalIcon"

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
  AddCustomOrderIcon,
  DeleteIcon,
  DoubleCheckIcon,
  MoreVerticalIcon,
}

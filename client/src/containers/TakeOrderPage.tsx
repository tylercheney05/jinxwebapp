import Layout from "components/Layout"
import { RootState } from "store"
import { useSelector } from "react-redux"
import { LoadingIcon } from "components/Icons"
import { SodaListItem } from "types/SodaTypes"
import ListMenuItems from "components/menuitems/ListMenuItems"
import { useGetSodasListQuery } from "services/sodas"
import LocationNeededRoute from "components/routes/LocationNeededRoute"
import { Button } from "components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "components/ui/dialog"
import CustomOrderForm from "components/orders/CustomOrderForm"
import { useState } from "react"
import { useMediaQuery } from "@material-ui/core"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "components/ui/drawer"

const TakeOrderPage = () => {
  const { user, loading } = useSelector((state: RootState) => state.user)
  const { data } = useGetSodasListQuery({}, { refetchOnMountOrArgChange: true })
  const [open, setOpen] = useState<boolean>(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const dialogComponent = (
    <Dialog open={open} modal onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Add Custom Order</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Custom Order</DialogTitle>
        </DialogHeader>
        <CustomOrderForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )

  const drawerComponent = (
    <Drawer open={open} modal onOpenChange={setOpen}>
      <DrawerTrigger>
        <Button>Add Custom Order</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Custom Order</DrawerTitle>
        </DrawerHeader>
        <CustomOrderForm setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  )

  return (
    <Layout title="Jinx | Take Order" content="Take Order Page">
      <LocationNeededRoute>
        {loading || user == null ? (
          <LoadingIcon />
        ) : (
          <div>
            <div className="flex justify-end p-2">{isDesktop ? dialogComponent : drawerComponent}</div>
            {data?.map((soda: SodaListItem) => (
              <div key={soda.id}>
                <div className="grid md:grid-cols-11 items-center">
                  <div className="sm:bg-transparent md:bg-black h-1 md:col-span-5 rounded-sm"></div>
                  <div className="text-center text-lg-2">{soda.name}</div>
                  <div className="sm:bg-transparent md:bg-black h-1 md:col-span-5 rounded-sm"></div>
                </div>
                <div className="my-2">
                  <ListMenuItems soda={soda} isClickable={true} />
                </div>
              </div>
            ))}
          </div>
        )}
      </LocationNeededRoute>
    </Layout>
  )
}

export default TakeOrderPage

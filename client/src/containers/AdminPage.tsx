import Layout from "components/Layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"
import AddSodaForm from "components/sodas/AddSodaForm"
import AddFlavorForm from "components/flavors/AddFlavorForm"
import AddMenuItemForm from "components/menuitems/AddMenuItemForm"
import AddFlavorGroupForm from "components/flavors/AddFlavorGroupForm"
import AddCupForm from "components/cups/AddCupForm"
import AddLocationForm from "components/locations/AddLocationForm"
import { useEffect, useState } from "react"
import AddOrderNameForm from "components/orders/ordername/AddOrderNameForm"
import AddLimitedTimePromoForm from "components/limitedtimepromos/AddLimitedTimePromoForm"
import AddDiscountForm from "components/discounts/AddDiscountForm"
import { AddMenuForm } from "components/menus"

const AdminPage = () => {
  const [width, setWidth] = useState<number>(window.innerWidth)

  function handleWindowSizeChange() {
    setWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange)
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange)
    }
  }, [])

  const isMobile = width <= 768

  return (
    <Layout title="Jinx | Admin" content="Admin Page">
      <div className="flex items-center justify-center mt-[100px]">
        <Card className="sm:w-[500px] md:w-[900px] min-h-[600px]">
          <CardHeader>
            <CardTitle>Admin Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {isMobile ? (
              <div>You must be on desktop in order to access the admin settings.</div>
            ) : (
              <Tabs defaultValue="cups" orientation="vertical" className="flex">
                <TabsList className="justify-start">
                  <TabsTrigger value="cups" className="justify-start">
                    Cups
                  </TabsTrigger>
                  <TabsTrigger value="discounts" className="justify-start">
                    Discounts
                  </TabsTrigger>
                  <TabsTrigger value="flavors" className="justify-start">
                    Flavors
                  </TabsTrigger>
                  <TabsTrigger value="limitedTimePromos" className="justify-start">
                    Limited Time Promos
                  </TabsTrigger>
                  <TabsTrigger value="locations" className="justify-start">
                    Locations
                  </TabsTrigger>
                  <TabsTrigger value="menus" className="justify-start">
                    Menus
                  </TabsTrigger>
                  <TabsTrigger value="menuItems" className="justify-start">
                    Menu Items
                  </TabsTrigger>
                  <TabsTrigger value="orderNames" className="justify-start">
                    Order Names
                  </TabsTrigger>
                  <TabsTrigger value="sodas" className="justify-start">
                    Sodas
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="cups">
                  <div className="px-4">
                    <AddCupForm />
                  </div>
                </TabsContent>
                <TabsContent value="sodas" className="w-full">
                  <div className="px-4">
                    <AddSodaForm />
                  </div>
                </TabsContent>
                <TabsContent value="flavors" className="w-full">
                  <div className="flex flex-col gap-4">
                    <div className="px-4">
                      <Card>
                        <CardHeader className="px-6 pt-4 pb-2">
                          <CardTitle className="text-lg">Flavor Groups</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <AddFlavorGroupForm />
                        </CardContent>
                      </Card>
                    </div>
                    <div className="px-4">
                      <Card>
                        <CardHeader className="px-6 pt-4 pb-2">
                          <CardTitle className="text-lg">Flavors</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <AddFlavorForm />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="menus" className="w-full">
                  <div className="px-4">
                    <AddMenuForm />
                  </div>
                </TabsContent>
                <TabsContent value="menuItems" className="w-full">
                  <div className="px-4">
                    <AddMenuItemForm />
                  </div>
                </TabsContent>
                <TabsContent value="locations" className="w-full">
                  <div className="px-4">
                    <AddLocationForm />
                  </div>
                </TabsContent>
                <TabsContent value="orderNames" className="w-full">
                  <div className="px-4">
                    <AddOrderNameForm />
                  </div>
                </TabsContent>
                <TabsContent value="limitedTimePromos" className="w-full">
                  <div className="px-4">
                    <AddLimitedTimePromoForm />
                  </div>
                </TabsContent>
                <TabsContent value="discounts" className="w-full">
                  <div className="px-4">
                    <AddDiscountForm />
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default AdminPage

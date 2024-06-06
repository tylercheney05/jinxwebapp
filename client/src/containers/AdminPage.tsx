import Layout from "components/Layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"
import AddSodaForm from "components/sodas/AddSodaForm"
import AddFlavorForm from "components/flavors/AddFlavorForm"

const AdminPage = () => {
  return (
    <Layout title="Jinx | Admin" content="Admin Page">
      <div className="flex items-center justify-center mt-[100px]">
        <Card className="sm:w-[400px] md:w-[600px]">
          <CardHeader>
            <CardTitle>Admin Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sodas" orientation="vertical" className="flex">
              <TabsList className="justify-start">
                <TabsTrigger value="sodas">Sodas</TabsTrigger>
                <TabsTrigger value="flavors">Flavors</TabsTrigger>
              </TabsList>
              <TabsContent value="sodas" className="w-full">
                <div className="px-4">
                  <AddSodaForm />
                </div>
              </TabsContent>
              <TabsContent value="flavors" className="w-full">
                <div className="px-4">
                  <AddFlavorForm />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default AdminPage

import Layout from "components/Layout"
import { RootState } from "store"
import { useSelector } from "react-redux"
import { LoadingIcon } from "components/Icons"
import { SodaListItem } from "types/SodaTypes"
import ListMenuItems from "components/menuitems/ListMenuItems"
import { useGetSodasListQuery } from "services/sodas"
import LocationNeededRoute from "components/routes/LocationNeededRoute"

const TakeOrderPage = () => {
  const { user, loading } = useSelector((state: RootState) => state.user)
  const { data } = useGetSodasListQuery({}, { refetchOnMountOrArgChange: true })

  return (
    <Layout title="Jinx | Take Order" content="Take Order Page">
      <LocationNeededRoute>
        {loading || user == null ? (
          <LoadingIcon />
        ) : (
          <div>
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

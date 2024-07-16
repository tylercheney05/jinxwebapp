import Layout from "components/Layout"
import { AppDispatch, RootState } from "store"
import { useDispatch, useSelector } from "react-redux"
import { LoadingIcon } from "components/Icons"
import { useEffect, useState } from "react"
import { SodaListItems } from "types/SodaTypes"
import { listSodas } from "features/sodas"
import ListMenuItems from "components/menuitems/ListMenuItems"

const TakeOrderPage = () => {
  const { user, loading } = useSelector((state: RootState) => state.user)
  const [sodas, setSodas] = useState<SodaListItems>([])
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(listSodas()).then((data) => setSodas(data.payload))
  }, [])

  return (
    <Layout title="Jinx | Take Order" content="Take Order Page">
      {loading || user == null ? (
        <LoadingIcon />
      ) : (
        <div>
          {sodas &&
            sodas.map((soda) => (
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
    </Layout>
  )
}

export default TakeOrderPage

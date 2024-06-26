import Layout from "components/Layout"
import { RootState } from "store"
import { useSelector } from "react-redux"
import { LoadingIcon } from "components/Icons"

const DashboardPage = () => {
  const { user, loading } = useSelector((state: RootState) => state.user)

  return (
    <Layout title="Jinx | Dashboard" content="Dashboard Page">
      {loading || user == null ? (
        <LoadingIcon />
      ) : (
        <>
          <div>
            <h1>Dashboard</h1>
          </div>
          <div>
            <ul>
              <li>First Name: {user.first_name}</li>
              <li>Last Name: {user.last_name}</li>
              <li>Email: {user.email}</li>
            </ul>
          </div>
        </>
      )}
    </Layout>
  )
}

export default DashboardPage

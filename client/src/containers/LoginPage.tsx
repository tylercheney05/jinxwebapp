import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { resetRegistered, login } from "features/user"
import Layout from "components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "components/ui/input"
import { Button } from "components/ui/button"
import { LoadingIcon } from "components/Icons"
import { RootState } from "store"
import { useSelector } from "react-redux"
import { AppDispatch } from "store"
import { Navigate } from "react-router-dom"
import LimeBoi from "assets/Jinx Soda_Lime Boi_Lime Boi.png"

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, isAuthenticated, registered } = useSelector((state: RootState) => state.user)
  const formSchema = z.object({
    email: z.string().email({ message: "Invalid Email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    if (registered) {
      dispatch(resetRegistered())
    }
  }, [registered])

  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(login(values))
  }

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <Layout title="Jinx | Login" content="Login Page">
      <div className="flex items-center justify-center mt-[150px]">
        <Card className="sm-w-[400px] md:w-[600px] shadow-2xl rounded-2xl">
          <CardHeader>
            <img src={LimeBoi} alt="Lime Boi" className="w-40 mx-auto" />
            <CardTitle className="text-center">Welcome Back!</CardTitle>
            <CardDescription className="text-center">Log in now and let's keep the fun flowing!</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Enter Email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="Enter Password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={loading}>
                  {!loading ? "Submit" : <LoadingIcon />}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default LoginPage

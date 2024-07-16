import Layout from "components/Layout"
import { Navigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "store"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form"
import { Input } from "components/ui/input"
import { Button } from "components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"
import { register } from "features/user"
import { LoadingIcon } from "components/Icons"
import LimeBoi from "assets/Jinx Soda_Lime Boi_Lime Boi.png"

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { registered, loading, isAuthenticated } = useSelector((state: RootState) => state.user)
  const formSchema = z
    .object({
      first_name: z.string().min(2, { message: "First Name must be at least 2 characters long" }),
      last_name: z.string().min(2, { message: "Last Name must be at least 2 characters long" }),
      email: z.string().email({ message: "Invalid Email" }),
      password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
      confirm_password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    })
    .refine((data) => data.password === data.confirm_password, {
      path: ["confirmPassword"],
      message: "Passwords does not match",
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(register(values))
  }

  if (registered) {
    return <Navigate to="/login" />
  }

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <Layout title="Jinx | Register" content="Register Page">
      <div className="flex items-center justify-center mt-[100px]">
        <Card className="sm:w-[400px] md:w-[600px]">
          <CardHeader>
            <img src={LimeBoi} alt="Lime Boi" className="w-40 mx-auto" />
            <CardTitle className="text-center">Hello There!</CardTitle>
            <CardDescription className="text-center">
              Sign up for an account now and let the good times roll!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter Email" {...field} />
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
                        <Input type="password" placeholder="Enter Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm Password" {...field} />
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

export default RegisterPage

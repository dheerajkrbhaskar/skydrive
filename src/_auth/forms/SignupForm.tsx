import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signupFormSchema } from "@/lib/validation"
import { toast } from "sonner"
import { Link, replace, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/express/api" //centralized axios instance (configured with baseURL, credentials, etc.)
import Title from "@/components/shared/Title"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"

const SignupForm = () => {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { fullname: "", email: "", password: "", },
  })
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUserAccount()
  const { mutateAsync: signIn, isPending: signingIn } = useSignInAccount()


  const onSubmit = async (values: z.infer<typeof signupFormSchema>) => {
    try {
      //signup
      const signUpPromise = createUser(values)
      await toast.promise(signUpPromise, {
        loading: "Creating account...",
        success: (data) => data?.message || "Account created successfully!",
        error: (e) => e?.response?.data?.message || "Sign up failed"
      })

      // auto sign-in 
      const signInPromise = signIn({ email: values.email, password: values.password });
      await toast.promise(signInPromise, {
        loading: "Signing in...",
        success: (data) => data?.message || "Signed in successfully!",
        error: (e) => e?.response?.data?.message || "Sign in failed after registration.",
      });
      form.reset()
      navigate("/", { replace: true })
    }
    catch {
    }
  }

  const isSubmitting = isCreating || signingIn

  return (
    <Form {...form}>
      <div className="w-full max-w-sm flex flex-col items-center">
        <Title />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use SkyDrive, please enter your details
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          {/* FULL NAME */}
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* EMAIL */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PASSWORD */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting || form.formState.isSubmitting}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-500 hover:to-blue-500" >
            {isSubmitting ? "Creating..." : "Sign up"}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to="/sign-in" className="text-primary-500 text-small semi-bold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm

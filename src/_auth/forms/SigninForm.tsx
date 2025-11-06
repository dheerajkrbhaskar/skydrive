import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signinFormSchema } from "@/lib/validation";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Title from "@/components/shared/Title";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";

const SigninForm = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const {mutateAsync, isPending} = useSignInAccount()

  const onSubmit = async (values: z.infer<typeof signinFormSchema>) => {
    try {
      const data = await mutateAsync(values)
       toast.success(data?.message || "Login Successful")
      form.reset();
      
      navigate("/", {replace:true})

    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <Form {...form}>
      <div className="w-full max-w-sm flex flex-col items-center">
        <Title />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back to SkyDrive
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button 
          type="submit" 
          disabled= {isPending}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-500 hover:to-blue-500" >
            {isPending ? (
              <div className="flex-center gap-2">
                Logging in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don’t have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small bold ml-1"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;

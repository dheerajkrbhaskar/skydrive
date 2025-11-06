import * as z from "zod"

export const signupFormSchema = z.object({
  fullname: z.string().min(2, { message: "Too short" }).max(50, { message: "Too Long" }),
  email: z.email(),
  password: z.string().min(8, { message: "Password must be atleast 8 characters" })
})
export const signinFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8, { message: "Password must be atleast 8 characters" })
})
export const uploadFileSchema = z.object({
  file: z.custom<File[]>(),
})
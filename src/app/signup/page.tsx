'use client'

import Link from "next/link"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Logo } from "@/components/logo"
import { useRouter } from "next/navigation"

const signupSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

export default function SignupPage() {
  const router = useRouter()
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (response.ok) {
        alert("Account created successfully!")
        router.push("/dashboard")
      } else {
        alert(data.error || "Something went wrong")
      }
    } catch (error) {
      console.error(error)
      alert("Server error. Please try again later.")
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Signup Form */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <Logo />
            <h1 className="text-3xl font-bold">Get Started</h1>
            <p className="text-muted-foreground">
              Create an account to start tracking your finances
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Create account
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/" className="underline">
                  Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right: Background image (visible on large screens) */}
      <div className="hidden lg:block">
        <Image
          src="https://placehold.co/1920x1080/CCCCFF/000000"
          alt="Finance background"
          width={1920}
          height={1080}
          className="h-full w-full object-cover dark:brightness-[0.4]"
          priority
        />
      </div>
    </div>
  )
}

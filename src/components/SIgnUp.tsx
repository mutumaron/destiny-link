import React, { useState } from "react";
import z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { Card, CardTitle, CardDescription, CardContent } from "./ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabaseClient";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z
  .object({
    email: z.string().min(2, {
      message: "Enter a valid name",
    }),
    password: z.string().min(6),
    passwordConfirm: z.string().min(6),
    firstName: z.string().min(2, {
      message: "enter a valid name",
    }),
    lastName: z.string().min(2, {
      message: "enter a valid name",
    }),
    phone: z.string().min(10, {
      message: "enter a valid phone number",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password doesn't match",
    path: ["passwordConfirm"],
  });

const SignUp = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { email, password, firstName, lastName, phone } = values;
    const { data: signupData, error: signupError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );
    if (signupError) {
      toast.error("Signup failed", { description: signupError.message });
      setLoading(false);
      return;
    }
    const user = signupData.user;
    if (user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
      });
      if (profileError) {
        toast.error("Profile creation failed!", {
          description: profileError.message,
        });
      } else {
        toast.success("Account Created!", {
          description: "Wait for the admin dashboard to load",
        });
      }
    }
    //auto login
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (loginError) {
      toast.error("Login after signup failed", {
        description: loginError.message,
      });
      setLoading(false);
      return;
    }
    toast.success("Signed up and logged in", {
      description: "Welcome to your dashboard 🎉",
    });
    window.location.href = "/dashboard";
    setLoading(false);
  }
  return (
    <Card className="bg-primary-foreground p-3 w-[500px] flex flex-col gap-3">
      <CardTitle>Create an Account</CardTitle>
      <CardDescription>
        Please use a secure password to access the admin dashboard
      </CardDescription>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="eg. Ronny" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="eg. Mutembei" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="eg. 0796509425" {...field} />
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
                      <Input
                        type="email"
                        placeholder="destinylinkmaua@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  const [showPassword, setShowPassword] = useState(false);

                  return (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="*********"
                            {...field}
                            className="pr-10" // make space for the button
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => {
                  const [showPassword, setShowPassword] = useState(false);

                  return (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="*********"
                            {...field}
                            className="pr-10" // make space for the button
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            {loading ? (
              <Button className="w-full" disabled>
                Signing In...
              </Button>
            ) : (
              <Button className="w-full">Sign In</Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignUp;

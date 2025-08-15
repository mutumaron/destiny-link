import React, { useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";

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

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Enter a valid name",
  }),
  password: z.string().min(4, {
    message: "Too short...",
  }),
});

const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { email, password } = values;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error("Login failed", { description: error.message });
      setLoading(false);
      return;
    }

    toast.success("Logged in!", {
      description: "Welcome back 🎉",
    });
    window.location.href = "/dashboard";

    setLoading(false);
  }
  return (
    <Card className="bg-primary-foreground p-3 w-[500px] flex flex-col gap-3">
      <CardTitle>Welcome Back</CardTitle>
      <CardDescription>
        Please use your credenteals to access the admin dashboard
      </CardDescription>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
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
            {loading ? (
              <Button className="w-full" disabled>
                Logging In...
              </Button>
            ) : (
              <Button className="w-full">Login</Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Login;

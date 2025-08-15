import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  created_at: string;
};

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "Enter a valid name",
  }),
  last_name: z.string().min(2, {
    message: "Enter a valid name",
  }),
  phone: z.string().min(10, {
    message: "Enter a valid Phone Number",
  }),
});

const SettingsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  const form = useForm<
    z.infer<typeof formSchema> & { email: string; role: string }
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      role: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        toast.error("Failed to load profile", { description: error.message });
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    if (!authLoading && user) {
      fetchProfile();
    }
  }, [user, authLoading]);

  useEffect(() => {
    const fetchProfiles = async () => {
      setProfilesLoading(true);
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        toast.error("Failed to fetch users", { description: error.message });
      } else {
        setProfiles(data);
      }

      setProfilesLoading(false);
    };

    if (!authLoading) fetchProfiles();
  }, [authLoading]);

  useEffect(() => {
    form.reset({
      first_name: profile?.first_name ?? "",
      last_name: profile?.last_name ?? "",
      phone: profile?.phone ?? "",
      email: profile?.email ?? "",
      role: profile?.role ?? "",
    });
  }, [profile, form]);

  if (authLoading || loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-32" />
      </div>
    );
  }

  if (!profile) return <p>No profile found.</p>;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;

    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to update profile", { description: error.message });
    } else {
      toast.success("Profile updated!");
      setProfile((prev) => (prev ? { ...prev, ...values } : null));
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={"https://github.com/shadcn.png"} />
          <AvatarFallback>RM</AvatarFallback>
        </Avatar>
        <h1 className="text-gray-500">{user?.id}</h1>
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 border p-3 rounded-lg mt-5 lg:mt-0"
          >
            <div className="flex justify-between">
              <h1 className="font-bold text-lg">Profile Details</h1>
              <div className="flex gap-5">
                {loading ? (
                  <Button
                    disabled
                    className="bg-green-800 h-8  text-white flex gap-3 items-center"
                  >
                    <Loader2 className="animate-spin" />
                    Updating...
                  </Button>
                ) : (
                  <Button className="bg-green-800 hover:bg-green-950 h-8 text-white">
                    Update
                  </Button>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="first_name"
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
                name="last_name"
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
                      <Input placeholder="eg. 0796509....." {...field} />
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
                        disabled
                        placeholder="eg. mutembei@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="eg. user,admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
      <div>
        <Table className="mt-5">
          <TableCaption>A list of users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>

              <TableHead>Status</TableHead>
              <TableHead className="text-right">Change Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((user) => {
              return (
                <TableRow key={user.id} className="cursor-pointer">
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>

                  <TableCell>Online</TableCell>
                  <TableCell className="items-center">
                    <div className="bg-primary-foreground h-7 text-center p-1 rounded-lg">
                      {user.role}
                    </div>
                  </TableCell>

                  <TableCell className="text-right flex gap-3 items-center">
                    <div>Role</div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SettingsPage;

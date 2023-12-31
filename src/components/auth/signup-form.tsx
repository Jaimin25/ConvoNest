"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";
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
import { encryptValue } from "@/lib/cryptoJS";

const signupFormSchema = z.object({
    username: z.string().min(3).max(8),
    email: z.string().email(),
    password: z.string().min(6),
});

export default function SignUpForm() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>("");

    const router = useRouter();

    const signUpForm = useForm<z.infer<typeof signupFormSchema>>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof signupFormSchema>) {
        setError("");
        setLoading(true);
        async function signup() {
            values.password = encryptValue(values.password);
            const res = await axios.post("/api/auth/signup", values);

            if (res.data.statusCode === 400) {
                setError(res.data.error);
            } else if (res.data.statusCode === 200) {
                router.push("/");
            }

            setLoading(false);
        }

        signup();
    }

    return (
        <div className="w-full flex items-center justify-center">
            <Form {...signUpForm}>
                <form
                    onSubmit={signUpForm.handleSubmit(onSubmit)}
                    className="space-y-4 w-3/4 md:w-1/3 flex flex-col">
                    {error && (
                        <Label className="w-full text-left text-red-500">
                            {error}!
                        </Label>
                    )}
                    <FormField
                        control={signUpForm.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="username"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <label className="text-sm text-left">
                        Have an account?{" "}
                        <Link
                            href="/login"
                            className="font-bold">
                            Sign In
                        </Link>
                    </label>
                    <Button
                        type="submit"
                        disabled={loading}>
                        {loading ? (
                            <>
                                <p>Signing up...</p>
                                <Loader2 className="w-4 h-4 animate-spin mx-1" />
                            </>
                        ) : (
                            "Sign up"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

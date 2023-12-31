"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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

const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export default function LoginForm() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();

    const router = useRouter();

    const loginForm = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof loginFormSchema>) {
        setError("");
        setLoading(true);
        async function signin() {
            values.password = encryptValue(values.password);
            const res = await axios.post("/api/auth/signin", values);

            if (res.data.statusCode === 400) {
                setError(res.data.error);
            } else if (res.data.statusCode === 200) {
                router.push("/");
            }

            setLoading(false);
        }

        signin();
    }

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <Form {...loginForm}>
                <form
                    onSubmit={loginForm.handleSubmit(onSubmit)}
                    className="space-y-4 w-3/4 md:w-1/3 flex flex-col">
                    {error && (
                        <Label className="w-full text-left text-red-500">
                            {error}!
                        </Label>
                    )}
                    <FormField
                        control={loginForm.control}
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
                        control={loginForm.control}
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
                        No account?{" "}
                        <Link
                            href="/signup"
                            className="font-bold">
                            Create One
                        </Link>
                    </label>
                    <Button
                        type="submit"
                        disabled={loading}>
                        {loading ? (
                            <>
                                <p>Signing in...</p>
                                <Loader2 className="w-4 h-4 animate-spin mx-1" />
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

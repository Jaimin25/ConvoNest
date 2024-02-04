'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { encryptValue } from '@/lib/cryptoJS';
import { zodResolver } from '@hookform/resolvers/zod';

import { Label } from '../ui/label';

const signupFormSchema = z.object({
  username: z.string().min(3).max(8),
  email: z.string().email(),
  password: z.string().min(6)
});

export default function SignUpForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>('');

  const router = useRouter();

  const signUpForm = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  function onSubmit(values: z.infer<typeof signupFormSchema>) {
    setError('');
    setLoading(true);
    async function signup() {
      const resLocation = await fetch(
        `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY}`
      );
      const locationdata = await resLocation.json();
      console.log(locationdata);
      if (!locationdata.city) return;
      values.password = encryptValue(values.password);

      const res = await axios.post('/api/auth/signup', {
        username: values.username,
        email: values.email,
        password: values.password,
        location: locationdata
      });

      if (res.data.statusCode === 400) {
        setError(res.data.error);
        setLoading(false);
      } else if (res.data.statusCode === 200) {
        router.push('/');
        setLoading(false);
      }

      setLoading(false);
    }

    signup();
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Form {...signUpForm}>
        <form
          onSubmit={signUpForm.handleSubmit(onSubmit)}
          className="flex w-3/4 flex-col space-y-4 md:w-1/3"
        >
          {error && (
            <Label className="w-full text-left text-red-500">{error}!</Label>
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
                    className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                    className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                    className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <label className="text-left text-sm">
            Have an account?{' '}
            <Link href="/login" className="font-bold">
              Sign In
            </Link>
          </label>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <p>Signing up...</p>
                <Loader2 className="mx-1 h-4 w-4 animate-spin" />
              </>
            ) : (
              'Sign up'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

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

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const router = useRouter();

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setError('');
    setLoading(true);
    async function signin() {
      values.password = encryptValue(values.password);
      const res = await axios.post('/api/auth/signin', values);

      if (res.data.statusCode === 400) {
        setError(res.data.error);
      } else if (res.data.statusCode === 200) {
        router.push('/');
      }

      setLoading(false);
    }

    signin();
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(onSubmit)}
          className="flex w-3/4 flex-col space-y-4 md:w-1/3"
        >
          {error && (
            <Label className="w-full text-left text-red-500">{error}!</Label>
          )}
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
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
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <label className="text-left text-sm">
            No account?{' '}
            <Link href="/signup" className="font-bold">
              Create One
            </Link>
          </label>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <p>Signing in...</p>
                <Loader2 className="mx-1 h-4 w-4 animate-spin" />
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

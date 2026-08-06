'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/Button';

export function LoginButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button variant="primary" size="md" onClick={handleLogin}>
      Sign In with Google
    </Button>
  );
}

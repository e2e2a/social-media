import SignInButton from '@/components/shared/auth/SignInButton';
import { Button } from '@/components/ui/button';
import { cn, fontPoppins } from '@/lib/utils';

export default function Home() {
    const click = () => {
        const modee = 'modal'
        mode: modee
    }
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
      <div className='space-y-6 text-center'>
        <h1
          className={cn(
            'text-6xl font-semibold text-white drop-shadow-md',
            fontPoppins.className
          )}
        >
          🔐 Auth
        </h1>
        <p className='text-white text-lg'>
          A simple authentication service
        </p>
        <div className=''>
          <SignInButton>
            <Button variant='secondary' size='lg'>
              Sign In
            </Button>
          </SignInButton>
        </div>
      </div>
    </main>
  );
}

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold neon-text mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to access your garage dashboard</p>
        </div>
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'glass-panel neon-border',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

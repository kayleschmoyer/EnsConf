import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold neon-text mb-2">Join Us</h1>
          <p className="text-gray-400">Create your account to get started</p>
        </div>
        <div className="flex justify-center">
          <SignUp
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

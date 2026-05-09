import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Input } from '@/components/ui'

const Login: React.FC = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement auth
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-bg via-s0 to-s1 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="text-4xl font-bold text-cy mb-2">⚔️</div>
                        <h1 className="text-2xl font-bold text-t0">AegisShare</h1>
                        <p className="text-xs text-t2 mt-1">Zero-Knowledge Secure File Sharing</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button variant="primary" type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-bd">
                        <p className="text-xs text-t3 text-center">
                            End-to-end encrypted. Your data is protected.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Login

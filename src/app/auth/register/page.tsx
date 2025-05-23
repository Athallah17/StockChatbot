'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import useRegister from "@/hooks/useRegister"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, Loader } from "lucide-react"

const RegisterPage = () => {
    const router = useRouter()
    const [form, setForm] = useState({ name: "", email: "", password: "" })
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const { registerAsync, isRegistering } = useRegister({
        onSuccess: () => {
        toast.success("Registration complete", { description: "You can now log in." })
        router.push("/auth/login")
        },
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        try {
        await registerAsync(form)
        } catch (err: any) {
        const errMsg = err?.message || "Registration failed. Try again."
        setError(errMsg)
        toast.error("Registration error", { description: errMsg })
        }
    }

return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <Card className="w-full max-w-md p-8 shadow-md">
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Create Account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" onChange={handleChange} required />
            </div>
            <div className="relative">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    required
                    className="pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-6 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
            <Button type="submit" className="w-full" disabled={isRegistering}>
                {isRegistering && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {isRegistering ? "Registering..." : "Register"}
            </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-600 hover:underline">Login</a>
            </p>
        </Card>
    </div>
)
}

export default RegisterPage

'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Lock, Mail, Loader, Bot } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import useLogin from "@/hooks/useLogin"

const LoginPage = () => {
  const router = useRouter()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const { loginAsync, isLoggingIn } = useLogin({
    onSuccess: (res) => {
      login(res.accessToken)
      toast.success("Login successful!")
      router.push("/home")
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loginAsync(form)
    } catch {
      toast.error("Login failed: invalid credentials")
    }
  }

  return (
    <div className="min-h-screen max-h-screen  overflow-hidden w-full flex bg-gradient-to-br from-white to-teal-100">
      {/* Left side (visual) */}
      <div className="hidden lg:flex lg:w-3/5 items-center justify-center p-32">
        <Image
          src="/images/images2.png" // Replace with your animation/image
          alt="Visual"
          className="w-full p-16"
          width={720}
          height={720}
        />
      </div>

      {/* Right side (form) */}
      <div className="w-full lg:w-2/5 flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo + title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Bot className="w-8 h-8 text-blue-600" />
              <h1 className="text-lg font-semibold text-gray-800">StockBot</h1>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-1">Log in to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot */}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(v) => setRememberMe(!!v)}
                />
                Remember Me
              </label>
              <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-1" disabled={isLoggingIn}>
              {isLoggingIn && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Bottom Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/auth/register" className="text-blue-600 font-medium hover:underline">
              Create here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

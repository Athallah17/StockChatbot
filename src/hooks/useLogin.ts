import { useMutation } from "@tanstack/react-query"
import { AuthApi, AuthRequest, AuthResponse } from '@/utils/api/auth-api'

const useLogin = ({
  onSuccess,
}: {
  onSuccess?: (res: AuthResponse) => void
} = {}) => {
  const {
    mutate: login,
    mutateAsync: loginAsync,
    data,
    error,
    isPending: isLoggingIn,
    isSuccess,
    isError,
  } = useMutation<AuthResponse, Error, AuthRequest>({
    mutationFn: async (payload) => {
      const res = await AuthApi.login(payload)
      console.log("Login response:", res)
      localStorage.setItem("accessToken", res.accessToken)
      localStorage.setItem("tokenTimestamp", Date.now().toString())
      return res
    },
    onSuccess: (res) => {
      onSuccess?.(res)
    },
    retry: 0,
  })

  return {
    login,
    loginAsync,
    data,
    error,
    isLoggingIn,
    isSuccess,
    isError,
  }
}

export default useLogin

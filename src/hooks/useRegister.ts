import { useMutation } from "@tanstack/react-query"
import { AuthApi, RegisterRequest, AuthResponse } from '@/utils/api/auth-api'

const useRegister = ({
  onSuccess,
}: {
  onSuccess?: (res: AuthResponse) => void
} = {}) => {
  const {
    mutate: register,
    mutateAsync: registerAsync,
    data,
    error,
    isPending: isRegistering,
    isSuccess,
    isError,
  } = useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: async (payload) => {
      const res = await AuthApi.register(payload)
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
    register,
    registerAsync,
    data,
    error,
    isRegistering,
    isSuccess,
    isError,
  }
}

export default useRegister

import { toast } from 'sonner'

interface ToastOptions {
  description?: string
  duration?: number
}

const useToast = () => {
  const success = (title: string, options?: ToastOptions) => {
    toast.success(title, {
      duration: options?.duration || 3000,
      description: options?.description,
      action: {
        label: 'Close',
        onClick: () => toast.dismiss(),
      },
      position: 'top-right',
    })
  }

  const error = (title: string, options?: ToastOptions) => {
    toast.error(title, {
      duration: options?.duration || 3000,
      description: options?.description,
      action: {
        label: 'Close',
        onClick: () => toast.dismiss(),
      },
      position: 'top-right',
    })
  }

  const warning = (title: string, options?: ToastOptions) => {
    toast.warning(title, {
      duration: options?.duration || 3000,
      description: options?.description,
      action: {
        label: 'Close',
        onClick: () => toast.dismiss(),
      },
      position: 'top-right',
    })
  }

  const info = (title: string, options?: ToastOptions) => {
    toast.info(title, {
      duration: options?.duration || 3000,
      description: options?.description,
      action: {
        label: 'Close',
        onClick: () => toast.dismiss(),
      },
      position: 'top-right',
    })
  }

  return {
    success,
    error,
    warning,
    info,
  }
}

export default useToast

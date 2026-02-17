import { useCallback } from 'react'

interface FileDialogOptions {
  accept?: string
  multiple?: boolean
}

const useFileDialog = () => {
  const openFileDialog = useCallback((options: FileDialogOptions = {}) => {
    return new Promise<File | File[] | null>((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = options.accept || '*'
      input.multiple = options.multiple || false

      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement
        const files = target.files

        if (files) {
          resolve(options.multiple ? Array.from(files) : files[0])
        } else {
          resolve(null)
        }
      }

      input.click()
    })
  }, [])

  return { openFileDialog }
}

export default useFileDialog

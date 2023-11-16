import { onBeforeUnmount, onMounted } from 'vue'

export default function useKeyPressed(key: string, callBack: () => void) {
  const listener = (event: KeyboardEvent) => {
    if (event.key === key) {
      callBack()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', listener)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', listener)
  })
}

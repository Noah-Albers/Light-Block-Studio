import { onMounted, onUnmounted } from 'vue'
import { Events, SignalDispatcher } from '../signals/SignalDispatcher'

// Composable function to use signals on components that can be removed from the dom and readded
export function useSignal<Key extends keyof Events>(type: Key, handler: (_: any)=>any) {

  // Hooks into the life cycle of the component its used on
  onMounted(() => SignalDispatcher.on(type, handler as any));
  onUnmounted(() => SignalDispatcher.off(type, handler as any));
}
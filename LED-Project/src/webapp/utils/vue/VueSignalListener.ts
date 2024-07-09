import { onMounted, onUnmounted } from 'vue'
import { Events, SignalDispatcher } from '../signals/SignalDispatcher'

function handleEvents(isOn: boolean, event: (keyof Events) | (keyof Events)[], handler: (_: any)=>any) {
  const mount = isOn ? SignalDispatcher.on : SignalDispatcher.off;
  

  if(!Array.isArray(event)){
    mount(event, handler);
    return;
  }

  for(let evt of event)
    mount(evt, handler);
}

// Composable function to use signals on components that can be removed from the dom and readded
export function useSignal(type: (keyof Events) | (keyof Events)[], handler: (_: any)=>any) {

  // Hooks into the life cycle of the component its used on
  onMounted(() => handleEvents(true, type, handler));
  onUnmounted(() => handleEvents(false, type, handler));
}
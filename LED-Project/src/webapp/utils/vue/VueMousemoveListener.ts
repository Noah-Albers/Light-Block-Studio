import { onMounted, onUnmounted, ref } from 'vue'

// Composable function to use signals on components that can be removed from the dom and readded
export function useMouse(mouseMove: (evt: any)=>void) {

    // State to check if the mouse is down
    const isDown = ref(false);

    // Event: When the mouse goes up
    function onUp(){
        isDown.value = false;
    }

    // Event: When the mouse moves
    function onMove(evt: any){
        if(!isDown.value) return;

        mouseMove(evt)
    }

    // Event: When the mouse clicks on a specific area
    function onClick(evt: any){

    }

    // Hooks into the life cycle of the component its used on
    onMounted(() => {
        window.addEventListener("mouseup", onUp);
        window.addEventListener("mousemove", onMove);
    });
    onUnmounted(() => {
        window.removeEventListener("mouseup", onUp);
        window.removeEventListener("mousemove", onMove);
    });

    return isDown;
}
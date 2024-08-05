// This is the "API" that takes care of executing actions on the desktop
// or web-browser (Depending on which platform the code is run)

export function isDesktop(){
    // Checks if the specific desktop communication object got injected into the page
    return (window as any).desktopAPI !== undefined;
}
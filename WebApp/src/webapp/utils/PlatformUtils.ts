import DesktopApi from "@webapp/desktopapi/DesktopApi";

function openNewWindow() {
    if (DesktopApi.isDesktop())
        DesktopApi.openNewWindow();
    else
        window.open(window.location.toString(), '_blank');
}

function openURL(url: string) {
    if (DesktopApi.isDesktop())
        DesktopApi.openURL(url);
    else
        window.open(url, '_blank');

}

export default {
    openNewWindow,
    openURL
}
import { defineStore } from 'pinia'

type View = { icon: string };
type Views = keyof typeof MainViews

export const ViewVisualizer = "Visualizer";
export const ViewCode = "Code";

export const MainViews: {[key: string]: View} = {
    [ViewCode]: { icon: "mdi-code-tags" },
    [ViewVisualizer]: { icon: "mdi-play-box-outline" }
}

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        mainView: ViewVisualizer as Views
    })
})
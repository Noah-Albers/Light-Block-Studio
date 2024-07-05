
export type BlockExport = {
    type: string,
    data: {[key: string]: string | boolean | number | object},
    subblocks?: BlockExport[]
}

export type BlockStackExport = {
    x: number,
    y: number,
    blocks: BlockExport[]
}

export type WorkspaceExport = {
    loop: BlockStackExport,
    setup: BlockStackExport,
    other: BlockStackExport[]
}

export type SettingsExport = {
    codeTemplate?: string,
    hooks: {
        pushleds?: string,
        sleep?: string,
        sethsv?: string,
        millis?: string,
        setup?: string,
        loop?: string,
    },
    previews: string[],
    selectedPreview: string | number,
    pin: number,
    loopPushLeds: boolean
    trimEmptyLines: boolean
}

export type VariablesExport = {
    name: string,
    value: string | number
}[]

export type FullExport = {
    workspace: WorkspaceExport,
    settings: SettingsExport,
    variables: VariablesExport
}


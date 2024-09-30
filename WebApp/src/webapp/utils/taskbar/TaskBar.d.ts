
export type MenuItem = Menu | Button | Seperator;

export type Menu = {
    items: (()=>MenuItem[]) | MenuItem[],
    text: string,
    disabled?: boolean,
    title?: string,
    icon?: string
};
export type Button = {
    action: ()=>void,
    icon?: string,
    text: string,
    disabled?: true,
    title?: string
}
export type Seperator = "seperator";
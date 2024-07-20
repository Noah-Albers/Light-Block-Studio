
export type MenuItem = Menu | Button | Seperator;

export type Menu = {
    items: (()=>MenuItem[]) | MenuItem[],
    text: string,
    disabled?: true,
    title?: string
};
export type Button = {
    action: ()=>void,
    text: string,
    disabled?: true,
    title?: string
}
export type Seperator = "seperator";
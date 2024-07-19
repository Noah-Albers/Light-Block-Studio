
export type MenuItem = Menu | Button | Seperator;

export type Menu = {
    items: ()=>MenuItem[],
    text: string
};
export type Button = {
    action: ()=>void,
    text: string
}
export type Seperator = "seperator";
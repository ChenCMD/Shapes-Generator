export interface Migration {
    version: number,
    migrator: (obj: { [k: string]: unknown }[]) => { [k: string]: unknown }[]
}
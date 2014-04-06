///<reference path="c:\DefinitelyTyped\node\node.d.ts"/>
declare module "jsdom" {
    export function env(url: string, scripts: string[], cb:(err: Error, window:Window) => void)
} 
declare module "request" {
    export = request
    function request(url: string, callback: (err: Error, res:any, body: any) => void): void
    
}

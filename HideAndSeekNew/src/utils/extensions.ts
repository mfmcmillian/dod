export { }

declare global {
    interface String {
        pxToInt(this: string): number
    }
}

String.prototype.pxToInt = function () {
    return parseInt(this.split('px')[0])
}
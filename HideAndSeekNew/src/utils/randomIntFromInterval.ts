export function randomIntFromInterval(
    min: number,
    max: number,
    exceptions?: number[]
): number {
    const getRandomNum = () => Math.floor(Math.random() * (max - min + 1) + min)
    const randomNumber = getRandomNum()
    if (!exceptions) return randomNumber
    // Return number that isn't the same as the exception(s)
    // E.g. Make sure 1 isn't included in [2, 5, 6] and if so run it back
    return (exceptions as any).includes(randomNumber)
        ? randomIntFromInterval(min, max, exceptions)
        : randomNumber
}

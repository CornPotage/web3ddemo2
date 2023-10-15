export const loadImage = (imageFilePath: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = imageFilePath
        img.crossOrigin = 'anonymous'

        img.addEventListener('load', function() {
            resolve(this)
        })

        addEventListener("error", (event) => reject(event.error))
    })
}
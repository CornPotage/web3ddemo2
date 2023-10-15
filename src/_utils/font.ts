import {Font, FontLoader} from "three/examples/jsm/loaders/FontLoader.js";

export const loadFont = (url: string): Promise<Font> => {
    const fontLoader = new FontLoader()
    return new Promise((resolve, reject) => fontLoader.load(url, resolve, undefined, reject))
}

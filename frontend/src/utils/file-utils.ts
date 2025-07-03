export class FileUtils {
    public static loadPageScript(src: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const script: HTMLScriptElement | null = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve('Script loaded: ' + src);
            };
            script.onerror = () => reject(new Error('Script error for: ' + src));  // можно укоротить запись
            document.body.appendChild(script);
        })
    }

    static loadPageStyle(src: string, insertBeforeElement: HTMLElement | null): void {
        const link: HTMLLinkElement | null = document.createElement("link");
        link.rel = "stylesheet";
        link.href = src;
        link.type = 'text/css';
        document.head.insertBefore(link, insertBeforeElement);
    }
}
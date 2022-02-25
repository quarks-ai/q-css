export default function createSheet(id: string) {
  const root = globalThis?.document || null

  function createCSSMediaRule(
    sourceCssText: string,
    type: number | string
  ): any {
    return {
      type,
      cssRules: [],
      insertRule(cssText: string, index: number) {
        this.cssRules.splice(index, 0, createCSSMediaRule(cssText, 1))
      },
      get cssText() {
        return sourceCssText === "@media{}"
          ? `@media{${[].map
              .call(this.cssRules, (cssRule: any) => cssRule.cssText)
              .join("")}}`
          : sourceCssText
      },
    }
  }

  const sheet =
    root && root?.head
      ? Object.assign(
          (root?.head || root).appendChild(document.createElement("style")),
          {
            innerHTML: " ",
            id,
          }
        ).sheet
      : createCSSMediaRule("", "text/css")

  return {
    sheet,
    cache: new Map(),
    toString() {
      const { cssRules }: any = sheet
      return [].map.call(cssRules, (cssRule: any) => cssRule.cssText).join("")
    },
  }
}

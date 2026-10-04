import { getDefaultExtensionManager, type FormDownSchema } from '@formdown/core'

/**
 * The CSS of the plugin field types a form holds: a field type's HTML comes with the styles it is drawn
 * by, which the component's own styles do not have.
 */
export function fieldTypeStyles(schema: FormDownSchema | null): string {
  const types = [...new Set(Object.values(schema ?? {}).map((field) => field.type))]
  return getDefaultExtensionManager().getFieldTypeRegistry().getStylesForTypes(types)
}

/**
 * Holds one stylesheet in a shadow root and replaces its text: an adopted stylesheet where the browser
 * has them (no inline style for a content security policy to weigh), a style element elsewhere.
 */
export class ShadowStyleSheet {
  private sheet?: CSSStyleSheet
  private element?: HTMLStyleElement
  private css = ''
  private readonly root: ShadowRoot

  constructor(root: ShadowRoot) {
    this.root = root
  }

  set(css: string): void {
    if (css === this.css) return
    this.css = css
    if (this.adoptable()) {
      if (!this.sheet) {
        this.sheet = new CSSStyleSheet()
        this.root.adoptedStyleSheets = [...this.root.adoptedStyleSheets, this.sheet]
      }
      this.sheet.replaceSync(css)
      return
    }
    if (!this.element) {
      this.element = document.createElement('style')
      this.element.setAttribute('data-formdown-field-types', '')
      this.root.appendChild(this.element)
    }
    this.element.textContent = css
  }

  private adoptable(): boolean {
    return 'adoptedStyleSheets' in this.root && typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype
  }
}

/**
 * @fileoverview Extension Support for FormdownUI
 * Provides integration with @formdown/core extension system
 */

import { extensionManager, registerPlugin, registerHook } from '@formdown/core'
import type { Plugin, HookContext, HookName } from '@formdown/core'

/**
 * UI-specific plugin interface extending core Plugin
 */
export interface UIPlugin extends Plugin {
  /** UI-specific component extensions */
  components?: {
    /** Custom field renderers */
    fieldRenderers?: Record<string, (field: any, context: HookContext) => string>
    /** Theme customizations */
    themes?: Record<string, any>
  }
}

/**
 * Extension integration utilities for FormdownUI
 */
export class UIExtensionSupport {
  private static instance: UIExtensionSupport | null = null
  private initialized = false

  static getInstance(): UIExtensionSupport {
    if (!UIExtensionSupport.instance) {
      UIExtensionSupport.instance = new UIExtensionSupport()
    }
    return UIExtensionSupport.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      await extensionManager.initialize()
      this.setupUIHooks()
      this.initialized = true
    } catch {
      // Extension system already initialized, silently continue
    }
  }

  private setupUIHooks(): void {
    // Hook for field rendering customization
    registerHook({
      name: 'field-render',
      priority: 1,
      handler: this.handleFieldRender.bind(this)
    })

    // Hook for validation enhancement
    registerHook({
      name: 'field-validate',
      priority: 1,
      handler: this.handleFieldValidate.bind(this)
    })
  }

  private handleFieldRender(_context: HookContext, fieldHtml: string): string {
    // UI components can use this to customize field rendering
    return fieldHtml
  }

  private handleFieldValidate(_context: HookContext, _value: any): any {
    // UI components can use this for enhanced validation
    return { valid: true, message: '' }
  }

  /**
   * Register a UI-specific plugin
   */
  async registerUIPlugin(plugin: UIPlugin): Promise<void> {
    await registerPlugin(plugin)
  }

  /**
   * Get extension statistics
   */
  getExtensionStats() {
    return extensionManager.getStats()
  }

  /**
   * Execute hooks for UI operations
   */
  async executeUIHooks(hookName: HookName, context: HookContext, ...args: any[]): Promise<any[]> {
    return extensionManager.executeHooks(hookName, context, ...args)
  }
}

// Export singleton instance
export const uiExtensionSupport = UIExtensionSupport.getInstance()

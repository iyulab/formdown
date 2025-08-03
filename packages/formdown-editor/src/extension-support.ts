/**
 * @fileoverview Extension Support for FormdownEditor
 * Provides integration with @formdown/core extension system for editor-specific features
 */

import { extensionManager, registerPlugin, registerHook } from '@formdown/core'
import type { Plugin, HookContext, HookName } from '@formdown/core'

/**
 * Editor-specific plugin interface extending core Plugin
 */
export interface EditorPlugin extends Plugin {
  /** Editor-specific extensions */
  editor?: {
    /** Syntax highlighting rules */
    syntaxHighlighting?: Record<string, any>
    /** Auto-completion providers */
    autoComplete?: Record<string, any>
    /** Custom toolbar actions */
    toolbarActions?: Array<{
      label: string
      icon?: string
      action: (editor: any) => void
    }>
  }
}

/**
 * Extension integration utilities for FormdownEditor
 */
export class EditorExtensionSupport {
  private static instance: EditorExtensionSupport | null = null
  private initialized = false

  static getInstance(): EditorExtensionSupport {
    if (!EditorExtensionSupport.instance) {
      EditorExtensionSupport.instance = new EditorExtensionSupport()
    }
    return EditorExtensionSupport.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      await extensionManager.initialize()
      this.setupEditorHooks()
      this.initialized = true
    } catch (error) {
      console.debug('Extension system already initialized or error:', error)
    }
  }

  private setupEditorHooks(): void {
    // Hook for pre-parse validation in editor
    registerHook({
      name: 'pre-parse',
      priority: 1,
      handler: this.handlePreParse.bind(this)
    })

    // Hook for post-parse processing
    registerHook({
      name: 'post-parse',
      priority: 1,
      handler: this.handlePostParse.bind(this)
    })

    // Hook for real-time validation
    registerHook({
      name: 'field-validate',
      priority: 1,
      handler: this.handleFieldValidate.bind(this)
    })
  }

  private handlePreParse(context: HookContext): HookContext {
    // Editor can use this for syntax validation before parsing
    return context
  }

  private handlePostParse(context: HookContext): HookContext {
    // Editor can use this for enhanced parsing results
    return context
  }

  private handleFieldValidate(_context: HookContext, _value: any): any {
    // Editor can use this for real-time validation feedback
    return { valid: true, message: '' }
  }

  /**
   * Register an editor-specific plugin
   */
  async registerEditorPlugin(plugin: EditorPlugin): Promise<void> {
    await registerPlugin(plugin)
  }

  /**
   * Get extension statistics
   */
  getExtensionStats() {
    return extensionManager.getStats()
  }

  /**
   * Execute hooks for editor operations
   */
  async executeEditorHooks(hookName: HookName, context: HookContext, ...args: any[]): Promise<any[]> {
    return extensionManager.executeHooks(hookName, context, ...args)
  }

  /**
   * Validate content using extension system
   */
  async validateContent(content: string): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const context: HookContext = { input: content }
      const results = await this.executeEditorHooks('field-validate', context, content)
      
      // Process validation results
      const errors: string[] = []
      results.forEach(result => {
        if (result && !result.valid && result.message) {
          errors.push(result.message)
        }
      })

      return {
        isValid: errors.length === 0,
        errors
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Validation error']
      }
    }
  }
}

// Export singleton instance
export const editorExtensionSupport = EditorExtensionSupport.getInstance()
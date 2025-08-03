/**
 * EventOrchestrator - Component event coordination system
 * 
 * This class provides centralized event coordination between different
 * components (Core, UI, Editor). It handles:
 * - Event bus creation and management
 * - Component-to-component event bridging
 * - Global event handling setup
 * - Event type safety and standardization
 */

export interface EventBus {
  emit: (event: string, data?: any) => void
  on: (event: string, handler: EventHandler) => () => void
  off: (event: string, handler: EventHandler) => void
  once: (event: string, handler: EventHandler) => void
  clear: () => void
}

export type EventHandler = (data?: any) => void

export interface Component {
  id: string
  type: 'core' | 'ui' | 'editor' | 'custom'
  eventBus?: EventBus
  emit?: (event: string, data?: any) => void
  on?: (event: string, handler: EventHandler) => () => void
}

export interface EventBridge {
  source: Component
  target: Component
  eventMappings: EventMapping[]
  isActive: boolean
}

export interface EventMapping {
  sourceEvent: string
  targetEvent: string
  transformer?: (data: any) => any
  condition?: (data: any) => boolean
}

export interface GlobalEventConfig {
  enableFormEvents: boolean
  enableFieldEvents: boolean
  enableValidationEvents: boolean
  enableLifecycleEvents: boolean
  bubbleEvents: boolean
  eventPrefix?: string
}

/**
 * Standardized Formdown events
 */
export const FormdownEvents = {
  // Form lifecycle events
  FORM_INITIALIZED: 'formdown:form:initialized',
  FORM_READY: 'formdown:form:ready',
  FORM_DESTROYED: 'formdown:form:destroyed',
  
  // Field events
  FIELD_FOCUS: 'formdown:field:focus',
  FIELD_BLUR: 'formdown:field:blur',
  FIELD_CHANGE: 'formdown:field:change',
  FIELD_INPUT: 'formdown:field:input',
  FIELD_INVALID: 'formdown:field:invalid',
  FIELD_VALID: 'formdown:field:valid',
  
  // Form data events
  DATA_CHANGE: 'formdown:data:change',
  DATA_SYNC: 'formdown:data:sync',
  DATA_RESET: 'formdown:data:reset',
  
  // Validation events
  VALIDATION_START: 'formdown:validation:start',
  VALIDATION_SUCCESS: 'formdown:validation:success',
  VALIDATION_ERROR: 'formdown:validation:error',
  VALIDATION_COMPLETE: 'formdown:validation:complete',
  
  // UI events
  UI_RENDER_START: 'formdown:ui:render:start',
  UI_RENDER_COMPLETE: 'formdown:ui:render:complete',
  UI_UPDATE: 'formdown:ui:update',
  
  // Editor events
  EDITOR_CONTENT_CHANGE: 'formdown:editor:content:change',
  EDITOR_PREVIEW_UPDATE: 'formdown:editor:preview:update',
  EDITOR_ERROR: 'formdown:editor:error',
  
  // Extension events
  EXTENSION_LOADED: 'formdown:extension:loaded',
  EXTENSION_ERROR: 'formdown:extension:error',
  
  // Schema events
  SCHEMA_CHANGE: 'formdown:schema:change',
  SCHEMA_VALIDATED: 'formdown:schema:validated'
} as const

export class EventOrchestrator {
  private eventBuses: Map<string, EventBus> = new Map()
  private eventBridges: Map<string, EventBridge> = new Map()
  private globalEventConfig: GlobalEventConfig
  private globalEventBus: EventBus

  constructor(config: Partial<GlobalEventConfig> = {}) {
    this.globalEventConfig = {
      enableFormEvents: true,
      enableFieldEvents: true,
      enableValidationEvents: true,
      enableLifecycleEvents: true,
      bubbleEvents: true,
      eventPrefix: 'formdown',
      ...config
    }

    this.globalEventBus = this.createEventBus('global')
  }

  /**
   * Create a new event bus for a component
   */
  createEventBus(id: string = `bus_${Date.now()}`): EventBus {
    const eventListeners: Map<string, Set<EventHandler>> = new Map()

    const eventBus: EventBus = {
      emit: (event: string, data?: any) => {
        const handlers = eventListeners.get(event)
        if (handlers) {
          handlers.forEach(handler => {
            try {
              handler(data)
            } catch (error) {
              console.error(`Error in event handler for ${event}:`, error)
            }
          })
        }

        // Bubble to global bus if enabled
        if (this.globalEventConfig.bubbleEvents && id !== 'global') {
          this.globalEventBus.emit(event, { source: id, data })
        }
      },

      on: (event: string, handler: EventHandler) => {
        if (!eventListeners.has(event)) {
          eventListeners.set(event, new Set())
        }
        eventListeners.get(event)!.add(handler)

        // Return unsubscribe function
        return () => {
          eventListeners.get(event)?.delete(handler)
        }
      },

      off: (event: string, handler: EventHandler) => {
        eventListeners.get(event)?.delete(handler)
      },

      once: (event: string, handler: EventHandler) => {
        const onceHandler = (data?: any) => {
          handler(data)
          eventBus.off(event, onceHandler)
        }
        return eventBus.on(event, onceHandler)
      },

      clear: () => {
        eventListeners.clear()
      }
    }

    this.eventBuses.set(id, eventBus)
    return eventBus
  }

  /**
   * Bridge events between two components
   */
  bridgeComponentEvents(source: Component, target: Component, mappings: EventMapping[]): string {
    const bridgeId = `${source.id}_to_${target.id}`
    
    const bridge: EventBridge = {
      source,
      target,
      eventMappings: mappings,
      isActive: true
    }

    // Set up event handlers for each mapping
    mappings.forEach(mapping => {
      if (source.on) {
        source.on(mapping.sourceEvent, (data) => {
          if (!bridge.isActive) return

          // Check condition if specified
          if (mapping.condition && !mapping.condition(data)) {
            return
          }

          // Transform data if transformer is provided
          let transformedData = data
          if (mapping.transformer) {
            try {
              transformedData = mapping.transformer(data)
            } catch (error) {
              console.error(`Error in event transformer for ${mapping.sourceEvent}:`, error)
              return
            }
          }

          // Emit to target
          if (target.emit) {
            target.emit(mapping.targetEvent, transformedData)
          }
        })
      }
    })

    this.eventBridges.set(bridgeId, bridge)
    return bridgeId
  }

  /**
   * Set up global event handling
   */
  setupGlobalEventHandling(): void {
    // Set up standard Formdown event handling
    if (this.globalEventConfig.enableFormEvents) {
      this.setupFormEventHandlers()
    }

    if (this.globalEventConfig.enableFieldEvents) {
      this.setupFieldEventHandlers()
    }

    if (this.globalEventConfig.enableValidationEvents) {
      this.setupValidationEventHandlers()
    }

    if (this.globalEventConfig.enableLifecycleEvents) {
      this.setupLifecycleEventHandlers()
    }
  }

  /**
   * Set up form-level event handlers
   */
  private setupFormEventHandlers(): void {
    this.globalEventBus.on(FormdownEvents.FORM_INITIALIZED, (data) => {
      console.debug('Form initialized:', data)
    })

    this.globalEventBus.on(FormdownEvents.DATA_CHANGE, (data) => {
      // Global data change handling
      this.globalEventBus.emit(FormdownEvents.DATA_SYNC, data)
    })

    this.globalEventBus.on(FormdownEvents.FORM_DESTROYED, (data) => {
      // Clean up event bridges for this form
      this.cleanupFormEventBridges(data?.formId)
    })
  }

  /**
   * Set up field-level event handlers
   */
  private setupFieldEventHandlers(): void {
    this.globalEventBus.on(FormdownEvents.FIELD_CHANGE, (data) => {
      // Trigger validation on field change
      this.globalEventBus.emit(FormdownEvents.VALIDATION_START, {
        fieldName: data.fieldName,
        value: data.value
      })
    })

    this.globalEventBus.on(FormdownEvents.FIELD_INVALID, (data) => {
      // Handle field validation errors
      console.debug('Field validation error:', data)
    })
  }

  /**
   * Set up validation event handlers
   */
  private setupValidationEventHandlers(): void {
    this.globalEventBus.on(FormdownEvents.VALIDATION_ERROR, (data) => {
      // Global validation error handling
      console.debug('Validation error:', data)
    })

    this.globalEventBus.on(FormdownEvents.VALIDATION_SUCCESS, (data) => {
      // Global validation success handling
      console.debug('Validation success:', data)
    })
  }

  /**
   * Set up lifecycle event handlers
   */
  private setupLifecycleEventHandlers(): void {
    this.globalEventBus.on(FormdownEvents.UI_RENDER_COMPLETE, (data) => {
      // Emit form ready event after UI render
      this.globalEventBus.emit(FormdownEvents.FORM_READY, data)
    })

    this.globalEventBus.on(FormdownEvents.EXTENSION_LOADED, (data) => {
      console.debug('Extension loaded:', data)
    })
  }

  /**
   * Create standard event mappings for Core-UI integration
   */
  createCoreUIBridge(coreComponent: Component, uiComponent: Component): string {
    const mappings: EventMapping[] = [
      // Core data changes -> UI updates
      {
        sourceEvent: FormdownEvents.DATA_CHANGE,
        targetEvent: FormdownEvents.UI_UPDATE,
        transformer: (data) => ({ formData: data.formData })
      },
      
      // Core validation events -> UI validation states
      {
        sourceEvent: FormdownEvents.VALIDATION_ERROR,
        targetEvent: FormdownEvents.FIELD_INVALID,
        transformer: (data) => ({ 
          fieldName: data.field, 
          errors: data.errors 
        })
      },
      
      {
        sourceEvent: FormdownEvents.VALIDATION_SUCCESS,
        targetEvent: FormdownEvents.FIELD_VALID,
        transformer: (data) => ({ fieldName: data.field })
      },

      // UI field events -> Core data changes
      {
        sourceEvent: FormdownEvents.FIELD_CHANGE,
        targetEvent: FormdownEvents.DATA_CHANGE,
        transformer: (data) => ({
          fieldName: data.fieldName,
          value: data.value,
          formData: data.formData
        })
      }
    ]

    return this.bridgeComponentEvents(coreComponent, uiComponent, mappings)
  }

  /**
   * Create standard event mappings for Core-Editor integration
   */
  createCoreEditorBridge(coreComponent: Component, editorComponent: Component): string {
    const mappings: EventMapping[] = [
      // Core schema changes -> Editor updates
      {
        sourceEvent: FormdownEvents.SCHEMA_CHANGE,
        targetEvent: FormdownEvents.EDITOR_PREVIEW_UPDATE,
        transformer: (data) => ({ schema: data.schema })
      },

      // Editor content changes -> Core parsing
      {
        sourceEvent: FormdownEvents.EDITOR_CONTENT_CHANGE,
        targetEvent: FormdownEvents.SCHEMA_CHANGE,
        transformer: (data) => ({ content: data.content })
      },

      // Core validation -> Editor error display
      {
        sourceEvent: FormdownEvents.VALIDATION_ERROR,
        targetEvent: FormdownEvents.EDITOR_ERROR,
        transformer: (data) => ({ errors: data.errors })
      }
    ]

    return this.bridgeComponentEvents(coreComponent, editorComponent, mappings)
  }

  /**
   * Get the global event bus
   */
  getGlobalEventBus(): EventBus {
    return this.globalEventBus
  }

  /**
   * Get a specific event bus by ID
   */
  getEventBus(id: string): EventBus | undefined {
    return this.eventBuses.get(id)
  }

  /**
   * Remove an event bridge
   */
  removeBridge(bridgeId: string): void {
    const bridge = this.eventBridges.get(bridgeId)
    if (bridge) {
      bridge.isActive = false
      this.eventBridges.delete(bridgeId)
    }
  }

  /**
   * Clean up event bridges for a specific form
   */
  private cleanupFormEventBridges(formId?: string): void {
    if (!formId) return

    for (const [bridgeId, bridge] of this.eventBridges.entries()) {
      if (bridgeId.includes(formId)) {
        this.removeBridge(bridgeId)
      }
    }
  }

  /**
   * Get all active bridges
   */
  getActiveBridges(): EventBridge[] {
    return Array.from(this.eventBridges.values()).filter(bridge => bridge.isActive)
  }

  /**
   * Dispose of all event buses and bridges
   */
  dispose(): void {
    // Clear all event buses
    this.eventBuses.forEach(bus => bus.clear())
    this.eventBuses.clear()

    // Deactivate all bridges
    this.eventBridges.forEach(bridge => {
      bridge.isActive = false
    })
    this.eventBridges.clear()

    // Clear global bus
    this.globalEventBus.clear()
  }

  /**
   * Enable/disable specific event types
   */
  configureEvents(config: Partial<GlobalEventConfig>): void {
    this.globalEventConfig = { ...this.globalEventConfig, ...config }
    
    // Re-setup global event handling with new config
    this.setupGlobalEventHandling()
  }

  /**
   * Get event statistics
   */
  getEventStats(): {
    totalEventBuses: number
    totalBridges: number
    activeBridges: number
  } {
    return {
      totalEventBuses: this.eventBuses.size,
      totalBridges: this.eventBridges.size,
      activeBridges: this.getActiveBridges().length
    }
  }
}
# FormDown Sample Files

This directory contains comprehensive examples showcasing FormDown's syntax and capabilities.

## Sample Files Overview

### 🏗️ **core-first-architecture.fd** - Core-First Architecture (Latest)
- Demonstrates FormManager and FormDataBinding usage
- Event-driven form management
- Framework-agnostic Core APIs
- Value priority system implementation
- Reactive data binding examples

### 📚 **basic.fd** - Getting Started
- Minimal syntax examples (empty brackets, optional inline brackets)
- Both label definition methods (parentheses vs. attributes)
- Basic input types and selections
- Simple inline field usage

### 📝 **contact.fd** - Contact Form
- Professional contact form layout
- Mixed label definition methods
- Contact preferences and priority settings
- Submit actions and form completion

### 🚀 **contact-shorthand.fd** - Contact Form (Shorthand)
- Same contact form using shorthand syntax
- Demonstrates type markers (`@`, `#`, `%`, etc.)
- Pattern shortcuts for phone validation
- Compact options syntax for selections

### 🎛️ **advanced.fd** - Advanced Features
- Custom HTML attributes (data-*, aria-*, class, style)
- CSS classes and custom styling
- Accessibility features demonstration
- Complex attribute combinations

### 👤 **registration.fd** - User Registration
- Complete user registration flow
- Privacy and preference settings
- Password and validation examples
- Terms and conditions handling

### ⚡ **registration-shorthand.fd** - User Registration (Shorthand)
- Shorthand version of registration form
- Pattern validation shortcuts
- Required field markers (`*`)
- Type-based content interpretation

### 📊 **survey.fd** - Feedback Survey
- Rating systems and NPS scoring
- User profiling and demographics
- Feature feedback collection
- Follow-up and contact preferences

### 🎟️ **event.fd** - Event Registration
- Complex event registration form
- Multiple choice options and add-ons
- Accessibility requirements handling
- Emergency contact information

### ⚡ **minimal.fd** - Minimal Syntax
- Ultra-minimal field definitions
- Progressive enhancement examples
- When to use minimal vs. full syntax
- Rapid prototyping techniques

### ♿ **accessibility.fd** - Accessibility & Custom Attributes
- ARIA attributes and screen reader support
- Custom data attributes for JavaScript
- CSS framework integration (Bootstrap, Tailwind)
- Advanced validation patterns

### 🛒 **ecommerce.fd** - E-commerce Order Form
- Complete order form with shipping/billing
- Payment method handling
- Dynamic pricing calculations
- Order confirmation and terms

### 📅 **booking-shorthand.fd** - Appointment Booking (Shorthand)
- Appointment scheduling with shorthand syntax
- Inline field integration with text
- Date/time formatting shortcuts
- Medical form patterns

### 🛍️ **ecommerce-shorthand.fd** - E-commerce Order (Shorthand)
- Product ordering with shorthand syntax
- Selection shortcuts for product options
- Address validation patterns
- Streamlined checkout flow

## Key Features Demonstrated

### ✅ **Syntax Variants**
- **Minimal**: `@field: []` and `___@field`
- **Shorthand**: `@field*: @[]` and `@field{pattern}: []`
- **Parentheses**: `@field(Label): [type]`
- **Attributes**: `@field: [type label="Label"]`

### 🎨 **HTML Integration**
- All HTML attributes supported
- CSS classes and inline styles
- Data attributes for JavaScript
- ARIA attributes for accessibility

### 📱 **Input Types**
- Text inputs (text, email, tel, url, password)
- Numbers and dates (number, date, time, range)
- Selections (radio, checkbox, select)
- Files and specialized inputs

### 🔧 **Advanced Features**
- Custom validation patterns
- Autocomplete attributes
- Conditional field display
- Real-time form updates

## Shorthand vs Standard Comparison

The shorthand samples demonstrate the same functionality with more concise syntax:

| Feature | Standard Syntax | Shorthand Syntax |
|---------|----------------|------------------|
| Required field | `@name: [text required]` | `@name*: []` |
| Email input | `@email: [email]` | `@email: @[]` |
| Phone validation | `@phone: [text pattern="^\(\d{3}\)\d{3}-\d{4}$"]` | `@phone{(###)###-####}: []` |
| Select options | `@size: [select options="S,M,L"]` | `@size{S,M,L}: s[]` |
| Inline email | `___@email[email required]` | `@___@email*` |

## Usage in Development

These samples serve as:
- **Reference** for syntax usage
- **Templates** for common form patterns
- **Testing** examples for FormDown parsers
- **Documentation** for implementation guides
- **Comparison** between standard and shorthand syntax

Copy and modify these examples to fit your specific use cases.

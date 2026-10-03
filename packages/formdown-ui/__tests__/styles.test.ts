import { formdownStyles } from '../src/styles'

// Lit is mocked in these tests: \`css\` gives back the stylesheet's text.
const styles = String(formdownStyles)

describe('formdownStyles', () => {
  it('draws checkboxes and radio buttons in the accent color', () => {
    expect(styles).toMatch(/input\[type="radio"\], input\[type="checkbox"\] \{[^}]*accent-color: var\(--formdown-accent-color, [^;]+\);/)
  })
})

describe('inline fields', () => {
  const rules = [...styles.matchAll(/\[contenteditable="true"\]:not\(textarea\)(?::[a-z()]+)*\s*\{[^}]*\}/g)].map((m) => m[0])

  it('take their colors from the theme, so a dark theme is not drawn with light fields', () => {
    expect(rules.length).toBeGreaterThan(0)
    for (const rule of rules) {
      for (const [, property, value] of rule.matchAll(/(background-color|border-color|border):\s*([^;]+);/g))
        expect(`${property}: ${value}`).toMatch(/var\(--formdown-/)
    }
  })
})

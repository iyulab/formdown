import { formdownStyles } from '../src/styles'

// Lit is mocked in these tests: \`css\` gives back the stylesheet's text.
const styles = String(formdownStyles)

describe('formdownStyles', () => {
  it('draws checkboxes and radio buttons in the accent color', () => {
    expect(styles).toMatch(/input\[type="radio"\], input\[type="checkbox"\] \{[^}]*accent-color: var\(--formdown-accent-color\);/)
  })
})

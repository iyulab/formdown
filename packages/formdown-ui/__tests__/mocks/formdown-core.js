// Mock for @formdown/core
class FormdownParser {
    parse(content) {
        return {
            fields: [],
            errors: []
        };
    }

    parseFormdown(content) {
        return {
            markdown: content || '',
            forms: []
        };
    }
}

class FormdownGenerator {
    generateHTML(content) {
        return '<div>Mock HTML</div>';
    }

    generateFormHTML(fields) {
        return '<form>Mock Form</form>';
    }
}

module.exports = { FormdownParser, FormdownGenerator };

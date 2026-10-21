/**
 * Korean validation sentences, for `messages` (`<formdown-ui>`) or `validateForm(…, { messages })`.
 */

import type { ValidationMessages } from '../constraints.js'

export const messages: ValidationMessages = {
    required: '{label} 칸을 채워 주세요',
    minLength: '{min}자 이상 입력하세요',
    maxLength: '{max}자까지 입력할 수 있습니다',
    min: '{min} 이상이어야 합니다',
    max: '{max} 이하여야 합니다',
    number: '숫자를 입력하세요',
    email: '올바른 이메일 주소를 입력하세요',
    url: '올바른 URL을 입력하세요',
    tel: '올바른 전화번호를 입력하세요',
    date: '올바른 날짜를 입력하세요',
    dateMin: '{min} 이후 날짜여야 합니다',
    dateMax: '{max} 이전 날짜여야 합니다',
    pattern: '형식이 맞지 않습니다',
}

export default messages

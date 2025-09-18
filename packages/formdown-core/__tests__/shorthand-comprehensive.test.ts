/**
 * @fileoverview SHORTHAND_SYNTAX.md 포괄적 테스트
 * 모든 단축 문법을 테스트하여 100% 단축 문법 지원을 보장
 */

import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('SHORTHAND_SYNTAX.md 포괄적 기능 테스트', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('1. Required 필드 (*)마커', () => {
        test('기본 required 마커 테스트', () => {
            const content = `
@name*: []
@email*: []
@password*: []
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(3)
            expect(result.forms[0].name).toBe('name')
            expect(result.forms[0].required).toBe(true)
            expect(result.forms[0].type).toBe('text')

            expect(result.forms[1].name).toBe('email')
            expect(result.forms[1].required).toBe(true)
            expect(result.forms[1].type).toBe('text')

            expect(result.forms[2].name).toBe('password')
            expect(result.forms[2].required).toBe(true)
            expect(result.forms[2].type).toBe('text')
        })
    })

    describe('2. 타입 마커', () => {
        test('모든 타입 마커 테스트', () => {
            const content = `
@email: @[]
@age: #[]
@phone: %[]
@website: &[]
@birth_date: d[]
@meeting_time: t[]
@appointment: dt[]
@birth_month: M[]
@work_week: W[]
@price_range: R[]
@profile_pic: F[]
@theme_color: C[]
@password: ?[]
@description: T[]
`
            const result = parser.parseFormdown(content)

            const expectedTypes = [
                'email', 'number', 'tel', 'url', 'date', 'time',
                'datetime-local', 'month', 'week', 'range', 'file',
                'color', 'password', 'textarea'
            ]

            expectedTypes.forEach((expectedType, index) => {
                expect(result.forms[index].type).toBe(expectedType)
            })
        })
    })

    describe('3. Required + 타입 조합', () => {
        test('required와 타입 마커 조합', () => {
            const content = `
@email*: @[]
@age*: #[]
@appointment*: dt[]
@description*: T[]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('email')
            expect(result.forms[0].required).toBe(true)

            expect(result.forms[1].type).toBe('number')
            expect(result.forms[1].required).toBe(true)

            expect(result.forms[2].type).toBe('datetime-local')
            expect(result.forms[2].required).toBe(true)

            expect(result.forms[3].type).toBe('textarea')
            expect(result.forms[3].required).toBe(true)
        })
    })

    describe('4. Textarea 행 수 지정', () => {
        test('textarea 행 수 지정', () => {
            const content = `
@notes: T4[]
@description*: T6[]
@bio: T3[maxlength=500]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('textarea')
            expect(result.forms[0].attributes?.rows).toBe(4)

            expect(result.forms[1].type).toBe('textarea')
            expect(result.forms[1].required).toBe(true)
            expect(result.forms[1].attributes?.rows).toBe(6)

            expect(result.forms[2].type).toBe('textarea')
            expect(result.forms[2].attributes?.rows).toBe(3)
            expect(result.forms[2].attributes?.maxlength).toBe(500)
        })
    })

    describe('5. 패턴 검증 (텍스트계열 타입)', () => {
        test('정규식 패턴', () => {
            const content = `
@username{^[a-zA-Z0-9_]{3,20}$}: []
@email{^[^@]+@company\\.com$}: @[]
@password{^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$}: ?[]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].pattern).toBe('^[a-zA-Z0-9_]{3,20}$')
            expect(result.forms[1].pattern).toBe('^[^@]+@company\\.com$')
            expect(result.forms[2].pattern).toBe('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$')
        })

        test('마스크 패턴 자동 변환', () => {
            const content = `
@phone{(###)###-####}: []
@ssn{###-##-####}: []
@credit_card{####-####-####-####}: []
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].pattern).toBe('^\\(\\d{3}\\)\\d{3}\\-\\d{4}$')
            expect(result.forms[1].pattern).toBe('^\\d{3}\\-\\d{2}\\-\\d{4}$')
            expect(result.forms[2].pattern).toBe('^\\d{4}\\-\\d{4}\\-\\d{4}\\-\\d{4}$')
        })

        test('글로브 패턴 자동 변환', () => {
            const content = `
@work_email{*@company.com}: []
@filename{*.pdf}: []
@product_code{PRD*}: []
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].pattern).toBe('^.*@company\\.com$')
            expect(result.forms[1].pattern).toBe('^.*\\.pdf$')
            expect(result.forms[2].pattern).toBe('^PRD.*$')
        })
    })

    describe('6. 포맷 지정 (날짜시간 타입)', () => {
        test('날짜시간 포맷 지정', () => {
            const content = `
@birth_date{yyyy-MM-dd}: d[]
@korean_date{yyyy년 MM월 dd일}: d[]
@meeting_time{HH:mm:ss}: t[]
@appointment{yyyy-MM-dd HH:mm}: dt[]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].format).toBe('yyyy-MM-dd')
            expect(result.forms[1].format).toBe('yyyy년 MM월 dd일')
            expect(result.forms[2].format).toBe('HH:mm:ss')
            expect(result.forms[3].format).toBe('yyyy-MM-dd HH:mm')
        })

        test('포맷과 추가 검증 조합', () => {
            const content = `
@birth_date{yyyy-MM-dd}: d[min="1980-01-01" max="2010-12-31"]
@work_time{HH:mm}: t[min="09:00" max="18:00"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].format).toBe('yyyy-MM-dd')
            expect(result.forms[0].attributes?.min).toBe('1980-01-01')
            expect(result.forms[0].attributes?.max).toBe('2010-12-31')

            expect(result.forms[1].format).toBe('HH:mm')
            expect(result.forms[1].attributes?.min).toBe('09:00')
            expect(result.forms[1].attributes?.max).toBe('18:00')
        })
    })

    describe('7. 선택 옵션 (선택 타입)', () => {
        test('라디오 버튼 옵션', () => {
            const content = `
@size{S,M,L,XL}: r[]
@priority{low,medium,high}: r[]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('radio')
            expect(result.forms[0].options).toEqual(['S', 'M', 'L', 'XL'])

            expect(result.forms[1].type).toBe('radio')
            expect(result.forms[1].options).toEqual(['low', 'medium', 'high'])
        })

        test('셀렉트 드롭다운 옵션', () => {
            const content = `
@country{USA,Canada,UK}: s[]
@language{English,Korean,Japanese}: s[]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('select')
            expect(result.forms[0].options).toEqual(['USA', 'Canada', 'UK'])

            expect(result.forms[1].type).toBe('select')
            expect(result.forms[1].options).toEqual(['English', 'Korean', 'Japanese'])
        })

        test('체크박스 그룹 옵션', () => {
            const content = `
@skills{JS,Python,Java}: c[]
@interests{Web,Mobile,AI}: c[]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('checkbox')
            expect(result.forms[0].options).toEqual(['JS', 'Python', 'Java'])

            expect(result.forms[1].type).toBe('checkbox')
            expect(result.forms[1].options).toEqual(['Web', 'Mobile', 'AI'])
        })

        test('단일 체크박스', () => {
            const content = `
@newsletter: c[]
@terms*: c[]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('checkbox')
            expect(result.forms[0].options).toBeUndefined()

            expect(result.forms[1].type).toBe('checkbox')
            expect(result.forms[1].required).toBe(true)
            expect(result.forms[1].options).toBeUndefined()
        })
    })

    describe('8. 기타 입력 허용 (*)', () => {
        test('기타 옵션 허용', () => {
            const content = `
@size{S,M,L,XL,*}: r[]
@skills{JS,Python,Java,*}: c[]
@country*{USA,Canada,UK,*}: s[]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].options).toEqual(['S', 'M', 'L', 'XL'])
            expect(result.forms[0].allowOther).toBe(true)

            expect(result.forms[1].options).toEqual(['JS', 'Python', 'Java'])
            expect(result.forms[1].allowOther).toBe(true)

            expect(result.forms[2].options).toEqual(['USA', 'Canada', 'UK'])
            expect(result.forms[2].allowOther).toBe(true)
            expect(result.forms[2].required).toBe(true)
        })
    })

    describe('9. 라벨 정의', () => {
        test('괄호를 이용한 라벨 정의', () => {
            const content = `
@first_name(Full Name)*: []
@user_email(Email Address)*: @[]
@t_shirt_size(T-Shirt Size){S,M,L,XL}: r[]
@birth_date(Birth Date){yyyy-MM-dd}: d[]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].label).toBe('Full Name')
            expect(result.forms[0].required).toBe(true)

            expect(result.forms[1].label).toBe('Email Address')
            expect(result.forms[1].type).toBe('email')
            expect(result.forms[1].required).toBe(true)

            expect(result.forms[2].label).toBe('T-Shirt Size')
            expect(result.forms[2].options).toEqual(['S', 'M', 'L', 'XL'])

            expect(result.forms[3].label).toBe('Birth Date')
            expect(result.forms[3].format).toBe('yyyy-MM-dd')
        })
    })

    describe('10. 인라인 필드', () => {
        test('인라인 단축 표기법', () => {
            const content = `
Hello ___@name*!
Your email: @___@email*
Age: #___@age* years old
Phone: %___@phone
Birth date: d___@birth_date{yyyy-MM-dd}
Meeting time: t___@meeting_time{HH:mm}
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(6)

            // 모든 필드가 인라인이어야 함
            result.forms.forEach(field => {
                expect(field.inline).toBe(true)
            })

            expect(result.forms[0].name).toBe('name')
            expect(result.forms[0].required).toBe(true)
            expect(result.forms[0].type).toBe('text')

            expect(result.forms[1].name).toBe('email')
            expect(result.forms[1].type).toBe('email')
            expect(result.forms[1].required).toBe(true)

            expect(result.forms[2].name).toBe('age')
            expect(result.forms[2].type).toBe('number')
            expect(result.forms[2].required).toBe(true)

            expect(result.forms[3].name).toBe('phone')
            expect(result.forms[3].type).toBe('tel')

            expect(result.forms[4].name).toBe('birth_date')
            expect(result.forms[4].type).toBe('date')
            expect(result.forms[4].format).toBe('yyyy-MM-dd')

            expect(result.forms[5].name).toBe('meeting_time')
            expect(result.forms[5].type).toBe('time')
            expect(result.forms[5].format).toBe('HH:mm')
        })
    })

    describe('11. 복합 조합 예시', () => {
        test('복잡한 단축 표기법 조합', () => {
            const content = `
@username(Username)*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="Enter username"]
@birth_date(Birth Date){yyyy-MM-dd}: d[min="1980-01-01" max="2010-12-31"]
@skills(Your Skills)*{Frontend,Backend,Mobile,*}: c[]
@phone(Phone Number){(###)###-####}: [title="US phone number format"]
`
            const result = parser.parseFormdown(content)

            // username 필드
            expect(result.forms[0].label).toBe('Username')
            expect(result.forms[0].required).toBe(true)
            expect(result.forms[0].pattern).toBe('^[a-zA-Z0-9_]{3,20}$')
            expect(result.forms[0].placeholder).toBe('Enter username')

            // birth_date 필드
            expect(result.forms[1].label).toBe('Birth Date')
            expect(result.forms[1].type).toBe('date')
            expect(result.forms[1].format).toBe('yyyy-MM-dd')
            expect(result.forms[1].attributes?.min).toBe('1980-01-01')
            expect(result.forms[1].attributes?.max).toBe('2010-12-31')

            // skills 필드
            expect(result.forms[2].label).toBe('Your Skills')
            expect(result.forms[2].required).toBe(true)
            expect(result.forms[2].type).toBe('checkbox')
            expect(result.forms[2].options).toEqual(['Frontend', 'Backend', 'Mobile'])
            expect(result.forms[2].allowOther).toBe(true)

            // phone 필드
            expect(result.forms[3].label).toBe('Phone Number')
            expect(result.forms[3].pattern).toBe('^\\(\\d{3}\\)\\d{3}\\-\\d{4}$')
            expect(result.forms[3].attributes?.title).toBe('US phone number format')
        })
    })

    describe('12. 실제 사용 예시 - 회원가입 폼', () => {
        test('회원가입 폼 단축 표기법', () => {
            const content = `
# User Registration

@username(Username)*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="3-20 characters"]
@email(Email Address)*{^[^@]+@[^@]+\\.[^@]+$}: []
@password(Password)*{^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$}: []
@confirm_password(Confirm Password)*: ?[minlength=8]
@phone(Phone Number){(###)###-####}: []
@birth_date(Birth Date){yyyy-MM-dd}: d[min="1900-01-01" max="2010-12-31"]

@gender(Gender){male,female,other}: r[]
@interests(Interests){Web,Mobile,AI,Gaming,*}: c[]
@newsletter(Subscribe to newsletter): c[]

@bio(About You): T4[maxlength=500 placeholder="Tell us about yourself..."]
@terms(I agree to terms and conditions)*: c[]

@register: [submit label="Create Account"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(12)

            // username
            expect(result.forms[0].label).toBe('Username')
            expect(result.forms[0].required).toBe(true)
            expect(result.forms[0].pattern).toBe('^[a-zA-Z0-9_]{3,20}$')

            // gender radio
            const genderField = result.forms.find(f => f.name === 'gender')
            expect(genderField?.type).toBe('radio')
            expect(genderField?.options).toEqual(['male', 'female', 'other'])

            // interests checkbox with other
            const interestsField = result.forms.find(f => f.name === 'interests')
            expect(interestsField?.type).toBe('checkbox')
            expect(interestsField?.options).toEqual(['Web', 'Mobile', 'AI', 'Gaming'])
            expect(interestsField?.allowOther).toBe(true)

            // bio textarea
            const bioField = result.forms.find(f => f.name === 'bio')
            expect(bioField?.type).toBe('textarea')
            expect(bioField?.attributes?.rows).toBe(4)
            expect(bioField?.attributes?.maxlength).toBe(500)
        })
    })

    describe('13. 실제 사용 예시 - 예약 시스템', () => {
        test('예약 시스템 인라인 단축 표기법', () => {
            const content = `
# Appointment Booking

Dear ___@customer_name*,

Please schedule your appointment:
- Service: ___@service{Consultation,Checkup,Treatment}: s[]
- Date: d___@appointment_date{yyyy-MM-dd}: [min="2024-01-01"]
- Time: t___@appointment_time{HH:mm}: [min="09:00" max="17:00" step="1800"]
- Phone: %___@phone{(###)###-####}

@special_requests(Special Requests): T3[placeholder="Any special requirements?"]
@reminder_method(Reminder Method){Email,SMS,Phone}: r[]

@book_appointment: [submit label="Book Appointment"]
`
            const result = parser.parseFormdown(content)

            // 인라인 필드들 확인
            const inlineFields = result.forms.filter(f => f.inline)
            expect(inlineFields).toHaveLength(5)

            const customerNameField = result.forms.find(f => f.name === 'customer_name')
            expect(customerNameField?.inline).toBe(true)
            expect(customerNameField?.required).toBe(true)

            const serviceField = result.forms.find(f => f.name === 'service')
            expect(serviceField?.inline).toBe(true)
            expect(serviceField?.type).toBe('select')
            expect(serviceField?.options).toEqual(['Consultation', 'Checkup', 'Treatment'])

            const dateField = result.forms.find(f => f.name === 'appointment_date')
            expect(dateField?.inline).toBe(true)
            expect(dateField?.type).toBe('date')
            expect(dateField?.format).toBe('yyyy-MM-dd')

            const timeField = result.forms.find(f => f.name === 'appointment_time')
            expect(timeField?.inline).toBe(true)
            expect(timeField?.type).toBe('time')
            expect(timeField?.format).toBe('HH:mm')

            const phoneField = result.forms.find(f => f.name === 'phone')
            expect(phoneField?.inline).toBe(true)
            expect(phoneField?.type).toBe('tel')
            expect(phoneField?.pattern).toBe('^\\(\\d{3}\\)\\d{3}\\-\\d{4}$')
        })
    })

    describe('14. 혼합 사용 예시', () => {
        test('단축표기법과 전체 문법 혼합 사용', () => {
            const content = `
# Mixed Usage Example

@name*: []
@email*: @[]
@age: #[min=18]
@phone{(###)###-####}: []

@birth_date{yyyy-MM-dd}: d[min="1980-01-01" max="2010-12-31"]
@skills*{Frontend,Backend,DevOps,*}: c[class="skill-tags"]
@work_time{HH:mm}: t[min="09:00" max="18:00"]

@advanced_options: [checkbox options="option1,option2,option3" class="advanced" data-toggle="collapse"]
@terms: [checkbox required content="I agree to the terms and conditions"]
@complex_validation: [text pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$" title="Password requirements..."]
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(10)

            // 단축표기법 필드들
            expect(result.forms[0].required).toBe(true)
            expect(result.forms[1].type).toBe('email')
            expect(result.forms[2].type).toBe('number')
            expect(result.forms[3].pattern).toBe('^\\(\\d{3}\\)\\d{3}\\-\\d{4}$')

            // 혼합 사용 필드들
            const skillsField = result.forms.find(f => f.name === 'skills')
            expect(skillsField?.type).toBe('checkbox')
            expect(skillsField?.required).toBe(true)
            expect(skillsField?.options).toEqual(['Frontend', 'Backend', 'DevOps'])
            expect(skillsField?.allowOther).toBe(true)
            expect(skillsField?.attributes?.class).toBe('skill-tags')

            // 전체 문법 필드들
            const advancedField = result.forms.find(f => f.name === 'advanced_options')
            expect(advancedField?.type).toBe('checkbox')
            expect(advancedField?.options).toEqual(['option1', 'option2', 'option3'])
            expect(advancedField?.attributes?.class).toBe('advanced')
        })
    })

    describe('15. 엣지 케이스 및 오류 처리', () => {
        test('잘못된 단축 표기법 처리', () => {
            const content = `
@field1*{}: []
@field2: []
@field3*: #[]
@field4{valid,options}: r[]
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(4)

            // 빈 중괄호는 무시되어야 함
            expect(result.forms[0].pattern).toBeUndefined()
            expect(result.forms[0].required).toBe(true)

            // 정상적인 필드들은 올바르게 파싱
            expect(result.forms[2].type).toBe('number')
            expect(result.forms[2].required).toBe(true)

            expect(result.forms[3].type).toBe('radio')
            expect(result.forms[3].options).toEqual(['valid', 'options'])
        })

        test('복잡한 정규식과 이스케이프 문자', () => {
            const content = `
@complex_regex{^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$}: []
@escaped_pattern{test\\.pdf}: []
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].pattern).toBe('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
            expect(result.forms[1].pattern).toBe('test\\.pdf')
        })

        test('인라인과 블록 필드 혼합', () => {
            const content = `
Your name is ___@name* and age is #___@age*.

@email*: @[]
@bio: T3[]
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(4)

            // 인라인 필드들
            expect(result.forms[0].inline).toBe(true)
            expect(result.forms[0].required).toBe(true)
            expect(result.forms[1].inline).toBe(true)
            expect(result.forms[1].type).toBe('number')

            // 블록 필드들
            expect(result.forms[2].inline).toBeUndefined()
            expect(result.forms[2].type).toBe('email')
            expect(result.forms[3].type).toBe('textarea')
            expect(result.forms[3].attributes?.rows).toBe(3)
        })
    })
})
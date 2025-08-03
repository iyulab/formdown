# FormDown 단축표기법 (Shorthand Syntax)

FormDown의 단축표기법은 자주 사용하는 패턴을 간결하게 표현하는 **sugar syntax**입니다.

## 핵심 원칙

1. **완전 호환성**: 모든 단축표기법은 `[attributes]` 문법으로 완전 변환 가능
2. **타입별 해석**: `{내용}`은 타입에 의해 적절하게 해석됨
3. **추가 검증**: 복잡한 검증은 표준 HTML5 속성 사용
4. **Sugar Syntax**: 기능 제한 없이 편의성만 제공

## 단축표기법 마커

### Required 마커
- `*` - 필드명 뒤에 위치

### 타입 마커 (대괄호 앞)
- `@` = email
- `#` = number
- `%` = tel
- `&` = url
- `d` = date
- `t` = time
- `dt` = datetime-local
- `M` = month
- `W` = week
- `R` = range
- `F` = file
- `C` = color
- `?` = password
- `T` = textarea (+숫자로 행 수 지정)
- `r` = radio
- `s` = select
- `c` = checkbox

### 내용 정의 (`{내용}`)
**핵심 원리**: `{내용}`은 타입에 의해 해석됨
- **텍스트계열 타입** → `pattern` 속성 (정규식 검증)
- **날짜시간 타입** → `format` 속성 (포맷 지정)
- **선택 타입** → `options` 속성 (선택 옵션)

### 라벨 정의
- `(라벨텍스트)` = [label="LABEL_TEXT"]

### 인라인 표기
- `타입마커___@필드명*` = 인라인 필드 (예: `@___@email*`, `#___@age`)

## 타입별 해석 규칙

| 타입 마커 | 타입 | `{내용}` 해석 | 속성 |
|-----------|------|---------------|------|
| (없음), `@`, `#`, `%`, `&`, `?`, `T` | 텍스트계열 | 정규식 패턴 | `pattern="내용"` |
| `d`, `t`, `dt` | 날짜시간 | 포맷 지정 | `format="내용"` |
| `r`, `s`, `c` | 선택 | 옵션 목록 | `options="내용"` |

## 1. Required 필드

### 단축표기법
```formdown
@name*: []
@email*: []
@password*: []
```

### 변환 결과
```formdown
@name: [text required]
@email: [text required]
@password: [text required]
```

## 2. 타입 마커

### 단축표기법
```formdown
@email: @[]
@age: #[]
@phone: %[]
@website: &[]
@birth_date: d[]
@meeting_time: t[]
@appointment: dt[]
@password: ?[]
@description: T[]
```

### 변환 결과
```formdown
@email: [email]
@age: [number]
@phone: [tel]
@website: [url]
@birth_date: [date]
@meeting_time: [time]
@appointment: [datetime-local]
@password: [password]
@description: [textarea]
```

## 3. Required + 타입 조합

### 단축표기법
```formdown
@email*: @[]
@age*: #[]
@appointment*: dt[]
@description*: T[]
```

### 변환 결과
```formdown
@email: [email required]
@age: [number required]
@appointment: [datetime-local required]
@description: [textarea required]
```

## 4. Textarea 행 수 지정

### 단축표기법
```formdown
@notes: T4[]
@description*: T6[]
@bio: T3[maxlength=500]
```

### 변환 결과
```formdown
@notes: [textarea rows=4]
@description: [textarea required rows=6]
@bio: [textarea rows=3 maxlength=500]
```

## 5. 패턴 검증 (텍스트계열 타입)

### 정규식 패턴
```formdown
// 단축표기법
@username{^[a-zA-Z0-9_]{3,20}$}: []
@email{^[^@]+@company\.com$}: @[]
@password{^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$}: ?[]

// 변환 결과
@username: [text pattern="^[a-zA-Z0-9_]{3,20}$"]
@email: [email pattern="^[^@]+@company\.com$"]
@password: [password pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$"]
```

### 마스크 패턴 (자동 정규식 변환)
```formdown
// 단축표기법 (사용자 친화적)
@phone{(###)###-####}: []
@ssn{###-##-####}: []
@credit_card{####-####-####-####}: []

// 변환 결과
@phone: [text pattern="^\(\d{3}\)\d{3}-\d{4}$"]
@ssn: [text pattern="^\d{3}-\d{2}-\d{4}$"]
@credit_card: [text pattern="^\d{4}-\d{4}-\d{4}-\d{4}$"]
```

### 글로브 패턴 (자동 정규식 변환)
```formdown
// 단축표기법
@work_email{*@company.com}: []
@filename{*.pdf}: []
@product_code{PRD*}: []

// 변환 결과
@work_email: [text pattern="^.*@company\.com$"]
@filename: [text pattern="^.*\.pdf$"]
@product_code: [text pattern="^PRD.*$"]
```

### 패턴 변환 규칙
```
# → \d          (숫자)
* → .*          (임의 문자열)
? → .           (임의 한 문자)
( ) - / .       → \( \) \- \/ \.  (이스케이프)
```

## 6. 포맷 지정 (날짜시간 타입)

### 단축표기법
```formdown
@birth_date{yyyy-MM-dd}: d[]
@korean_date{yyyy년 MM월 dd일}: d[]
@meeting_time{HH:mm:ss}: t[]
@appointment{yyyy-MM-dd HH:mm}: dt[]
```

### 변환 결과
```formdown
@birth_date: [date format="yyyy-MM-dd"]
@korean_date: [date format="yyyy년 MM월 dd일"]
@meeting_time: [time format="HH:mm:ss"]
@appointment: [datetime-local format="yyyy-MM-dd HH:mm"]
```

### 추가 검증과 조합
```formdown
// 포맷 + 범위 제한
@birth_date{yyyy-MM-dd}: d[min="1980-01-01" max="2010-12-31"]
@work_time{HH:mm}: t[min="09:00" max="18:00"]

// 변환 결과
@birth_date: [date format="yyyy-MM-dd" min="1980-01-01" max="2010-12-31"]
@work_time: [time format="HH:mm" min="09:00" max="18:00"]
```

## 7. 선택 옵션 (선택 타입)

### 단축표기법
```formdown
// 라디오 버튼
@size{S,M,L,XL}: r[]
@priority{low,medium,high}: r[]

// 셀렉트 드롭다운
@country{USA,Canada,UK}: s[]
@language{English,Korean,Japanese}: s[]

// 체크박스 그룹
@skills{JS,Python,Java}: c[]
@interests{Web,Mobile,AI}: c[]

// 단일 체크박스
@newsletter: c[]
@terms*: c[]
```

### 변환 결과
```formdown
@size: [radio options="S,M,L,XL"]
@priority: [radio options="low,medium,high"]

@country: [select options="USA,Canada,UK"]
@language: [select options="English,Korean,Japanese"]

@skills: [checkbox options="JS,Python,Java"]
@interests: [checkbox options="Web,Mobile,AI"]

@newsletter: [checkbox]
@terms: [checkbox required]
```

## 8. 기타 입력 허용

### 단축표기법
```formdown
@size{S,M,L,XL,*}: r[]
@skills{JS,Python,Java,*}: c[]
@country*{USA,Canada,UK,*}: s[]
```

### 변환 결과
```formdown
@size: [radio options="S,M,L,XL" allow-other]
@skills: [checkbox options="JS,Python,Java" allow-other]
@country: [select required options="USA,Canada,UK" allow-other]
```

## 9. 라벨 정의

### 단축표기법
```formdown
@first_name(Full Name)*: []
@user_email(Email Address)*: @[]
@t_shirt_size(T-Shirt Size){S,M,L,XL}: r[]
@birth_date(Birth Date){yyyy-MM-dd}: d[]
```

### 변환 결과
```formdown
@first_name: [text required label="Full Name"]
@user_email: [email required label="Email Address"]
@t_shirt_size: [radio options="S,M,L,XL" label="T-Shirt Size"]
@birth_date: [date format="yyyy-MM-dd" label="Birth Date"]
```

## 10. 인라인 필드

### 단축표기법
```formdown
Hello ___@name*!
Your email: @___@email*
Age: #___@age* years old
Phone: %___@phone
Birth date: d___@birth_date{yyyy-MM-dd}
Meeting time: t___@meeting_time{HH:mm}
```

### 변환 결과
```formdown
Hello ___@name[text required]!
Your email: ___@email[email required]
Age: ___@age[number required] years old
Phone: ___@phone[tel]
Birth date: ___@birth_date[date format="yyyy-MM-dd"]
Meeting time: ___@meeting_time[time format="HH:mm"]
```

## 11. 복합 조합 예시

### 단축표기법
```formdown
@username(Username)*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="Enter username"]
@birth_date(Birth Date){yyyy-MM-dd}: d[min="1980-01-01" max="2010-12-31"]
@skills(Your Skills)*{Frontend,Backend,Mobile,*}: c[]
@phone(Phone Number){(###)###-####}: [title="US phone number format"]
```

### 변환 결과
```formdown
@username: [text required pattern="^[a-zA-Z0-9_]{3,20}$" label="Username" placeholder="Enter username"]
@birth_date: [date format="yyyy-MM-dd" label="Birth Date" min="1980-01-01" max="2010-12-31"]
@skills: [checkbox required options="Frontend,Backend,Mobile" allow-other label="Your Skills"]
@phone: [text pattern="^\(\d{3}\)\d{3}-\d{4}$" label="Phone Number" title="US phone number format"]
```

## 실제 사용 예시

### 회원가입 폼
```formdown
# User Registration

@username(Username)*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="3-20 characters"]
@email(Email Address)*{^[^@]+@[^@]+\.[^@]+$}: []
@password(Password)*{^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$}: []
@confirm_password(Confirm Password)*: ?[minlength=8]
@phone(Phone Number){(###)###-####}: []
@birth_date(Birth Date){yyyy-MM-dd}: d[min="1900-01-01" max="2010-12-31"]

@gender(Gender){male,female,other}: r[]
@interests(Interests){Web,Mobile,AI,Gaming,*}: c[]
@newsletter(Subscribe to newsletter): c[]

@bio(About You): T4[maxlength=500 placeholder="Tell us about yourself..."]
@terms(I agree to terms and conditions)*: c[]

@register: [submit label="Create Account"]
```

### 예약 시스템
```formdown
# Appointment Booking

Dear @___@customer_name*,

Please schedule your appointment:
- Service: @___@service{Consultation,Checkup,Treatment}: s[]
- Date: d___@appointment_date{yyyy-MM-dd}: [min="2024-01-01"]
- Time: t___@appointment_time{HH:mm}: [min="09:00" max="17:00" step="1800"]
- Phone: %___@phone{(###)###-####}

@special_requests(Special Requests): T3[placeholder="Any special requirements?"]
@reminder_method(Reminder Method){Email,SMS,Phone}: r[]

@book_appointment: [submit label="Book Appointment"]
```

### 상품 주문 폼
```formdown
# Product Order

@customer_name(Customer Name)*: []
@email(Email)*{^[^@]+@[^@]+\.[^@]+$}: []
@phone(Phone){(###)###-####}: []

@product(Product)*{Laptop,Desktop,Tablet,Phone}: s[]
@size(Size){S,M,L,XL,*}: r[]
@quantity(Quantity)*: #[min=1 max=10]
@delivery_date(Delivery Date)*{yyyy-MM-dd}: d[min="2024-01-01"]

@payment_method(Payment Method)*{Credit Card,PayPal,Bank Transfer,*}: r[]
@billing_address(Billing Address)*: T3[]
@special_instructions(Special Instructions): T2[placeholder="Delivery instructions..."]

@expedited_shipping(Expedited Shipping): c[]
@gift_wrap(Gift Wrap): c[]

@place_order: [submit label="Place Order"]
```

## 혼합 사용 (권장)

복잡도에 따라 적절한 문법 선택:

```formdown
# Mixed Usage Example

// 간단한 경우 - 단축표기법
@name*: []
@email*: @[]
@age: #[min=18]
@phone{(###)###-####}: []

// 중간 복잡도 - 혼합 사용
@birth_date{yyyy-MM-dd}: d[min="1980-01-01" max="2010-12-31"]
@skills*{Frontend,Backend,DevOps,*}: c[class="skill-tags"]
@work_time{HH:mm}: t[min="09:00" max="18:00"]

// 복잡한 경우 - 전체 문법
@advanced_options: [checkbox options="option1,option2,option3" class="advanced" data-toggle="collapse"]
@terms: [checkbox required content="I agree to the terms and conditions"]
@complex_validation: [text pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$" title="Password requirements..."]
```

## 구현 가이드

### 파서 처리 순서
1. 라벨 `()`추출
2. Required `*` 마커 추출
3. 내용 `{}` 추출
4. 타입 마커 추출
5. 타입에 따른 `{}` 내용 해석
6. 단축표기법을 전체 문법으로 변환
7. 기존 속성과 병합

### 내용 해석 알고리즘
```javascript
function interpretContent(content, typeMarker) {
  // 선택 타입: options 속성
  if (['r', 's', 'c'].includes(typeMarker)) {
    const hasOther = content.includes(',*');
    const options = content.replace(',*', '');
    return {
      options: options,
      allowOther: hasOther
    };
  }
  
  // 날짜시간 타입: format 속성
  if (['d', 't', 'dt'].includes(typeMarker)) {
    return { format: content };
  }
  
  // 텍스트계열 타입: pattern 속성 (마스크/글로브 변환 포함)
  let pattern = content;
  
  // 마스크 패턴 변환
  if (content.includes('#') || (content.includes('*') && !content.match(/^\^.*\$$/))) {
    pattern = '^' + content
      .replace(/[().\-\/]/g, '\\$&')  // 특수문자 이스케이프
      .replace(/#/g, '\\d')           // # → \d
      .replace(/\*/g, '.*')           // * → .*
      + '$';
  }
  
  return { pattern: pattern };
}
```

## 장점

✅ **학습 용이성**: 필요한 부분만 단축표기법 학습
✅ **점진적 채택**: 단순한 것부터 시작해서 복잡해지면 전체 문법 사용
✅ **완전한 호환성**: 어떤 방식으로 작성해도 동일한 결과
✅ **타입 안전성**: 타입에 따른 명확한 해석 규칙
✅ **직관적 패턴**: 마스크, 글로브 패턴을 자연스럽게 사용
✅ **논리적 일관성**: 하나의 `{내용}`으로 타입별 주요 속성 결정
✅ **확장성**: 표준 HTML5 속성으로 복잡한 검증 지원
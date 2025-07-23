# FormDown Hidden Form Architecture

> **Design Philosophy**: HTML `form` attribute를 활용한 실용적이고 깔끔한 Form 관리

---

## 🎯 설계 개요

### 핵심 아이디어
- **Hidden Form 요소**: `<form hidden>` 태그로 form 속성만 정의
- **form 속성 연결**: 모든 input 요소는 `form="form-id"` 속성으로 연결
- **자유로운 배치**: 필드들이 문서 어디든 위치할 수 있음
- **명확한 분리**: Form 정의와 필드 정의의 명확한 역할 분담

### 기본 구조
```
1. @form[attributes] → <form hidden id="auto-or-custom-id" attributes>
2. @field: [type form="form-id"] → <input form="form-id" ...>
3. 자동 ID 할당 또는 명시적 ID 지정
```

---

## 📋 문법 정의

### 1. Form 선언 문법
```formdown
# 기본 형태
@form[form_attributes]

# 필수 속성들
@form[action="/submit" method="POST"]
@form[action="/upload" method="POST" enctype="multipart/form-data"]

# 커스텀 ID 지정
@form[id="custom-form" action="/submit" method="POST"]

# 모든 HTML form 속성 지원
@form[action="/submit" method="POST" target="_blank" autocomplete="off" novalidate]
```

### 2. 필드 연결 문법
```formdown
# 자동 연결 (가장 최근 @form에 연결)
@field: [type attributes]

# 명시적 연결
@field: [type form="form-id" attributes]

# 인라인 필드도 동일
___@field[type form="form-id"]
___@field  # 자동 연결
```

---

## 🔧 구현 규칙

### 1. Form ID 자동 할당
```formdown
# ID 미지정시 자동 할당
@form[action="/submit"]                → id="formdown-form-1"
@form[action="/login"]                 → id="formdown-form-2"

# ID 지정시 그대로 사용
@form[id="login-form" action="/login"] → id="login-form"
```

### 2. 필드 자동 연결 규칙
```formdown
@form[action="/submit"]  # formdown-form-1 생성

@username: [text]        # 자동으로 form="formdown-form-1"
@email: [email]          # 자동으로 form="formdown-form-1"

@form[id="other" action="/other"]  # other 생성

@other_field: [text]     # 자동으로 form="other"
@explicit: [text form="formdown-form-1"]  # 명시적 지정
```

### 3. 기본값 처리
```formdown
# @form 없이 필드만 있는 경우
@username: [text]
# → 자동으로 기본 form 생성: <form hidden id="formdown-form-default" action="." method="GET">

# form 속성이 존재하지 않는 ID 참조시
@field: [text form="non-existent"]
# → 경고 로그 + 가장 최근 form 또는 기본 form에 연결
```

---

## 🎨 사용 시나리오

### 시나리오 1: 단일 Form (기본)
```formdown
# Contact Form
@form[action="/contact" method="POST"]

@name: [text required]
@email: [email required]
@subject: [text maxlength=100]
@message: [textarea required rows=5]
@submit: [submit label="Send Message"]
```

**생성되는 HTML:**
```html
<form hidden id="formdown-form-1" action="/contact" method="POST"></form>

<div class="formdown-field">
  <label for="name">Name *</label>
  <input type="text" id="name" name="name" required form="formdown-form-1">
</div>
<div class="formdown-field">
  <label for="email">Email *</label>
  <input type="email" id="email" name="email" required form="formdown-form-1">
</div>
<div class="formdown-field">
  <label for="subject">Subject</label>
  <input type="text" id="subject" name="subject" maxlength="100" form="formdown-form-1">
</div>
<div class="formdown-field">
  <label for="message">Message *</label>
  <textarea id="message" name="message" required rows="5" form="formdown-form-1"></textarea>
</div>
<button type="submit" form="formdown-form-1">Send Message</button>
```

### 시나리오 2: 다중 Form
```formdown
# Login & Registration System

## Form 정의
@form[id="login-form" action="/login" method="POST"]
@form[id="register-form" action="/register" method="POST"]

## Login Section
### Login
@login_username: [text required placeholder="Username" form="login-form"]
@login_password: [password required form="login-form"]
@remember_me: [checkbox content="Remember me" form="login-form"]
@login_submit: [submit label="Login" form="login-form"]

## Registration Section  
### Create Account
@reg_username: [text required minlength=3 placeholder="Choose username" form="register-form"]
@reg_email: [email required placeholder="your@email.com" form="register-form"]
@reg_password: [password required minlength=8 form="register-form"]
@reg_confirm: [password required placeholder="Confirm password" form="register-form"]
@terms_agree: [checkbox required content="I agree to terms" form="register-form"]
@register_submit: [submit label="Create Account" form="register-form"]
```

### 시나리오 3: 인라인 필드와 조합
```formdown
# Survey Form
@form[id="survey" action="/survey" method="POST"]

## Personal Information
Hello! Please tell us about yourself.

Your name is ___@name[text required form="survey"] and you are ___@age[number min=18 max=100 form="survey"] years old.

You can be reached at ___@email[email required form="survey"].

You live in ___@city[text form="survey"], ___@country[select options="USA,Canada,UK,Other" form="survey"].

## Preferences
Your favorite programming language is ___@language[select options="JavaScript,Python,Java,C++,Other" form="survey"].

You have ___@experience[number min=0 max=50 form="survey"] years of experience.

Your interests include ___@interests[checkbox options="Web,Mobile,AI,Gaming,DevOps" form="survey"].

## Additional Comments
___@comments[textarea rows=3 placeholder="Any additional thoughts?" form="survey"]

@submit_survey: [submit label="Submit Survey" form="survey"]
```

---

## 🔄 파싱 및 렌더링 과정

### 1. 파싱 단계
```
1. 문서 전체 스캔하여 @form 선언들 수집
2. Form ID 할당 (자동 또는 명시적)
3. @field 들 파싱하면서 form 속성 확인
   - form 속성 있음 → 해당 form ID 사용
   - form 속성 없음 → 가장 최근 @form ID 사용
   - @form 없음 → 기본 form 생성
4. 인라인 필드들도 동일한 규칙 적용
```

### 2. HTML 생성 단계
```
1. Hidden form 요소들 먼저 생성
2. 필드들을 form 속성과 함께 생성
3. CSS 클래스 및 추가 속성들 적용
4. 최종 HTML 출력
```

---

## ⚙️ 구현 세부사항

### 1. Form ID 생성 규칙
```typescript
// ID 자동 생성 로직
let formCounter = 1
let defaultFormCreated = false

function generateFormId(customId?: string): string {
  if (customId) return customId
  return `formdown-form-${formCounter++}`
}

function getDefaultFormId(): string {
  if (!defaultFormCreated) {
    defaultFormCreated = true
    return 'formdown-form-default'
  }
  return 'formdown-form-default'
}
```

### 2. 필드 연결 로직
```typescript
// 필드와 form 연결 로직
let currentFormId: string | null = null

function processField(field: Field): Field {
  if (field.attributes.form) {
    // 명시적 form 지정
    return field
  }
  
  if (currentFormId) {
    // 현재 활성 form에 연결
    field.attributes.form = currentFormId
  } else {
    // 기본 form 생성 및 연결
    field.attributes.form = getDefaultFormId()
  }
  
  return field
}

function processFormDeclaration(form: FormDeclaration): void {
  currentFormId = form.id || generateFormId()
}
```

---

## 🎯 설계 장점

### ✅ **실용성**
- HTML 표준 `form` 속성 완벽 활용
- 브라우저 네이티브 동작과 100% 일치
- 복잡한 form 구조도 명확하게 표현

### ✅ **유연성**
- 필드들이 문서 어디든 자유 배치
- 여러 form을 자연스럽게 혼합
- 조건부 필드 표시/숨김 용이
- 인라인 필드와 완벽 통합

### ✅ **성능**
- 블록 구조(`@form:` `@/form`) 불필요
- 파싱 복잡도 대폭 감소
- DOM 구조 최적화 (hidden form)

### ✅ **일관성**
- 기존 FormDown 문법과 완전 일치
- `@form[attributes]` 패턴 유지
- HTML 속성 문법 그대로 사용

### ✅ **확장성**
- 새로운 form 속성 자동 지원
- JavaScript 통합 용이
- CSS 프레임워크 친화적

---

## 🏁 결론

이 설계는 FormDown의 **"단순하고 명확한 마크다운 확장"** 철학을 완벽하게 구현하면서도, HTML의 강력한 `form` 속성을 최대한 활용하는 실용적인 솔루션입니다.

### 핵심 가치
- **HTML 표준 준수**: 웹 표준과 100% 일치
- **개발자 친화적**: 직관적이고 배우기 쉬움
- **실무 적합성**: 복잡한 실제 사용 사례 완벽 지원
- **미래 확장성**: 새로운 HTML 기능 자동 지원

이 설계로 FormDown은 단순함을 유지하면서도 엔터프라이즈급 form 요구사항을 모두 충족할 수 있습니다! 🎉
# FormDown Hidden Form Architecture 구현 태스크

> **목표**: HIDDEN_FORM_ARCHITECTURE.md 설계 명세를 완전히 준수하는 구현체 완성

## 📋 완료된 작업

### ✅ Phase 0: 분석 및 설계 검토
- [x] HIDDEN_FORM_ARCHITECTURE.md 문서 검토 완료
- [x] 현재 generator.ts 구현 분석 완료
- [x] 설계 대비 편차점 식별 완료
  - Form 래핑 문제 (`generateSingleFieldFormHTML` 사용)
  - Hidden form 기능 불완전 구현
  - Form 속성 연결 로직 누락
  - 레거시 방식과 새로운 방식 혼재

---

## 🚀 실행 계획

### 🔥 Phase 1: 핵심 아키텍처 수정 (HIGH PRIORITY)

#### Task 1.1: 레거시 메서드 Deprecated 처리
**우선순위**: `🔴 CRITICAL`
- [ ] `generateFormHTML()` 메서드에 deprecated 마킹
- [ ] `generateSingleFieldFormHTML()` 메서드 제거 준비
- [ ] 레거시 방식 사용처 식별 및 migration path 문서화

#### Task 1.2: Form 속성 자동 연결 시스템 구현
**우선순위**: `🔴 CRITICAL`
- [ ] `generateFieldHTML()`에 form 속성 자동 추가 로직 구현
  - Default form ID 할당 규칙 적용
  - 명시적 form 속성 우선 처리
  - Form ID 검증 및 fallback 로직
- [ ] Form ID 자동 생성 시스템 강화
  - `formdown-form-{counter}` 패턴 구현
  - `formdown-form-default` 기본 form 생성
- [ ] Submit/Reset 버튼에 form 속성 자동 연결

#### Task 1.3: Form Declaration 파싱 및 연결 강화
**우선순위**: `🔴 CRITICAL`
- [ ] Form 선언 파싱 로직 검증 및 보완
- [ ] 필드와 form 자동 연결 규칙 구현
  - 가장 최근 @form에 자동 연결
  - 명시적 form="form-id" 속성 우선 처리
  - 존재하지 않는 form ID 참조시 경고 및 fallback

#### Task 1.4: 기본 동작 방식 변경
**우선순위**: `🔴 CRITICAL`
- [ ] `processContentWithHiddenForms()`를 기본 동작으로 설정
- [ ] `generateHTML()` 메서드에서 Hidden Form 방식 우선 적용
- [ ] 레거시 방식 fallback 조건 정의

### ⚡ Phase 2: 구현 완성 및 검증 (MEDIUM PRIORITY)

#### Task 2.1: HTML 생성 로직 개선
**우선순위**: `🟡 MEDIUM`
- [ ] Hidden form HTML 생성 검증
- [ ] 필드 HTML에 올바른 form 속성 포함 확인
- [ ] CSS 클래스 및 접근성 속성 유지

#### Task 2.2: 에러 처리 및 검증 강화
**우선순위**: `🟡 MEDIUM`
- [ ] Form ID 중복 검사 로직
- [ ] 존재하지 않는 form 참조시 경고 로그
- [ ] Form 속성 검증 및 sanitization

#### Task 2.3: 테스트 케이스 작성
**우선순위**: `🟡 MEDIUM`
- [ ] Hidden Form Architecture 준수 테스트
  - 단일 form 시나리오 테스트
  - 다중 form 시나리오 테스트  
  - 인라인 필드 연결 테스트
  - 자동 ID 할당 테스트
- [ ] 기존 테스트 케이스 migration
- [ ] Edge case 테스트 (form 없이 필드만 있는 경우)

### 🔧 Phase 3: 정리 및 문서화 (LOW PRIORITY)

#### Task 3.1: 코드 정리
**우선순위**: `🟢 LOW`
- [ ] 사용되지 않는 레거시 메서드 제거
- [ ] 코드 구조 최적화 및 리팩토링
- [ ] TypeScript 타입 정의 보완

#### Task 3.2: 문서화 업데이트
**우선순위**: `🟢 LOW`
- [ ] API 문서 업데이트
- [ ] 사용 예제 수정
- [ ] Migration 가이드 작성

---

## 🎯 구현 우선순위 매트릭스

| Phase | Task | 우선순위 | 예상 시간 | 의존성 |
|-------|------|----------|-----------|--------|
| 1.2 | Form 속성 자동 연결 | 🔴 CRITICAL | 2-3h | - |
| 1.3 | Form Declaration 강화 | 🔴 CRITICAL | 2-3h | Task 1.2 |
| 1.4 | 기본 동작 방식 변경 | 🔴 CRITICAL | 1-2h | Task 1.2, 1.3 |
| 1.1 | 레거시 Deprecated | 🔴 CRITICAL | 1h | Task 1.4 |
| 2.1 | HTML 생성 개선 | 🟡 MEDIUM | 1-2h | Phase 1 완료 |
| 2.2 | 에러 처리 강화 | 🟡 MEDIUM | 1-2h | Phase 1 완료 |
| 2.3 | 테스트 케이스 | 🟡 MEDIUM | 3-4h | Phase 1, 2.1 완료 |
| 3.1 | 코드 정리 | 🟢 LOW | 1-2h | 모든 기능 완료 |
| 3.2 | 문서화 | 🟢 LOW | 2-3h | 구현 완료 |

## 🏁 성공 기준

### 필수 요구사항
- [x] ~~각 필드가 `<form>` 태그로 개별 래핑되지 않음~~
- [ ] Hidden form (`<form hidden>`) 요소가 올바르게 생성됨
- [ ] 모든 필드에 `form="form-id"` 속성이 자동 연결됨
- [ ] 설계 문서의 모든 시나리오가 올바르게 동작함

### 성능 기준
- [ ] 기존 기능의 breaking change 최소화
- [ ] HTML 생성 성능 유지 또는 개선
- [ ] 메모리 사용량 증가 없음

### 품질 기준
- [ ] 모든 기존 테스트 통과
- [ ] 새로운 Hidden Form 테스트 100% 통과
- [ ] TypeScript 타입 안정성 유지

---

## 🔄 다음 액션

**즉시 시작**: Task 1.2 (Form 속성 자동 연결 시스템 구현)
**준비 사항**: generator.ts 파일 백업 및 브랜치 생성 권장
**예상 완료**: Phase 1 - 이번 주 내, 전체 - 다음 주 내

# Weather App PRD

## 1. 개요

| 항목 | 내용 |
|------|------|
| 기술 스택 | HTML / CSS / JavaScript (Vanilla) |
| 외부 API | OpenWeatherMap Current Weather API |
| API Key | `14561fa881dd61c6fd1c19e6796f7fc6` |
| 파일 구조 | `index.html` / `style.css` / `app.js` |

---

## 2. 디자인 시스템

Pencli `weather.pen`의 **Weather App** 컴포넌트 디자인 그대로 구현한다.

### 컬러 토큰 (CSS 변수로 선언)

| 변수명 | 값 |
|--------|----|
| `--accent-primary` | `#4A9FD8` |
| `--accent-light` | `#E8F4FD` |
| `--surface-primary` | `#FFFFFF` |
| `--surface-secondary` | `#F7F8FA` |
| `--surface-inverse` | `#0A0A0A` |
| `--foreground-primary` | `#1A1A1A` |
| `--foreground-secondary` | `#666666` |
| `--foreground-muted` | `#888888` |
| `--foreground-inverse` | `#FFFFFF` |

### 폰트
- 헤딩/본문: **Inter**
- 수치 데이터: **Geist Mono**
- Google Fonts CDN으로 로드

---

## 3. 레이아웃

```
┌──────────────────────────────────┐
│  🌤 WeatherNow        날짜/시간   │  Header
├──────────────────────────────────┤
│    [ 도시 검색 입력창 ] [Search]   │  Search
├──────────────────────────────────┤
│  도시명, 국가                      │
│  [큰 온도]°C   최고/최저/체감      │  Hero (dark bg)
│  날씨 설명                        │
│  💧습도  💨풍속  🌅일출  🌇일몰   │
├──────────────────────────────────┤
│  WEATHER DETAIL                  │
│  습도 | 풍속 | 기압 | 가시거리     │  Detail Grid
│  체감온도 | UV | 운량 | 이슬점     │
└──────────────────────────────────┘
```

---

## 4. 기능 명세

### 검색
- 도시명 입력 후 Search 버튼 또는 Enter 키로 검색
- 초기 로드 시 `Seoul` 자동 검색

### API 호출

```
GET https://api.openweathermap.org/data/2.5/weather
  ?q={도시명}&appid={API_KEY}&units=metric&lang=kr
```

### 표시 데이터

| 영역 | 항목 |
|------|------|
| Hero | 도시명, 국가, 현재 온도, 날씨 설명, 최고/최저, 체감온도, 습도, 풍속, 일출, 일몰 |
| Detail Grid | 습도(%), 풍속(km/h), 기압(hPa), 가시거리(km), 체감온도(°C), UV지수, 운량(%), 이슬점(°C) |

### 데이터 변환
- 풍속: m/s → km/h (`× 3.6`)
- 일출/일몰: Unix timestamp → `HH:MM`

### 에러 처리
- 없는 도시: `"도시를 찾을 수 없습니다."` 표시
- 네트워크 오류: `"데이터를 불러오지 못했습니다."` 표시

---

## 5. 구현 조건

- 외부 라이브러리 사용 금지 (Vanilla JS only)
- API Key는 `app.js` 상단 상수로 선언
- 빌드 도구 없이 브라우저에서 직접 실행
- 반응형 지원: 모바일(480px 이하) / 태블릿(768px 이하) / 데스크톱
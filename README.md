# 🍔 TrackBite - 배달 주문 플랫폼

React, TypeScript, Express, MongoDB, Supabase를 활용하여 구현한 배달 주문 웹앱입니다.  
고객과 관리자 역할을 분리하고, 실사용에 가까운 데이터 구조 및 UI/UX를 구현하여  
실제 배달앱과 유사한 기능 흐름을 경험할 수 있도록 설계했습니다.
**단, 실제 주문은 불가한 비상업용 프로젝트입니다.**

- 배포 URL : https://track-bite-ve33.vercel.app/
- 관리자 페이지 URL : https://track-bite-ve33.vercel.app/admin/
- Test Customer ID : tester1234
- Test Customer PW : test1234
- Test Admin ID : testshop1234
- Test Admin PW : test1234
- 백엔드 리포지토리 : https://github.com/cbk96/track_bite_server
<br><br>

## 📌 프로젝트 개요

- **제작 기간**: 2025년 3월 ~ 6월 (3개월)  
- **제작 인원**: 1명 (개인 프로젝트)  
  

## 📌 프로젝트 주제 선정 이유

- React 개발 직군으로의 취업을 목표로 삼고, 이를 뒷받침할 수 있는 포트폴리오 프로젝트를 기획했습니다.  
- 다양한 상태 관리 로직과 CRUD 기능을 폭넓게 구현해보고자, 계층적인 데이터 구조와 상호작용이 많은 앱을 주제로 선정했습니다.  
- 특히, 이전 직장에서 여러 배달 플랫폼의 관리자 사이트를 실무적으로 다뤘던 경험이 있어, 그 과정에서 쌓인 기능적 이해도를 바탕으로 **배달 플랫폼**을 주제로 선택하게 되었습니다.
<br><br>

## ✅ 주요 기능

### 👤 고객 페이지
- 주소 정보 기반으로 가게 목록 조회 및 개별 가게 상세 진입
- 사용자의 주소 정보를 기반으로 배달 가능 여부를 판단
- 메뉴를 소속된 카테고리별로 구별하여 출력
- 장바구니 담기 및 주문 생성
- 쿠폰 발급 및 사용
- 마이페이지에서 주문 내역 확인
- 리뷰 작성 및 리뷰 점수 기반 가게 평점 산정
- 다수의 항목을 스크롤 기반으로 순차 출력 (가게 목록, 리뷰 목록등)

### 🛠 관리자 페이지
- 카테고리 기반으로 메뉴와 옵션을 계층적으로 등록
- 메뉴와 옵션 연결 관리
- 드래그 앤 드롭으로 메뉴, 옵션의 표시 순서 변경 (@hello-pangea/dnd)
- 주문 목록 조회 및 주문 상태 변경
- 쿠폰 등록 및 쿠폰 사용 가능 여부 변경
- 가게 기본 정보 수정 (배달비, 최소 주문 금액 등)

### 🔐 공통 기능
- JWT 기반 로그인 및 액세스 권한 토큰 발급
- Supabase Storage를 활용한 이미지 업로드
- 반응형 UI 구성 (Tailwind CSS)
<br><br>

## 🧩 구현 포인트

### ⚛️ React  
컴포넌트 기반 아키텍처를 통해 유지보수성과 재사용성을 강화했습니다.  
유저 배너, 상단 및 하단 배너 등 반복되는 UI 요소를 컴포넌트화해 효율적으로 관리했습니다.

### 🟦 TypeScript  
정적 타입 시스템을 도입해 코드 안정성과 가독성을 높였습니다.  
타입 추론과 인터페이스 정의를 활용해 개발 생산성을 향상시켰습니다.

### 🗄️ Redux  
전역 상태 관리를 위해 Redux를 사용했습니다.  
복잡한 상태 변화를 효율적으로 관리하고, 예측 가능한 상태 흐름을 구현했습니다.

### 🖱️ @hello-pangea/dnd  
직관적인 드래그 앤 드롭 인터페이스를 구현하여 메뉴와 옵션의 순서를 쉽게 변경할 수 있도록 했습니다.  
변경된 순서는 서버에 저장되어 사용자 환경을 일관되게 유지합니다.

### 🔐 JWT + Cookie  
JWT와 쿠키를 결합해 인증 및 로그인 상태를 관리합니다.  
토큰 만료 시 자동 갱신 기능을 구현해 원활한 사용자 경험을 제공합니다.

### 🍃 MongoDB (Mongoose)  
프로젝트 전반의 데이터를 MongoDB로 관리하며, 메뉴와 옵션은 물론 주문, 사용자, 쿠폰 등 다양한 정보를 유연하고 확장성 있게 처리했습니다.

### ☁️ Supabase Storage  
안정적인 클라우드 저장소인 Supabase Storage를 활용해 이미지 업로드와 관리를 담당했습니다.  
서버 부하를 줄이고 빠른 이미지 제공을 가능하게 했습니다.

### 🎨 Tailwind CSS  
유틸리티 클래스 기반의 Tailwind CSS를 사용해 반응형 UI를 구현했습니다.  
다양한 화면 크기에 대응하며 빠르고 효율적인 스타일링을 지원합니다.
<br><br>

## 🛠 사용 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React, TypeScript, Tailwind CSS, React Router |
| Backend | Express.js, MongoDB (Mongoose) |
| 인증 | JWT + Cookie |
| 이미지 저장소 | Supabase Storage |

<br><br>

## 🛠️ 주요 기능

| 기능 | 바로가기 |
|------|----------|
| 🏪 스토어 검색 | [스토어 검색](#스토어-검색) |
| 🛒 주문 흐름 | [주문](#주문) / [주문서작성](#주문서작성) |
| ✍ 리뷰 작성 | [리뷰작성](#리뷰작성) |
| 🍔 메뉴 관리 | [메뉴 등록](#메뉴-등록), [메뉴 순서 변경](#메뉴-순서-변경) |
| 🎟 쿠폰 기능 | [쿠폰발급](#쿠폰발급), [쿠폰 다운로드](#쿠폰-다운로드), [쿠폰사용](#쿠폰사용) |
| 🕒 영업시간 설정 | [영업시간 설정](#영업시간-설정) |

<br><br>

### [메인화면]

- 로그인이나 주소 기입을 통해 주소 정보가 저장되면 총 주문수를 기반으로 한 스토어 추천 목록이 표시됩니다.
  
  | 메인화면 | 메인화면 (로그인) |
  |:------:|:------:|
  |<img src="https://github.com/user-attachments/assets/f83bf11c-185b-44ba-a8ff-bcf0d5e6ca14" alt="메인화면" width="300">|<img src="https://github.com/user-attachments/assets/c68ad690-e1e6-40c0-a476-26552ee1bb20" alt="메인화면" width="300">

  <br><br>


### [스토어 검색]

- 스토어명과 스토어의 카테고리, 주소 정보를 조건으로 스토어 목록을 조회합니다.
- 스토어명은 검색폼에 입력한 문자열 값, 카테고리는 선택중인 카테고리 버튼, 주소는 회원 정보에 저장된 주소 혹은 임시로 저장된 주소 값을 조건으로 사용합니다.
- 주소를 기준으로 스토어 목록을 필터링할 때, 원래는 더 세분화된 행정구역 단위(예: 동 단위 등)로 조회하는 것이 정확하지만, 그렇게 할 경우 시연용 스토어 데이터를 과도하게 많이 등록해야 하므로, 이번 구현에서는 시/도 단위로 필터링하도록 했습니다.

   | 스토어 검색 (주소 기준) | 스토어 검색 (카테고리 기준) |
  |:------:|:------:|
  |<img src="https://github.com/user-attachments/assets/69c58723-725d-4459-a5b8-417292921dea" alt="스토어 검색" width="300">|<img src="https://github.com/user-attachments/assets/99ddb780-f88c-48b7-a97b-586a5c4672bc" alt="스토어 검색" width="300">|

<br><br>


### [주문]

- 매뉴와 메뉴에 연결된 옵션을 선택하여 장바구니에 담은 후 장바구니 모달에서 주문서 페이지로 이동합니다.
- 영업시간이 아니거나, 지정한 행정구역과 맞지 않는 조건에서는 주문이 불가능합니다.
  
 | 정상 주문 가능 상태 | 서비스 지역 외 주문 제한 | 영업시간 외 주문 제한 |
  |:------:|:------:|:------:|
  |<img src="https://github.com/user-attachments/assets/84baaf52-aba4-46d1-aa83-9f0e3db7110e" alt="주문 시도" width="300">|<img src="https://github.com/user-attachments/assets/1699ebc4-8d40-4917-82ce-8ce50ec229f9" alt="주문 시도" width="300">|<img src="https://github.com/user-attachments/assets/57d2f4c6-d203-4ad3-90a0-124974ee5c46" alt="주문 시도" width="300">|

<br><br>


### [주문서작성]  

- 주문을 위해 요구되는 모든 정보를 입력한 후, ‘주문하기’ 버튼을 눌러 주문 절차를 마무리합니다.
- 주문자명과 전화번호와 같은 민감한 정보는 무작위 데이터 자동으로 입력되며, 실제 개인정보가 수집되지 않도록 처리하였습니다.

| 주문서작성 |
  |:------:|
  |<img src="https://github.com/user-attachments/assets/5edfe7c5-5992-4c8f-be0d-5887874713ac" alt="주문서 작성" width="300">|
  
  <br><br>
  

### [리뷰작성]  

- 주문 진행 상태가 배달완료인 주문건에 대한 리뷰를 작성할 수 있습니다.
- 리뷰 내용과 0.5점 단위의 별점을 등록할 수 있으며, 등록된 별점은 가게의 전체 평점에 반영됩니다.

 | 리뷰작성 | 리뷰 별점 반영 전 평점 | 리뷰 별점이 반영된 평점 |
  |:------:|:------:|:------:|
  |<img src="https://github.com/user-attachments/assets/de264c32-81ba-43c2-832d-9dc457316a94" alt="리뷰작성" width="300">|<img src="https://github.com/user-attachments/assets/587e8c99-66f3-455b-8721-1e6276aad88d" alt="평점" width="300">|<img src="https://github.com/user-attachments/assets/7360aaa9-025f-4025-b03e-1ab8b0477aa7" alt="평점" width="300">|

<br><br>

### [메뉴그룹 등록]  

- 메뉴는 반드시 하나의 메뉴 그룹(예: 메인, 사이드)에 속해야 하므로, 먼저 그룹을 등록한 후 메뉴를 추가해야 합니다.
- 사용자는 스토어 화면에서 메뉴 그룹별로 메뉴를 구분해 볼 수 있습니다.

| 메뉴그룹 등록 |
  |:------:|
  |<img src="https://github.com/user-attachments/assets/cafec661-3178-4b70-9bdc-7beac98cc1e4" alt="메뉴그룹 등록" width="300">|
 
 <br><br>

 ### [메뉴 등록]  
 
 - 스토어 페이지에 표시될 메뉴의 이미지, 메뉴명, 가격, 설명을 등록합니다.
 - 메뉴 이미지의 경우 업로드 된 이미지가 없으면 기본 이미지가 표시됩니다.
 - 판매 상태를 ‘품절’로 설정하면 해당 메뉴에 대한 고객의 주문을 제한할 수 있습니다.
 - 메뉴에 표시할 옵션은 사전에 등록한 후, 각 메뉴에 연결하는 방식으로 구성되어 있습니다.

 | 메뉴 등록 | 품절 메뉴 |
  |:------:|:------:|
  |<img src="https://github.com/user-attachments/assets/cb6ba6c6-36de-438b-bb42-2835480f1fd7" alt="메뉴 등록" width="300">|<img src="https://github.com/user-attachments/assets/4c154f91-3452-46ab-b272-c50e98766c1a" alt="품절 메뉴" width="300">|
 
 <br><br>

 
### [메뉴 순서 변경]

- 드래그 앤 드롭으로 메뉴의 표시 순서를 변경할 수 있습니다.
- 변경된 순서는 메뉴 수정 페이지를 벗어날 때 자동으로 서버에 저장됩니다.

  | 드래그 앤 드롭으로 순서 수정 | 변경 전 순서 | 변경 후 순서 |
  |:------:|:------:|:------:|
  |<img src="https://github.com/user-attachments/assets/512f8cee-c9a3-423e-a326-96a5ac389dce" alt="메뉴 순서 수정" width="300">|<img src="https://github.com/user-attachments/assets/c2f395bd-1362-44c9-b30b-ebf8f785d23d" alt="메뉴 순서 수정" width="300">|<img src="https://github.com/user-attachments/assets/2f16fead-50f7-4a84-8a46-a14e27424630" alt="메뉴 순서 수정" width="300">|

  <br><br>


### [쿠폰발급]  

- 쿠폰 이름, 사용 조건 금액, 사용 가능 여부 및 사용 기간을 입력하여 쿠폰을 등록합니다.
- 노출 여부를 ‘숨김’으로 설정하면 해당 쿠폰은 스토어에 표시되지 않습니다.

| 쿠폰 정보 입력 |
  |:------:|
  |<img src="https://github.com/user-attachments/assets/5981f09b-eb95-4f50-b829-470e0f27e211" alt="쿠폰 정보 입력" width="300">|
 
 <br><br>

### [쿠폰 다운로드]  

- 로그인한 고객은 스토어에서 노출 중인 쿠폰을 다운로드할 수 있습니다.
- 고객이 보유한 쿠폰은 ‘사용 가능’과 ‘사용 완료’ 상태로 구분되어 쿠폰 페이지에 표시됩니다. 

| 쿠폰 다운로드 | 쿠폰 목록 |
  |:------:|:------:|
  |<img src="https://github.com/user-attachments/assets/b1ce268a-5a20-4699-bd36-4a6f46c18d12" alt="쿠폰 다운로드" width="300">|<img src="https://github.com/user-attachments/assets/65e9af2d-dde7-4682-97ac-2a5306ff5145" alt="쿠폰목록" width="300">|

<br><br>


### [쿠폰 사용]  

- 쿠폰은 사용 조건 금액 이상으로 주문할 경우에만 적용할 수 있으며,
스토어 관리자가 해당 쿠폰을 ‘사용 가능’ 상태로 설정해둔 경우에 한해 사용 가능합니다.

| 사용 조건 금액을 충족한 주문 | 사용 조건 금액을 충족하지 못한 주문 |
  |:------:|:------:|
  |<img src="https://github.com/user-attachments/assets/56b40b21-e31a-4256-8349-e01f88a6a04a" alt="쿠폰 사용 가능" width="300">|<img src="https://github.com/user-attachments/assets/6ed30559-fef5-471c-a4fc-a9380f27a737" alt="쿠폰 사용 불가" width="300">|

<br><br>


### [영업시간 설정]

- 요일별로 영업시간을 설정할 수 있습니다.
- 영업시간이 설정되지 않은 요일은 자동으로 휴일로 간주되며,
- 영업시간 외에는 고객의 주문이 제한됩니다.

  | 영업시간 수정 | 타이틀 |
  |:------:|:------:|
  |<img src="https://github.com/user-attachments/assets/373e0e76-0aa2-44a8-b190-e7638459a614" alt="영업시간 수정" width="300">|<img src="https://github.com/user-attachments/assets/57d2f4c6-d203-4ad3-90a0-124974ee5c46" alt="영업시간 외" width="300">|

<br><br>

<br><br>

## 📂 프로젝트 구조

```bash
📦 track_bite
┣ src
┃ ┣ 📂components      # 공통 컴포넌트
┃ ┣ 📂constants       # 앱 전역에서 사용하는 상수 값 정의
┃ ┣ 📂context         # 전역 상태 관리용 React 컨텍스트
┃ ┣ 📂pages           # 고객/관리자 페이지 단위 구성
┃ ┣ 📂hook            # 커스텀 훅
┃ ┣ 📂server          # 서버 API 요청 관련 공통 함수 모음
┃ ┣ 📂service         # 페이지/기능별 서버 API 요청 함수
┃ ┣ 📂store           # Redux 기반 상태 관리
┃ ┣ 📂svg             # SVG 리소스 모음
┃ ┣ 📂type            # 프로젝트 전역에서 사용하는 TypeScript 타입 정의
┃ ┣ 📂utils           # 공통 유틸 함수 모음
┃ ┗ 📜 App.tsx 

🗄️track_bite_server(백엔드 리포지토리 : https://github.com/cbk96/track_bite_server)
┣ src
┃ ┣ 📂express          # 라우터들을 경로별로 앱에 연결
┃ ┣ 📂mongodb          # Mongodb 연결
┃ ┣ 📂middlewares      # 요청/응답 사이 처리용 미들웨어 함수들
┃ ┣ 📂routes           # Express API 라우터
┃ ┣ 📂utils            # 공통 유틸 함수 모음
┃ ┗ 📜index.ts

---


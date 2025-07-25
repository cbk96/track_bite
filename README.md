# 🍔 TrackBite - 배달 주문 플랫폼

React, TypeScript, Express, MongoDB, Supabase를 활용하여 구현한 배달 주문 웹앱입니다.  
고객과 관리자 역할을 분리하고, 실사용에 가까운 데이터 구조 및 UI/UX를 구현하여  
실제 배달앱과 유사한 기능 흐름을 경험할 수 있도록 설계했습니다.
**실제 주문은 불가한 비상업용 프로젝트입니다.**

- 배포 URL : https://track-bite-ve33.vercel.app/
- 관리자 페이지 URL : https://track-bite-ve33.vercel.app/admin/
- Test Customer ID : tester1234
- Test Customer PW : test1234
- Test Admin ID : testshop1234
- Test Admin PW : test1234
- 백엔드 리포지토리 : https://github.com/cbk96/track_bite_server
  <br><br>

## 목차
- [프로젝트 개요](#-프로젝트-개요)
- [주제 선정 이유](#-주제-선정-이유)
- [사용 기술 스택](#-사용-기술-스택)
- [주요 기능](#-주요-기능)
- [구현 포인트](#-구현-포인트)
- [일부 기능 미리보기](#일부-기능-미리보기)
- [주요 기능의 동작 방식](#주요-기능의-동작-방식)
  - [메뉴 정렬은 이렇게 처리됩니다](#-메뉴-정렬은-이렇게-처리됩니다)
  - [주문서 작성 시 쿠폰은 이렇게 사용됩니다](#️-주문서-작성-시-쿠폰은-이렇게-사용됩니다)
  - [클라이언트와 서버 통신 시 고려한 사항](#-클라이언트와-서버-통신-시-고려한-사항)
- [프로젝트 구조](#-프로젝트-구조)

  <br><br>

## 📌 프로젝트 개요

- **제작 기간**: 2025년 3월 ~ 7월 (4개월)
- **제작 인원**: 1명 (개인 프로젝트)

<br><br>

## 📌 프로젝트 주제 선정 이유

- React 개발 직군으로의 취업을 목표로 삼고, 이를 뒷받침할 수 있는 포트폴리오 프로젝트를 기획했습니다.
- 다양한 상태 관리 로직과 CRUD 기능을 폭넓게 구현해보고자, 계층적인 데이터 구조와 상호작용이 많은 앱을 주제로 선정했습니다.
- 특히, 이전 직장에서 여러 배달 플랫폼의 관리자 사이트를 실무적으로 다뤘던 경험이 있어, 그 과정에서 쌓인 기능적 이해도를 바탕으로 **배달 플랫폼**을 주제로 선택하게 되었습니다.
  
  <br><br>

## 🛠 사용 기술 스택

| 구분 | 기술 |
| ----- | ----- |
| Frontend | React, Tanstack Query, TypeScript, Tailwind CSS, React Router |
| Backend | Express.js, MongoDB |
| 인증 | JWT + Cookie |
| 배포 | Vercel(Frontend), Render(Backend), MongoDB Atlas
| 이미지 저장소 | Supabase Storage |

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

### 🍃 MongoDB

프로젝트 전반의 데이터를 MongoDB로 관리하며, 메뉴와 옵션은 물론 주문, 사용자, 쿠폰 등 다양한 정보를 유연하고 확장성 있게 처리했습니다.

### 🎨 Tailwind CSS

유틸리티 클래스 기반의 Tailwind CSS를 사용해 반응형 UI를 구현했습니다.  
다양한 화면 크기에 대응하며 빠르고 효율적인 스타일링을 지원합니다.
<br><br>

## 🛠️ 일부 기능 미리보기

| 기능 | 바로가기 |
| ----- | ----- |
| 🏪 스토어 검색   | [스토어 검색](#스토어-검색) |
| 🛒 주문 흐름 | [주문](#주문) / [주문서작성](#주문서작성) |
| ✍ 리뷰 작성 | [리뷰작성](#리뷰작성) |
| 🍔 메뉴 관리 | [메뉴 등록](#메뉴-등록), [메뉴 순서 변경](#메뉴-순서-변경) |
| 🎟 쿠폰 기능 | [쿠폰발급](#쿠폰발급), [쿠폰 다운로드](#쿠폰-다운로드), [쿠폰사용](#쿠폰사용) |
| 🕒 영업시간 설정 | [영업시간 설정](#영업시간-설정) |

<br><br>

### [메인화면]

- 로그인이나 주소 기입을 통해 주소 정보가 저장되면 총 주문수를 기반으로 한 스토어 추천 목록이 표시됩니다.

  | 메인화면 | 메인화면 (로그인) |
  | :-----: | :-----: |
  | <img src="https://github.com/user-attachments/assets/f83bf11c-185b-44ba-a8ff-bcf0d5e6ca14" alt="메인화면" width="300"> | <img src="https://github.com/user-attachments/assets/c68ad690-e1e6-40c0-a476-26552ee1bb20" alt="메인화면" width="300"> |

  <br><br>

### [스토어 검색]

- 스토어명과 스토어의 카테고리, 주소 정보를 조건으로 스토어 목록을 조회합니다.
- 스토어명은 검색폼에 입력한 문자열 값, 카테고리는 선택중인 카테고리 버튼, 주소는 회원 정보에 저장된 주소 혹은 임시로 저장된 주소 값을 조건으로 사용합니다.
- 주소를 기준으로 스토어 목록을 필터링할 때, 원래는 더 세분화된 행정구역 단위(예: 동 단위 등)로 조회하는 것이 정확하지만, 그렇게 할 경우 시연용 스토어 데이터를 과도하게 많이 등록해야 하므로, 이번 구현에서는 시/도 단위로 필터링하도록 했습니다.

  | 스토어 검색 (주소 기준) | 스토어 검색 (카테고리 기준) |
  | :-----: | :-----: |
  | <img src="https://github.com/user-attachments/assets/69c58723-725d-4459-a5b8-417292921dea" alt="스토어 검색"> | <img src="https://github.com/user-attachments/assets/99ddb780-f88c-48b7-a97b-586a5c4672bc" alt="스토어 검색" > |

<br><br>

### [주문]

- 매뉴와 메뉴에 연결된 옵션을 선택하여 장바구니에 담은 후 장바구니 모달에서 주문서 페이지로 이동합니다.
- 영업시간이 아니거나, 지정한 행정구역과 맞지 않는 조건에서는 주문이 불가능합니다.

| 정상 주문 가능 상태 | 서비스 지역 외 주문 제한 |
| :------: | :-----: |
| <img src="https://github.com/user-attachments/assets/84baaf52-aba4-46d1-aa83-9f0e3db7110e" alt="주문 시도" > | <img src="https://github.com/user-attachments/assets/1699ebc4-8d40-4917-82ce-8ce50ec229f9" alt="주문 시도" > |

<br>

| 영업시간 외 주문 제한 |
| :-----: |
| <img src="https://github.com/user-attachments/assets/57d2f4c6-d203-4ad3-90a0-124974ee5c46" alt="주문 시도" width="300"> |

<br><br>

### [주문서작성]

- 주문을 위해 요구되는 모든 정보를 입력한 후, ‘주문하기’ 버튼을 눌러 주문 절차를 마무리합니다.
- 주문자명과 전화번호와 같은 민감한 정보는 무작위 데이터 자동으로 입력되며, 실제 개인정보가 수집되지 않도록 처리하였습니다.

| 주문서 작성 |
| :-----: |
| <img src="https://github.com/user-attachments/assets/5edfe7c5-5992-4c8f-be0d-5887874713ac" alt="주문서 작성" width="300"> |

<br><br>

### [리뷰작성]

- 주문 진행 상태가 배달완료인 주문건에 대한 리뷰를 작성할 수 있습니다.
- 리뷰 내용과 0.5점 단위의 별점을 등록할 수 있으며, 등록된 별점은 가게의 전체 평점에 반영됩니다.

| 리뷰작성 |
| :-----: |
| <img src="https://github.com/user-attachments/assets/de264c32-81ba-43c2-832d-9dc457316a94" alt="리뷰작성" > |

<br>

| 리뷰 별점 반영 전 평점 | 리뷰 별점이 반영된 평점 |
| :-----: | :-----: |
| <img src="https://github.com/user-attachments/assets/7360aaa9-025f-4025-b03e-1ab8b0477aa7" alt="평점" width="300"> | <img src="https://github.com/user-attachments/assets/587e8c99-66f3-455b-8721-1e6276aad88d" alt="평점" width="300"> |

<br><br>

### [메뉴그룹 등록]

- 메뉴는 반드시 하나의 메뉴 그룹(예: 메인, 사이드)에 속해야 하므로, 먼저 그룹을 등록한 후 메뉴를 추가해야 합니다.
- 사용자는 스토어 화면에서 메뉴 그룹별로 메뉴를 구분해 볼 수 있습니다.

| 메뉴그룹 등록 |
| :------: |
| <img src="https://github.com/user-attachments/assets/cafec661-3178-4b70-9bdc-7beac98cc1e4" alt="메뉴그룹 등록" width="300"> |

<br><br>

### [메뉴 등록]

- 스토어 페이지에 표시될 메뉴의 이미지, 메뉴명, 가격, 설명을 등록합니다.
- 메뉴 이미지의 경우 업로드 된 이미지가 없으면 기본 이미지가 표시됩니다.
- 판매 상태를 ‘품절’로 설정하면 해당 메뉴에 대한 고객의 주문을 제한할 수 있습니다.
- 메뉴에 표시할 옵션은 사전에 등록한 후, 각 메뉴에 연결하는 방식으로 구성되어 있습니다.

| 메뉴 등록 | 품절 메뉴 |
| :-----: | :-----: |
| <img src="https://github.com/user-attachments/assets/cb6ba6c6-36de-438b-bb42-2835480f1fd7" alt="메뉴 등록"> | <img src="https://github.com/user-attachments/assets/4c154f91-3452-46ab-b272-c50e98766c1a" alt="품절 메뉴" width="300"> |

<br><br>

### [메뉴 순서 변경]

- 드래그 앤 드롭으로 메뉴의 표시 순서를 변경할 수 있습니다.
- 변경된 순서는 메뉴 수정 페이지를 벗어날 때 자동으로 서버에 저장됩니다.

  | 드래그 앤 드롭으로 순서 수정 |
  | :-----: |
  | <img src="https://github.com/user-attachments/assets/512f8cee-c9a3-423e-a326-96a5ac389dce" alt="메뉴 순서 수정"> |

<br>

| 변경 전 순서 | 변경 후 순서 |
| :-----: | :-----: |
| <img src="https://github.com/user-attachments/assets/c2f395bd-1362-44c9-b30b-ebf8f785d23d" alt="메뉴 순서 수정" width="300"> | <img src="https://github.com/user-attachments/assets/2f16fead-50f7-4a84-8a46-a14e27424630" alt="메뉴 순서 수정" width="300"> |

<br><br>

### [쿠폰발급]

- 쿠폰 이름, 사용 조건 금액, 사용 가능 여부 및 사용 기간을 입력하여 쿠폰을 등록합니다.
- 노출 여부를 ‘숨김’으로 설정하면 해당 쿠폰은 스토어에 표시되지 않습니다.

| 쿠폰 정보 입력 |
| :-----: |
| <img src="https://github.com/user-attachments/assets/5981f09b-eb95-4f50-b829-470e0f27e211" alt="쿠폰 정보 입력" width="300"> |

<br><br>

### [쿠폰 다운로드]

- 로그인한 고객은 스토어에서 노출 중인 쿠폰을 다운로드할 수 있습니다.
- 고객이 보유한 쿠폰은 ‘사용 가능’과 ‘사용 완료’ 상태로 구분되어 쿠폰 페이지에 표시됩니다.

| 쿠폰 다운로드 | 쿠폰 목록  |
| :-------: | :-------: |
| <img src="https://github.com/user-attachments/assets/b1ce268a-5a20-4699-bd36-4a6f46c18d12" alt="쿠폰 다운로드" > | <img src="https://github.com/user-attachments/assets/65e9af2d-dde7-4682-97ac-2a5306ff5145" alt="쿠폰목록" width="300"> |

<br><br>

### [쿠폰 사용]

- 쿠폰은 사용 조건 금액 이상으로 주문할 경우에만 적용할 수 있으며,
  스토어 관리자가 해당 쿠폰을 ‘사용 가능’ 상태로 설정해둔 경우에 한해 사용 가능합니다.

| 사용 조건 금액을 충족한 주문 | 사용 조건 금액을 충족하지 못한 주문 |
| :-----: | :-----: |
| <img src="https://github.com/user-attachments/assets/56b40b21-e31a-4256-8349-e01f88a6a04a" alt="쿠폰 사용 가능" > | <img src="https://github.com/user-attachments/assets/6ed30559-fef5-471c-a4fc-a9380f27a737" alt="쿠폰 사용 불가"> |

<br><br>

### [영업시간 설정]

- 요일별로 영업시간을 설정할 수 있습니다.
- 영업시간이 설정되지 않은 요일은 자동으로 휴일로 간주되며,
- 영업시간 외에는 고객의 주문이 제한됩니다.

  | 영업시간 수정 |  영업시간 외 주문 제한 |
  | :-----: | :-----: |
  | <img src="https://github.com/user-attachments/assets/373e0e76-0aa2-44a8-b190-e7638459a614" alt="영업시간 수정" > | <img src="https://github.com/user-attachments/assets/57d2f4c6-d203-4ad3-90a0-124974ee5c46" alt="영업시간 외" width="300"> |

<br><br>

## 주요 기능의 동작 방식

| 기능 | 바로가기 |
| --- | --- |
| 📋 메뉴 정렬 | [메뉴 정렬](#-메뉴-정렬은-이렇게-처리됩니다) |
| 🏷️ 쿠폰 사용 | [쿠폰 사용](#-주문서-작성시-쿠폰은-이렇게-사용됩니다) |
| 🔐 JWT를 이용한 권한 인증| [권한 인증](#-클라이언트와-서버-통신-시-고려한-사항) |

<br>

### 📋 메뉴 정렬은 이렇게 처리됩니다

- 판매 중인 메뉴는 메뉴 관리자 페이지에서 @hello-pangea/dnd 패키지를 활용한 드래그 앤 드롭 방식으로 순서를 조정할 수 있습니다.
- 변경된 순서는 UI에 즉시 반영되도록 Redux에 임시 저장되며, 사용자가 페이지를 이탈하려 할 때 useBlocker를 통해 이를 감지하여 서버로 최종 순서를 전송하고 영구 저장합니다.


#### 1. 드래그로 변경된 순서를 Redux로 임시 저장

- 드래그로 이동한 요소의 **원래 위치(index)**와 **드롭된 위치(index)**를 비교하여,
스와핑 함수를 통해 두 요소의 순서를 교환한 뒤 Redux 상태로 저장합니다.
- 이후, 변경된 순서 상태를 감지하여 UI에 즉시 반영합니다.

[메뉴 관리 페이지 컴포넌트](src/pages/MenuManage.tsx)

``` tsx

// 메뉴 드래그 종료 시 순서 변경 결과를 반영하는 온드래그엔드 함수
const { onDragEndMenu } = useMenuList();

(중략)

// 메뉴 드래그 영역
<DragDropContext onDragEnd={onDragEndMenu}>
  <CardDroppable 
    droppableId="menuDropZone"
    direction="vertical"
    className="max-w-[820px]"
  >
    {/* 메뉴 리스트 (드래그어블 요소) */}
    {menusContainer}
  </CardDroppable>
</DragDropContext>

```

<br>

[온드래그엔드 함수 (onDragEndMenu)](src/store/useMenuList.ts#L22)

  ``` ts

// 현재 Redux에 저장된 메뉴 목록 상태를 호출
const menuState = useSelector<AdminState, Menu[]>(({ menu }) => menu);

//메뉴 순서를 업데이트하기 위한 onDragEnd 핸들러 함수
// M.setMenu는 Redux 상태를 변경하기 위한 액션 생성자
  const onDragEndMenu = useSortableList(menuState, M.setMenu);

```

<br>

[순서 변경 처리 훅](src/hook/sortableList.ts)

``` ts
export const useSortableList = <T extends ItemWithOrder>(
  list: T[],
  setListAction: (updateList: T[]) => any
) => {
  const dispatch = useDispatch();

  const onDragEndGroup = useCallback(
    (result: BeautifulResult) => {
      const destinationCardId = result.destination?.droppableId; //드래그 종료 지점의 droppableId ("mainDropZone")
      const destinationCardIndex = result.destination?.index; //드래그 종료 지점의 순번

      if (
        destinationCardId === undefined ||
        destinationCardIndex === undefined
      ) {
        return;
      }

      const sourceCardId = result.source.droppableId; //드래그 시작 지점의 droppableId ("mainDropZone")
      const sourceCardIndex = result.source.index;
      let dragIndex = list.findIndex((item) => item.order === sourceCardIndex);
      let dropIndex = list.findIndex(
        (item) => item.order === destinationCardIndex
      );

//드래그한 위치와 드롭한 위치를 교환한 메뉴 배열 생성
      const swapList = U.swapItemsInArray(list, dragIndex, dropIndex);

      const resultList = swapList.map((item, index) => {
        return { ...item, order: index };
      });

//변경된 순서를 Redux 상태에 반영
dispatch(setListAction(resultList));
    },
    [list, dispatch]
  );
  return onDragEndGroup;
};

```

<br>

[스와이핑 함수 (swapItemsInArray)](src/utils/arrayUtil.ts)

``` ts
//주어진 두 index의 항목을 맞바꾼 새 배열을 반환
export const swapItemsInArray = <T>(
  array: T[],
  index1: number,
  index2: number
) => {
  if (index1 > index2) {
    //뒤에서 앞으로 가져오는 경우
    const swapArray = array.map((item, index) =>
      index < index1 && index > index2
        ? array[index - 1]
        : index === index2
        ? array[index1]
        : index === index1
        ? array[index - 1]
        : array[index]
    );
    return swapArray;
  } else if (index1 < index2) {
    //앞에서 뒤로 가져오는 경우
    const swapArray = array.map((item, index) =>
      index < index2 && index > index1
        ? array[index + 1]
        : index === index2
        ? array[index1]
        : index === index1
        ? array[index + 1]
        : array[index]
    );
    return swapArray;
  } else {
    return array;
  }
};

```

<br>

#### 2. 페이지 이탈 시 서버에 변경된 메뉴 순서 전송

- 페이지 이탈 시 useBlocker를 활용해 이탈 여부를 감지하고, 변경된 메뉴 순서를 서버에 전송하여 영구적으로 저장합니다.
- 이를 통해 드래그 앤 드롭 기반 순서 변경 중 불필요한 서버 호출을 방지하고, 최종 변경 시점에만 서버와 통신하도록 최적화하였습니다.

[메뉴 관리 페이지](src/pages/Admin/MenuManage.tsx#L64)

``` ts
useBlocker(({ currentLocation, nextLocation }) => {
    if (currentLocation.pathname !== nextLocation.pathname) {
      menuGroupsState.length > 0 && updateMenuGroupMutate(menuGroupsState);
      menuState.length > 0 && updateMenuMutate(menuState);
    }
    return false;
  });
```

<br><br>

### 🏷️ 주문서 작성 시 쿠폰은 이렇게 사용됩니다

- 스토어 관리자가 업로드한 쿠폰은 고객이 다운로드한 이후에도 사용 가능 여부를 수정할 수 있어야 한다고 판단했습니다.
- 이에 따라 MongoDB에서는 쿠폰 정보를 Coupons 컬렉션(스토어 관리자 전용)과 CouponIssues 컬렉션(고객이 보유한 쿠폰)으로 분리하여 저장하도록 설계했습니다.

<br>

#### 1. 주문서에서 사용할 쿠폰 상태 및 API 초기화

[src/pages/PurchaseSheet.tsx](src/pages/PurchaseSheet.tsx)

``` ts

import {CouponApi} from "../service";

//주문시 고객이 사용하고자 선택한 쿠폰의 아이디 목록
const [selectCoupon, setSelectCoupon] = useState<string[]>([]);

//고객이 보유중인 쿠폰중 주문에서 사용 가능한 쿠폰 목록
const [canUseCoupon, setCanUseCoupon] = useState<CouponIssue[]>([]);

//스토어 관리자가 사용 가능 상태로 설정한 쿠폰의 아이디 목록
  const [canUseCouponIds, setCanUseCouponIds] = useState<string[]>([]);

//쿠폰으로 할인되는 할인액의 총합
  const [totalCouponDiscountPrice, setTotalCouponDiscountPrice] =
    useState<number>(0);

//DB에 저장된 쿠폰 정보 호출 API
const { useGetCouponIssues, useUpdateCouponIssues, useGetCouponsPublic } =
    CouponApi();

//고객이 보유중인 쿠폰 호출 (type : Coupon)
 const CouponIssueData = useGetCouponIssues(
    storePublicId ? storePublicId : "",
    loginStatus.customerId,
    loginStatus.logined === "login"
  ).couponIssueGetData;

//스토어 관리자가 설정중인 쿠폰 사용 가능 여부를 확인하기 위해 가게의 쿠폰 데이터 조회 (type : Coupon)
  const { getSearchingCouponPBData } = useGetCouponsPublic({
    isUsable: true, //사용 가능한 쿠폰만
    isVisible: true, //스토어 페이지에서 노출중인 쿠폰만
    storePublicId: storePublicId ?? "",
    today: new Date(), //주문 당시 일자 기준 사용 가능한 쿠폰만
  });

```

<br>

#### 2. 고객이 보유한 쿠폰 중 사용하지 않은 쿠폰만 필터링하기

- 서버에서 받은 고객 보유 쿠폰 데이터(CouponIssueData) 중, 사용 이력이 있는 쿠폰(CouponIssue.coupon.used === true)을 제외하고 사용 가능한 쿠폰만 canUseCoupon 상태에 저장합니다.
- canUseCoupon 상태는 UI에서 쿠폰을 나열할 때 사용됩니다.


[src/pages/PurchaseSheet.tsx](src/pages/PurchaseSheet.tsx)

``` ts

useEffect(() => {
    if (
      CouponIssueData &&
      Array.isArray(CouponIssueData) &&
      CouponIssueData.length > 0
    ) {
      const usingCoupon = CouponIssueData.filter((coupon: CouponIssue) => {
        return !coupon.used;
      }).map((coupon: CouponIssue) => ({
        ...coupon,
        purchasePackageId: createPurchasePackId,
      }));

      setCanUseCoupon(usingCoupon);
    }
  }, [CouponIssueData, createPurchasePackId]);

```

<br>

#### 2. 스토어 관리자가 사용 가능한 상태로으로 설정한 쿠폰들의 ID 목록 저장

- 서버에서 받은 스토어 관리자의 쿠폰 관리 데이터(getSearchingCouponPBData)에서 쿠폰 아이디만 추출하여 canUseCouponIds 상태에 저장합니다.
- canUseCouponIds 상태는 UI에서 canUseCoupon 상태의 쿠폰 아이디와 비교하여, 사용 불가능한 쿠폰의 선택을 비활성화하는 데 활용됩니다.

[src/pages/PurchaseSheet.tsx](src/pages/PurchaseSheet.tsx)

``` ts

  useEffect(() => {
    if (
      getSearchingCouponPBData &&
Array.isArray(getSearchingCouponPBData) &&
      getSearchingCouponPBData.length > 0
    ) {
      const canUseCouponIdArr = getSearchingCouponPBData.map((coupon) => {
        return coupon.couponId;
      });
      setCanUseCouponIds(canUseCouponIdArr);
    }
  }, [getSearchingCouponPBData]);

```

<br>

#### 3. 쿠폰 선택 및 선택된 쿠폰 할인 금액 합산 처리

- 사용할 쿠폰은 checkbox 타입의 input 요소로 선택되며, ChangeEvent 핸들러인 selectCouponId를 통해 선택 여부를 처리합니다.
- 쿠폰이 선택되거나 해제될 때, 해당 쿠폰의 할인액을 총 할인 금액에 반영하고, 선택 중인 쿠폰 목록 상태를 업데이트합니다.
- totalCouponDiscountPrice 상태는 UI에서 총 쿠폰 할인액을 표시할 때 사용됩니다.

[src/pages/PurchaseSheet.tsx](src/pages/PurchaseSheet.tsx)

``` ts

//쿠폰 선택
  const selectCouponId = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const exisCoupon = [...selectCoupon];
      let creaseDiscountPrice = totalCouponDiscountPrice;
      const selectNowCoupon = canUseCoupon.find(
        (coupon) => coupon.couponId === e.target.value
      );
      if (e.target.checked) {
        const addCoupon = [...exisCoupon, e.target.value];
        creaseDiscountPrice += Number(selectNowCoupon?.discountPrice);

        setSelectCoupon(addCoupon);
      } else {
        const removeCoupon = exisCoupon.filter(
          (coupon) => coupon !== e.target.value
        );
        creaseDiscountPrice -= Number(selectNowCoupon?.discountPrice);

        setSelectCoupon(removeCoupon);
      }
      setTotalCouponDiscountPrice(creaseDiscountPrice);
    },
    [selectCoupon, canUseCoupon, totalCouponDiscountPrice]
  );

(중략)

<p className="pt-2 text-right lg:pt-5 ">
              <span className="mr-5 text-[12px] lg:text-[16px] font-bold">
                쿠폰 할인액
              </span>
              <span className="inline-block min-w-[100px] lg:min-w-[150px] text-[14px] lg:text-[20px] font-bold">
                {U.accounting(totalCouponDiscountPrice)}원
              </span>
            </p>

(중략)

 <input
                          type="checkbox"
                          id={coupon.couponId}
                          value={coupon.couponId}
                          checked={selectCoupon.includes(coupon.couponId)}
                          onChange={selectCouponId}
                          className="hidden peer"
                          disabled={
                            !canUseCouponIds.includes(coupon.couponId) ||
                            coupon.used ||
                            coupon.minOrderAmount > totalPrice
                          }
                        />

```

<br>

#### 4. 주문서 데이터에 선택한 쿠폰 반영

- 주문 정보를 입력값과 함께 정리한 뒤, 선택한 쿠폰 정보를 반영하여 서버로 전송하고, 장바구니 및 쿠폰 사용 상태를 업데이트합니다.

[src/pages/PurchaseSheet.tsx](src/pages/PurchaseSheet.tsx)

``` ts
//주문 처리
  const purchaseConfirm = useCallback(
    (data: PurchaseInput) => {

(중략)

      //선택된 쿠폰 ID를 기준으로 실제 쿠폰 객체 목록 추출
      const selectedCoupon: CouponIssue[] = canUseCoupon
        .filter((coupon) => {
          return selectCoupon.includes(coupon.couponId);
        })
        .map((coupon) => ({ ...coupon, used: true }));

      //입력 정보 정리후 서버 전송
      if (
        data !== undefined &&
        data.tel !== "" &&
        (storeInfo.paymentMethod[selectTabNum] !== "Credit_card" ||
          (storeInfo.paymentMethod[selectTabNum] === "Credit_card" &&
            data.cardNumber))
      ) {
        const cofirmPurchase: Purchase[] = pendingPurchase.map((purch) => ({
          ...purch,
          name: data.name,
          totalPrice: totalPrice,
          paymentMethod: storeInfo.paymentMethod[selectTabNum],
          cardNumber: inputCardNumber,
          usedCouponIds: selectCoupon,
          couponDiscountPrice: totalCouponDiscountPrice,
          address: {
            zonecode: data.zonecode,
            sigunguCode: data.sigunguCode,
            address: data.address,
            detailedAddress: data.detailedAddress,
          },
          tel: data.tel,
          deliRequest: data.deliRequest,
          businessFee: businessFee,
        }));
        selectedCoupon.length > 0 &&
          loginStatus.logined === "login" &&
          updateCouponIssuesMutate(selectedCoupon);
        removeCartsMutate({
          cartIds: selectCartIds,
          customerId: loginStatus.customerId,
        });
        //주문 정보 서버 전송
        addPurchaseMutate({ purchases: cofirmPurchase });
      } else {
        setCUSAlertState("입력되지 않은 값이 있습니다.");
      }
    },
    [
      register,
      cartState,
      appInfo,
      totalPrice,
      pendingPurchase,
      selectCoupon,
      selectTabNum,
      totalCouponDiscountPrice,
    ]
  );
```


<br><br>

### 🔐 클라이언트와 서버 통신 시 고려한 사항

- 스토어의 메뉴 데이터나 회원 정보처럼 민감한 데이터를 포함한 클라이언트의 서버 요청은, 로그인 시 발급된 액세스 토큰을 Authorization 헤더에 포함해 인증을 거친 후 서버에서 처리되도록 구성했습니다.

#### 1. 로그인 시 토큰 발급

- 서버는 클라이언트로부터 받은 로그인 정보로 회원 인증에 성공하면, 회원 아이디를 포함한 payload로 액세스 토큰과 리프레시 토큰을 생성합니다.
- 리프레시 토큰은 HttpOnly 쿠키로 전송되며, 액세스 토큰은 JWT 형식으로 응답 본문에 포함되어 클라이언트에 전달됩니다.
- 클라이언트는 액세스 토큰을 로컬 스토리지에 저장하며, 리프레시 토큰은 HttpOnly 속성으로 인해 직접 접근하거나 제어할 수 없습니다.

**🗄️ 서버**

[서버 리포지토리 adminRouters.ts](https://github.com/cbk96/track_bite_server/blob/master/src/routers/adminRouters.ts#L104)

```ts
중략;
const payload = {
  storeId: rest.storeId,
  role: "admin",
};

const loginToken = await U.jwtSignP(payload, { expiresIn: "1h" });
const accessToken = await U.jwtSignP(payload, {
  expiresIn: "15m",
});

res.cookie("adminLoginToken", loginToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 7,
});

res.json({
  ok: true,
  toLoginInfo: rest,
  accessToken: accessToken,
});
중략;
```

<br>

#### 2. 권한 인증

- 액세스 토큰이 필요한 요청의 경우, 클라이언트는 서버로부터 로그인 시 발급받은 액세스 토큰을 요청 헤더의 Authorization 필드에 포함하여 전송합니다.
- adminAuthenticateToken 미들웨어는 요청 헤더의 Authorization에 포함된 액세스 토큰을 검증하여, 유효한 관리자(storeId)인지 확인하고, 토큰이 유효하면 요청 객체에 인증 정보를 저장한 뒤 다음 핸들러로 넘깁니다.

**💻 클라이언트**

[src/server/postAndPut.ts](src/server/postAndPut.ts)

```ts
const postAndPut = (
  methodName: string,
  path: string,
  data: object,
  jwt?: string | null | undefined
) => {
(중략)
const secureFetch =
  (methodName: string) =>
  async (path: string, data: object, jwtKey?: string | null | undefined) => {
    let accessToken = localStorage.getItem(jwtKey ?? "");
    let response = await postAndPut(methodName, path, data, accessToken);
(중략)
export const post = secureFetch("POST");
export const put = secureFetch("PUT");
```

[src/service/menuApi.ts](src/service/menuApi.ts#L264)

```ts
mutationFn: (sendData: Menu) => post("/admin/menu/addMenu", sendData, CT.ADMIN_ACCESS_TOKEN),post("/admin/menu/addMenu", sendData, CT.ADMIN_ACCESS_TOKEN),
```

<br>

**🗄️ 서버**

[서버 리포지토리 authenticateToken](https://github.com/cbk96/track_bite_server/blob/master/src/middlewares/authenticateToken.ts#L5)

```ts
function authenticateTokenFactory<
  T extends string,
  P extends Record<string, string>
>(reqKey: T, payloadKey: keyof P) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const GRACE_PERIOD = 60;
    const authHeader = req.headers["authorization"];
    // "Bearer 토큰값" 형태에서 토큰만 추출
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ o: false });
      return;
    } // 토큰 없으면 Unauthorized

    try {
      const payload = await jwtVerifyP<P>(token);
      const currentTime = Math.floor(Date.now() / 1000); // 현재 시간(초)

      if (!payload[payloadKey]) {
        res.status(403).json({ ok: false });
        return;
      }

      if (payload.exp && Number(payload.exp) <= currentTime + GRACE_PERIOD) {
        // 이미 만료된 경우(실제로 verify가 통과한다면 exp 확인용)
        res.status(401).json({ ok: false, message: "Token expired" });
        return;
      }

      (req as any)[reqKey] = { [payloadKey]: payload[payloadKey] };
      next();
```

[서버 리포지토리 adminMenuRouters.ts](https://github.com/cbk96/track_bite_server/blob/master/src/routers/adminMenuRouters.ts#L63)

```ts
.post("/addMenu", adminAuthenticateToken, async (req, res) => {
```

<br>

#### 3. 권한 인증

- 프로젝트 전반에서 사용하는 커스텀 fetch 함수는 서버 응답을 가로채어, 응답 코드가 401일 경우 리프레시 토큰으로 액세스 토큰 재발급을 시도합니다.
- 재발급에 성공하면 원래 요청을 자동으로 재실행하며, 실패하면 지정된 페이지로 리다이렉트하거나 에러 처리를 수행합니다.
- 서버의 리프레시 토큰 라우트에서는 요청 헤더의 쿠키를 통해 사용자 정보를 조회하고, 해당 정보가 유효할 경우 리프레시 토큰과 액세스 토큰을 새로 발급하여 클라이언트에 응답합니다.

**💻 클라이언트**

[src/server/postAndPut.ts](src/server/postAndPut.ts#L34)

```ts
const secureFetch =
(methodName: string) =>
async (path: string, data: object, jwtKey?: string | null | undefined) => {
  let accessToken = localStorage.getItem(jwtKey ?? "");
  let response = await postAndPut(methodName, path, data, accessToken);

(중략)

if (response.status === 401 && refreshPath !== "") {
    // access token 만료됨 → 재발급 시도
    const refreshRes = await fetch(getServerUrl(refreshPath), {
      method: "POST",
      credentials: "include", // refresh token 쿠키 전송용
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      accessToken = data.accessToken;
      if (accessToken && jwtKey) {
        U.writeStringP(jwtKey, accessToken);

        // 재발급 성공하면 원래 요청 재시도
        response = await postAndPut(methodName, path, data, accessToken);
      }
    } else {
      // 재발급 실패하면 로그인 페이지 이동 또는 에러 처리
      window.location.href = accessDeniedPath;
      throw new Error("Unauthorized - please login again.");
    }
  }

  return response;
```

**🗄️ 서버**

[서버 리포지토리 adminRouters.ts](https://github.com/cbk96/track_bite_server/blob/master/src/routers/adminRouters.ts#L172)

```ts
.post("/refreshAdminToken", async (req, res) => {
  try {
        const token = req.cookies.adminLoginToken;
        const decoded = (await U.jwtVerifyP(token)) as JwtPayload;
        const storeId = decoded.storeId;
        const role = decoded.role;

        //토큰의 아이디 정보로 데이터베이스에서 회원 조회
        const result = await store.findOne(
          { storeId: storeId },
          { projection: { _id: 0 } }
        );

        if (result && role === "admin") {
          const { password, ...rest } = result;

          const payload = {
            storeId: rest.storeId,
            role: "admin",
          };

          const loginToken = await U.jwtSignP(payload, { expiresIn: "1h" });
          const accessToken = await U.jwtSignP(payload, {
            expiresIn: "15m",
          });

          res.cookie("adminLoginToken", loginToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });

          res.json({
            ok: true,
            toLoginInfo: rest,
            accessToken: accessToken,
          });
  (생략)
```

<br>

#### 4. 로그아웃 시 리프레시 토큰과 액세스 토큰 제거

- 로그아웃 요청이 들어오면 서버는 쿠키를 통해 사용자를 인증한 후, maxAge: 0으로 설정한 동일 이름의 쿠키를 다시 설정하여 브라우저에서 리프레시 토큰을 제거합니다.
- 이후 클라이언트는 로그아웃 응답을 확인하고, 로컬 스토리지에 저장된 액세스 토큰을 삭제합니다

**💻 클라이언트**

[src/service/authApi.tsx](src/service/authApi.tsx#L433)

```ts
const useAdminLogout = (callback?: Callback) => {
    const { mutate, isPending, error } = useMutation<
      {
        ok: boolean;
        errMsg?: string;
      },
      Error
    >({
      mutationFn: async () => {
        let sendAccessToken = localStorage.getItem(CT.ADMIN_ACCESS_TOKEN);
        const res = await fetch(getServerUrl("/admin/logout"), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sendAccessToken}`,
          },
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to login");
        return res.json();
      },
      onSuccess: (data) => {
        if (data.ok) {
          setLoginState(T.initialLoginAdmin);
          U.removeItemToStorage(CT.ADMIN_ACCESS_TOKEN); //액세스 토큰 삭제
          setADAlertState("로그아웃 되었습니다.");
          callback && callback();
        } else {
          setADAlertState(data.errMsg ?? "로그아웃중 문제가 발생했습니다.");
        }
    (생략)
```

**🗄️ 서버**

[서버 리포지토리 adminRouters.ts](https://github.com/cbk96/track_bite_server/blob/master/src/routers/adminRouters.ts#L145)

```ts
.post("/logout", adminAuthenticateToken, async (req, res) => {
      try {
        const token = req.cookies.adminLoginToken;

        if (!token) {
          throw new CustomError(
            "로그인 토큰을 찾을 수 없습니다.",
            "LOGIN_TOKEN_NOT_FOUND"
          );
        }
        res.cookie("adminLoginToken", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          path: "/",
          maxAge: 0,
        });

        res.json({
          ok: true,
        });
      } catch (e) {
        if (e instanceof Error) {
          res.json({ ok: false, errMsg: e.message });
        }
      }
    })
```

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

```

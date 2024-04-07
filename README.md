# YelpCamp - 캠핑장 찾기
Node.js + JavaScript + Express + MongoDB


## 🖥 프로젝트 소개
캠핑장을 검색, 등록, 리뷰 작성 및 열람하고 캠핑장의 위치를 알 수 있는 웹 애플리케이션입니다.

## ⏲ 개발 기간
- 23.11.27 ~ 23.12.21

### ⚙ 개발 환경
- `ejs`
- `JavaScript`
- 서버: `Node.js` `Express`
  - 유효성검사: `Joi`
  - Express 보안: `helmet.js`
  - `Passport`
- DB: `MongoDB`
  - 사진DB: `cloudinary api`
  - 지도: `mapbox`

## 📽 데모 동영상
### 진입 화면
|진입화면|
|:---:|
|![YelpCamp-Chrome2024-04-0718-18-03-ezgif com-crop](https://github.com/shinhee-lee/yelpcamp/assets/103517160/bb368b26-f622-490d-8a12-baf03691a4cf)|

### 회원가입/로그인
|회원가입|로그인|
|:---:|:---:|
|![register-ezgif com-video-to-gif-converter](https://github.com/shinhee-lee/yelpcamp/assets/103517160/8d6603b5-7924-4116-8211-5e12cebbb355)|![login-ezgif com-video-to-gif-converter](https://github.com/shinhee-lee/yelpcamp/assets/103517160/9dbdec6f-7949-4645-b6f5-78c9fec6fb2b)|

### 캠핑장
|열람|등록|삭제|
|:---:|:---:|:---:|
|![seecampground-ezgif com-video-to-gif-converter](https://github.com/shinhee-lee/yelpcamp/assets/103517160/c2dcd78a-d21c-4c4c-8b34-4b8fe8ab2e4e)|![makecampground-ezgif com-video-to-gif-converter](https://github.com/shinhee-lee/yelpcamp/assets/103517160/74fca1b5-3d6b-4fba-b750-401380cf51cb)|![deletecampground-ezgif com-video-to-gif-converter](https://github.com/shinhee-lee/yelpcamp/assets/103517160/d8f88878-c142-42e8-9418-3cdd88dce289)|

### 리뷰
|등록|삭제|
|:---:|:---:|
|![makereview-ezgif com-video-to-gif-converter](https://github.com/shinhee-lee/yelpcamp/assets/103517160/4a04048b-48c5-4117-b54d-fec3e2758417)|![deletereview-ezgif com-video-to-gif-converter](https://github.com/shinhee-lee/yelpcamp/assets/103517160/6fb5f665-03c0-4f03-ba08-52f5833865d2)|


## 📌 주요 기능
사용자 CRUD, 캠핑장 찾기, 리뷰 작성, 지도로 위치를 볼 수 있습니다.

#### 첫 화면
- 현재 등록된 캠핑장들의 위치는 mapbox의 cluster을 이용해 직관적으로 보여줌
  <img width="941" alt="image" src="https://github.com/shinhee-lee/yelpcamp/assets/103517160/2af21a10-6a81-449e-9333-726130265be5">

#### 로그인
- DB값 검증
- 실패 시 실패 Flash 문구 뜸
  <img width="960" alt="image" src="https://github.com/shinhee-lee/yelpcamp/assets/103517160/46b8fcef-c952-45cd-9082-997e26581ed5">

#### 회원가입
- 이메일 형식 확인  
  <img width="229" alt="image" src="https://github.com/shinhee-lee/yelpcamp/assets/103517160/6e4d614a-b541-4e00-9e8d-62784ee7c831">
- 회원가입 성공 시 바로 로그인

#### 캠핑장
##### 목록
- 첫 화면에서 캠핑장 목록을 볼 수 있음
  - 캠핑장 이름, 설명, 위치
##### 상세 정보 (열람)
- 캠핑장 자세히 보기 버튼 클릭 시 상세 설명 볼 수 있음
  - 캠핑장 사진, 이름, 설명, 위치, 가격, 지도상 위치, 리뷰
##### 등록
- 등록 시 캠핑장 이름, 위치, 가격, 설명, 이미지 업로드(선택) 가능
- 이미지 업로드는 cloudinary api를 이용
##### 삭제
- 캠핑장 등록자 본인만 삭제 가능
##### 리뷰
- 로그인한 사용자만 리뷰 작성 가능
- 본인이 작성한 리뷰만 삭제 가능


## ❗ 개선 요소
- 리뷰 작성 시 사진 업로드 기능 포함
- 언어를 한국어로 변경
- 로그인 시 사용자의 간략한 정보 보이도록 변경
- 캠핑장 검색 기능

# 길따라 | 산책길 기록 및 공유 서비스

## 📌 목차
* [프로젝트 소개](#프로젝트-소개)
* [개발 기간](#개발-기간)
* [개발 인원](#개발-인원)
* [주요 기능](#주요-기능)
* [기술 스택](#기술-스택)
* [구현 기능](#구현-기능)
* [트러블 슈팅](#트러블-슈팅)

## 프로젝트 소개
내 주변 산책길을 기록, 공유하고, 이웃의 산책길을 따라 걸으며 소통하는 산책을 통한 힐링 제공 서비스

## 개발 기간
2024.10.28 ~ 2024.12.13

## 개발 인원
### Front-End & Back-End (6명)
* 웹 기획 및 개발

## 주요 기능
* 상단 헤더
  * 다크모드 토글 버튼
  * 알림 개수 및 확인버튼
  * 햄버거 내비게이터 
* 메인 페이지
  * 산책길 게시물들 보러가기
  * 내가 쓴 글 보러가기
  * 지금 산책길 게시물 공유하러가기
* 경로 기록페이지
  * 경로 녹화하기
  * 경로 저장하기 및 마커 편집
* 산책길 게시글 페이지
  * 내 현재위치 , 내 집주변 기반의 게시물 불러오기
  * 검색으로 해당하는 키워드에 맞는 산책길 찾기
* 산책길 게시글 상세보기
  * 게시글 찜 , 좋아요 , 댓글달기
  * 산책길 따라걷기
* 마아페이지
  * 내 경로기록 확인하기
  * 내가 찜한 게시물 확인하기
  * 내가 구독한 사람들 리스트 보기
  * 내 포인트 보기
  * 내가 쓴 게시물 보기
 


## 기술 스택
### Front-End
* React
* TypeScript

### Back-End
* Java 17
* Apache Tomcat 10

### Database
* PostgreSQL
* AWS RDS
* AWS S3

### DevOps & Tools
* Git / GitHub
* GitHub Actions
* Docker
* Jira / Notion / Figma

## 트러블 슈팅
### SSE 구현 과정에서의 어려움
* 문제 상황: SSE 개념 이해 및 구현의 어려움
* 해결 과정: 
  * 팀원들과의 지속적인 소통을 통한 요구사항 구체화
  * SSE 관련 학습 및 개념 정리
  * 단계적 구현을 통한 기능 완성

## GitHub
- [Frontend Repository](https://github.com/teikim98/GilProject-FE)
- [Backend Repository](https://github.com/momoandsana/Gil-Project-Backend)

## 💻 실행 방법
```bash
$ git clone https://github.com/teikim98/GilProject-FE
$ cd GilProject-FE
$ npm install
$ npm start
```

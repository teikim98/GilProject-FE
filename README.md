# 길따라 | 산책길 기록 및 공유 서비스
(Gilddara | Walkway Recording and Sharing Service)

## 📌 목차(Table of Contents)
* [프로젝트 소개(Introduction to the Project)](#프로젝트-소개(introduction-to-the-project))
* [개발 기간(Development Period)](#개발-기간(development-period))
* [개발 인원(Development Members)](#개발-인원(development-members))
* [주요 기능(Key Features)](#주요-기능(key-features))
* [기술 스택(Tech Stack)](#기술-스택(tech-stack))
* [구현 기능(Implementation Features)](#구현-기능)
* [트러블 슈팅(Troubleshooting)](#트러블-슈팅(troubleshooting))

## 프로젝트 소개(Introduction to the Project)
내 주변 산책길을 기록, 공유하고, 이웃의 산책길을 따라 걸으며 소통하는 산책을 통한 힐링 제공 서비스  
(A service that provides healing through walking that records and shares the walkways around me, and communicates by walking along the walkways of the neighbors.)

## 개발 기간(Development Period)
2024.10.28 ~ 2024.12.13

## 개발 인원(Development Members)
### Front-End & Back-End (6명)
* 웹 기획 및 개발(6 people for web planning and development)

## 주요 기능(Key Features)
* 상단 헤더(Top Header)
  * 다크모드 토글 버튼(Dark Mode toggle button)
  * 알림 개수 및 확인버튼(Notification count and OK button)
  * 햄버거 내비게이터(Hamburger Navigator)
* 메인 페이지(Main page)
  * 산책길 게시물들 보러가기(Going to see the posts on walkway)
  * 내가 쓴 글 보러가기(Going to see what I wrote)
  * 지금 산책길 게시물 공유하러가기(Go to share your walkway post now)
* 경로 기록페이지(Path Recording Page)
  * 경로 녹화하기(Path Recording)
  * 경로 저장하기 및 마커 편집(Save Paths and Edit Markers)
* 산책길 게시글 페이지(Walkway Post Page)
  * 내 현재위치 , 내 집주변 기반의 게시물 불러오기(Bringing up posts based around my current location, my home)
  * 검색으로 해당하는 키워드에 맞는 산책길 찾기(Search to find the right walking path for the corresponding keyword)
* 산책길 게시글 상세보기(Read more about the walkway post)
  * 게시글 찜 , 좋아요 , 댓글달기(Features for Post favorite, like, comment)
  * 산책길 따라걷기(Walking along the path)
* 마아페이지(My page)
  * 내 경로기록 확인하기(Check my path history)
  * 내가 찜한 게시물 확인하기(Check out my posts)
  * 내가 구독한 사람들 리스트 보기(See the list of people I subscribed to)
  * 내 포인트 보기(Look at my point)
  * 내가 쓴 게시물 보기(See the post I wrote)
 


## 기술 스택(Tech Stack)
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

## 트러블 슈팅(Troubleshooting)
### SSE 구현 과정에서의 어려움(Difficulties in implementing SSE)
* 문제 상황(Problem): SSE 개념 이해 및 구현의 어려움(Difficulty in understanding and implementing SSE concepts)
* 해결 과정(Solving): 
  * 팀원들과의 지속적인 소통을 통한 요구사항 구체화
    (Continuous communication with team members to specify requirements)
  * SSE 관련 학습 및 개념 정리
    (Learning and conceptual arrangement about SSE)
  * 단계적 구현을 통한 기능 완성
    (Step-by-step implementation to complete functionality)

## GitHub
- [Frontend Repository](https://github.com/teikim98/GilProject-FE)
- [Backend Repository](https://github.com/momoandsana/Gil-Project-Backend)

## 💻 실행 방법(How to execute)
```bash
$ git clone https://github.com/teikim98/GilProject-FE
$ cd GilProject-FE
$ npm install
$ npm start
```

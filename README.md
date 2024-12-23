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
### 공통 기능
* 상단 헤더
  * 메인페이지, 마이페이지 등 주요 페이지 이동
  * 로그인/로그아웃 기능
* 하단 푸터

### 담당 구현 기능
* 마이페이지
  * 내 정보 및 활동 내역 확인
  * 프로필 수정 기능
* 실시간 알림
  * SSE를 활용한 실시간 알림 시스템
  * 댓글 알림, 구독자 새 게시글 알림

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

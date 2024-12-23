# 길따라 (산책길 공유 플랫폼)

내 주변 산책길을 기록, 공유하고, 이웃의 산책길을 따라 걸으며 소통하는 산책을 통한 힐링 제공 서비스

## 📌 프로젝트 소개
- **개발 기간**: 2024.10.28 ~ 2024.12.13
- **팀 구성**: 웹 기획 및 웹 개발 6명
- **GitHub**: 
  - [Frontend Repository](https://github.com/teikim98/GilProject-FE)
  - [Backend Repository](https://github.com/momoandsana/Gil-Project-Backend)

## 🛠️ 기술 스택
### Frontend
- Next.js 14.xx

### Backend
- Java 17
- Apache Tomcat 10

### Database
- PostgreSQL
- AWS RDS
- AWS S3

### DevOps
- Git
- GitHub Actions
- Docker

### 협업 도구
- Jira
- Notion
- Figma

## 📂 담당 기능
### 1. 마이페이지 & 내 정보 수정
- 사용자의 정보 및 활동 내역 확인 기능 구현
- 프론트엔드와 백엔드 전반적인 기능 구현

### 2. 실시간 알림 기능
- SSE(Server-Sent Events) 기술을 활용한 실시간 알림 시스템 구현
- 구현 기능:
  - 내 게시글 댓글 알림
  - 구독자의 새 게시글 알림

## 🚀 트러블 슈팅
### SSE 구현 과정에서의 어려움
- **문제 상황**: SSE 개념 이해 및 구현의 어려움
- **해결 과정**: 
  - 팀원들과의 지속적인 소통을 통한 요구사항 구체화
  - SSE 관련 학습 및 개념 정리
  - 단계적 구현을 통한 기능 완성

## 📱 주요 화면
<img width="321" alt="image" src="https://github.com/user-attachments/assets/ea921e76-1db0-4333-8a39-64395d8297af" />

- 로그인
- 메인 화면
- 산책길 공유
- 따라 걷기

## 📋 산출물
<img width="128" alt="image" src="https://github.com/user-attachments/assets/a24c9e6e-0831-4468-b314-20d91a4fd18b" />

- 요구사항명세서
  <img width="125" alt="image" src="https://github.com/user-attachments/assets/6282a77b-9a7f-4994-8853-fb872b987533" />

- 데이터베이스 모델링
  <img width="128" alt="image" src="https://github.com/user-attachments/assets/1d0e37cf-38aa-4d03-9f84-9fdc8df4a4a3" />

- 레이아웃 정의서

## 💻 실행 방법
```bash
$ git clone https://github.com/teikim98/GilProject-FE
$ cd GilProject-FE
$ npm install
$ npm start
```


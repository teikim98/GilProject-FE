import { Post } from "@/types/types";
import { convertSavedPathToPost } from "@/util/convertSavedPathToPath";

export const dummyPosts: Post[] = [
  {
    postId: 1,
    nickName: "러너김",
    pathId: 1,
    startLat: 37.5665,
    startLong: 126.978,
    state: 1,
    title: "한강 러닝 코스",
    content: "오늘 한강에서 러닝했어요. 날씨가 정말 좋았습니다!",
    tag: "러닝",
    writeDate: "2024-11-14T09:30:00",
    updateDate: "2024-11-14T09:30:00",
    readNum: 42,
    likesCount: 3,
    repliesCount: 2,
    postWishListsNum: 4,
    userImgUrl: "",
    pathResDTO: {
      id: 1,
      user: { id: 1 },
      content: "한강 러닝 코스 경로",
      state: 1,
      title: "한강 러닝 코스",
      time: 45,
      distance: 5.2,
      createdDate: "2024-11-14T09:30:00",
      startLat: 37.5665,
      startLong: 126.978,
      startAddr: null,
      routeCoordinates: [
        { latitude: "37.5665", longitude: "126.9780" },
        { latitude: "37.5667", longitude: "126.9785" },
        { latitude: "37.5670", longitude: "126.9790" },
      ],
      pins: [
        {
          id: 1,
          latitude: 37.5665,
          longitude: 126.978,
          content: "시작점 - 여의도 한강공원",
          imageUrl:
            "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?auto=format&fit=crop&w=400&h=300",
        },
      ],
    },
    imageUrls: [
      "https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1528543606781-2f6e6857f318?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=800&h=600",
    ],
    liked: false,
    wishListed: false,
  },
  {
    postId: 2,
    nickName: "등산왕",
    pathId: 2,
    startLat: 37.6532,
    startLong: 126.9779,
    state: 1,
    title: "북한산 등산 코스",
    content: "북한산 정상까지 등산했습니다. 경치가 끝내주네요!",
    tag: "등산",
    writeDate: "2024-11-13T15:20:00",
    updateDate: "2024-11-13T15:20:00",
    readNum: 67,
    likesCount: 4,
    repliesCount: 3,
    postWishListsNum: 3,
    userImgUrl: "",
    pathResDTO: {
      id: 2,
      user: { id: 2 },
      content: "북한산 등산 코스 경로",
      state: 1,
      title: "북한산 등산 코스",
      time: 180,
      distance: 8.5,
      startLat: 37.6532,
      createdDate: "2024-11-14T09:30:00",
      startLong: 126.9779,
      startAddr: null,
      routeCoordinates: [
        { latitude: "37.6532", longitude: "126.9779" },
        { latitude: "37.6540", longitude: "126.9785" },
        { latitude: "37.6545", longitude: "126.9790" },
      ],
      pins: [
        {
          id: 2,
          latitude: 37.6532,
          longitude: 126.9779,
          content: "북한산 입구",
          imageUrl:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&h=300",
        },
      ],
    },
    imageUrls: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1486179814561-91c2d61fe857?auto=format&fit=crop&w=800&h=600",
    ],
    liked: false,
    wishListed: false,
  },
  {
    postId: 3,
    nickName: "자전거매니아",
    pathId: 3,
    startLat: 37.5139,
    startLong: 127.1058,
    state: 1,
    title: "올림픽공원 자전거 코스",
    content: "올림픽공원 한바퀴 자전거 라이딩 완료!",
    tag: "자전거",
    writeDate: "2024-11-12T11:00:00",
    updateDate: "2024-11-12T11:00:00",
    readNum: 31,
    likesCount: 2,
    repliesCount: 3,
    postWishListsNum: 2,
    userImgUrl: "",
    pathResDTO: {
      id: 3,
      user: { id: 3 },
      content: "올림픽공원 자전거 코스 경로",
      state: 1,
      title: "올림픽공원 자전거 코스",
      time: 60,
      distance: 12.3,
      startLat: 37.5139,
      startLong: 127.1058,
      createdDate: "2024-11-14T09:30:00",
      startAddr: null,
      routeCoordinates: [
        { latitude: "37.5139", longitude: "127.1058" },
        { latitude: "37.5145", longitude: "127.1065" },
        { latitude: "37.5150", longitude: "127.1070" },
      ],
      pins: [],
    },
    imageUrls: [
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1545559054-8f4f9e855781?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1506789014804-b92b0088af92?auto=format&fit=crop&w=800&h=600",
    ],
    liked: false,
    wishListed: false,
  },
  {
    postId: 4,
    nickName: "산책러버",
    pathId: 4,
    startLat: 37.5113,
    startLong: 127.098,
    state: 1,
    title: "석촌호수 산책 코스",
    content: "석촌호수 한바퀴 산책하고 왔어요~",
    tag: "산책",
    writeDate: "2024-11-11T16:45:00",
    updateDate: "2024-11-11T16:45:00",
    readNum: 25,
    likesCount: 2,
    repliesCount: 1,
    postWishListsNum: 3,
    userImgUrl: "",
    pathResDTO: {
      id: 4,
      user: { id: 4 },
      content: "석촌호수 산책 코스 경로",
      state: 1,
      title: "석촌호수 산책 코스",
      time: 30,
      distance: 2.8,
      createdDate: "2024-11-14T09:30:00",
      startLat: 37.5113,
      startLong: 127.098,
      startAddr: null,
      routeCoordinates: [
        { latitude: "37.5113", longitude: "127.0980" },
        { latitude: "37.5118", longitude: "127.0985" },
        { latitude: "37.5120", longitude: "127.0990" },
      ],
      pins: [
        {
          id: 4,
          latitude: 37.5113,
          longitude: 127.098,
          content: "석촌호수 시작점",
          imageUrl:
            "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=400&h=300",
        },
      ],
    },
    imageUrls: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?auto=format&fit=crop&w=800&h=600",
    ],
    liked: false,
    wishListed: false,
  },
  {
    postId: 5,
    nickName: "웨이트왕",
    pathId: 5,
    startLat: 37.5037,
    startLong: 127.0447,
    state: 1,
    title: "강남구 헬스장 투어",
    content: "오늘도 역시 헬스장 순례!",
    tag: "헬스",
    writeDate: "2024-11-10T20:15:00",
    updateDate: "2024-11-10T20:15:00",
    readNum: 89,
    likesCount: 5,
    repliesCount: 4,
    postWishListsNum: 4,
    userImgUrl: "",
    pathResDTO: {
      id: 5,
      user: { id: 5 },
      content: "강남구 헬스장 투어 경로",
      state: 1,
      title: "강남구 헬스장 투어",
      time: 120,
      createdDate: "2024-11-14T09:30:00",
      distance: 3.5,
      startLat: 37.5037,
      startLong: 127.0447,
      startAddr: null,
      routeCoordinates: [
        { latitude: "37.5037", longitude: "127.0447" },
        { latitude: "37.5042", longitude: "127.0452" },
        { latitude: "37.5045", longitude: "127.0457" },
      ],
      pins: [
        {
          id: 5,
          latitude: 37.5037,
          longitude: 127.0447,
          content: "첫 번째 헬스장",
          imageUrl:
            "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=400&h=300",
        },
      ],
    },
    imageUrls: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&h=600",
    ],
    liked: false,
    wishListed: false,
  },
];

const savedPost =
  typeof window !== "undefined" ? convertSavedPathToPost() : null;
if (savedPost) {
  dummyPosts.push(savedPost);
}

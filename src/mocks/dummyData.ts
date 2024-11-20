import { Post } from "@/types/types";
import { convertSavedPathToPost } from "@/util/convertSavedPathToPath";

export const dummyPosts: Post[] = [
  {
    id: 1,
    userNickName: "러너김",
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
    postLikesUsers: [2, 3, 4],
    postLikesNum: 3,
    repliesUsers: [2, 5],
    repliesNum: 2,
    postWishListsUsers: [1, 3, 6, 7],
    postWishListsNum: 4,
    images: [
      "https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1528543606781-2f6e6857f318?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=800&h=600",
    ],
    routeData: {
      path: [
        { lat: 37.5665, lng: 126.978 },
        { lat: 37.5667, lng: 126.9785 },
        { lat: 37.567, lng: 126.979 },
      ],
      markers: [
        {
          id: "marker-1",
          position: { lat: 37.5665, lng: 126.978 },
          content: "시작점 - 여의도 한강공원",
          image:
            "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?auto=format&fit=crop&w=400&h=300",
        },
      ],
      recordedTime: 45,
      distance: 5.2,
    },
  },
  {
    id: 2,
    userNickName: "등산왕",
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
    postLikesUsers: [1, 4, 5, 8],
    postLikesNum: 4,
    repliesUsers: [2, 3, 6],
    repliesNum: 3,
    postWishListsUsers: [4, 7, 9],
    postWishListsNum: 3,
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1486179814561-91c2d61fe857?auto=format&fit=crop&w=800&h=600",
    ],
    routeData: {
      path: [
        { lat: 37.6532, lng: 126.9779 },
        { lat: 37.654, lng: 126.9785 },
        { lat: 37.6545, lng: 126.979 },
      ],
      markers: [
        {
          id: "marker-2",
          position: { lat: 37.6532, lng: 126.9779 },
          content: "북한산 입구",
          image:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&h=300",
        },
      ],
      recordedTime: 180,
      distance: 8.5,
    },
  },
  {
    id: 3,
    userNickName: "자전거매니아",
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
    postLikesUsers: [2, 5],
    postLikesNum: 2,
    repliesUsers: [1, 4, 7],
    repliesNum: 3,
    postWishListsUsers: [3, 6],
    postWishListsNum: 2,
    images: [
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1545559054-8f4f9e855781?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1506789014804-b92b0088af92?auto=format&fit=crop&w=800&h=600",
    ],
    routeData: {
      path: [
        { lat: 37.5139, lng: 127.1058 },
        { lat: 37.5145, lng: 127.1065 },
        { lat: 37.515, lng: 127.107 },
      ],
      markers: [],
      recordedTime: 60,
      distance: 12.3,
    },
  },
  {
    id: 4,
    userNickName: "산책러버",
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
    postLikesUsers: [1, 3],
    postLikesNum: 2,
    repliesUsers: [5],
    repliesNum: 1,
    postWishListsUsers: [2, 4, 8],
    postWishListsNum: 3,
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?auto=format&fit=crop&w=800&h=600",
    ],
    routeData: {
      path: [
        { lat: 37.5113, lng: 127.098 },
        { lat: 37.5118, lng: 127.0985 },
        { lat: 37.512, lng: 127.099 },
      ],
      markers: [
        {
          id: "marker-4",
          position: { lat: 37.5113, lng: 127.098 },
          content: "석촌호수 시작점",
          image:
            "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=400&h=300",
        },
      ],
      recordedTime: 30,
      distance: 2.8,
    },
  },
  {
    id: 5,
    userNickName: "웨이트왕",
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
    postLikesUsers: [1, 2, 3, 4, 5],
    postLikesNum: 5,
    repliesUsers: [1, 3, 6, 8],
    repliesNum: 4,
    postWishListsUsers: [2, 5, 7, 9],
    postWishListsNum: 4,
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&h=600",
    ],
    routeData: {
      path: [
        { lat: 37.5037, lng: 127.0447 },
        { lat: 37.5042, lng: 127.0452 },
        { lat: 37.5045, lng: 127.0457 },
      ],
      markers: [
        {
          id: "marker-5",
          position: { lat: 37.5037, lng: 127.0447 },
          content: "첫 번째 헬스장",
          image:
            "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=400&h=300",
        },
      ],
      recordedTime: 120,
      distance: 3.5,
    },
  },
];

const savedPost =
  typeof window !== "undefined" ? convertSavedPathToPost() : null;
if (savedPost) {
  dummyPosts.push(savedPost);
}

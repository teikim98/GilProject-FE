import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import NoticeComponent from "./NoticeComponent";
import { getNoticeAll } from "@/api/notice";
import React, { useEffect, useState } from "react";
import { Notice } from "@/types/types_JHW";
import Autoplay from "embla-carousel-autoplay";

export function NoticeContainer() {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const result = await getNoticeAll();
        // console.log(result);
        setNotices(result);
      } catch (error) {
        console.error("Error fetching notices", error);
      }
    };

    fetchNotices(); // 비동기 함수 호출
  }, []);

  return (
    <>
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "center", // 슬라이드 정렬
          loop: true,
        }}
        orientation="vertical"
      >
        <CarouselContent className="-mt-1 h-[50px]">
          {/* 받아온 공지사항 데이터를 CarouselItem으로 맵핑 */}
          {notices.map((notice, index) => (
            <CarouselItem key={index} className="pt-1 md:basis-1/2">
              <Card>
                <NoticeComponent notice={notice} />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious /> */}
        {/* <CarouselNext /> */}
      </Carousel>
    </>
  );
}

export default NoticeContainer;

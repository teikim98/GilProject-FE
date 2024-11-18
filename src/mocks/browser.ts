import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

worker
  .start()
  .then(() => {
    console.log("MSW 클라이언트 워커가 시작되었습니다.");
  })
  .catch((err) => {
    console.error("MSW 클라이언트 워커 시작 실패:", err);
  });

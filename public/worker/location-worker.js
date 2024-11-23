const CACHE_NAME = "location-cache-v1";
let locations = [];
let isTracking = false;
let trackingType = null;

self.addEventListener("message", (event) => {
  const { type, data } = event.data;

  switch (type) {
    case "START_RECORDING":
      isTracking = true;
      trackingType = "RECORDING";
      locations = [];
      break;

    case "STOP_TRACKING":
      if (isTracking) {
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: `${trackingType}_LOCATIONS`,
              locations: locations,
            });
          });
        });
        isTracking = false;
        trackingType = null;
        locations = [];
      }
      break;

    case "LOCATION_UPDATE":
      if (isTracking) {
        // 이미 스무딩된 위치 데이터 저장
        const locationData = {
          position: {
            lat: data.lat,
            lng: data.lng,
          },
          accuracy: data.accuracy,
          timestamp: data.timestamp,
        };

        locations.push(locationData);

        // 실시간 업데이트 전송
        if (locations.length % 5 === 0) {
          // 5개 위치마다 전송
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: "BACKGROUND_UPDATE",
                location: locationData,
                trackingType,
              });
            });
          });
        }
      }
      break;
  }
});

// 위치 데이터 주기적 저장
setInterval(() => {
  if (isTracking && locations.length > 0) {
    caches.open(CACHE_NAME).then((cache) => {
      cache.put(
        `/location-data-${trackingType}`,
        new Response(
          JSON.stringify({
            locations,
            trackingType,
            lastUpdate: Date.now(),
          })
        )
      );
    });
  }
}, 30000); // 30초마다 저장

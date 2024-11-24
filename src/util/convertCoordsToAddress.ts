/**
 * 위도, 경도를 주소로 변환
 * @param lat 위도
 * @param lng 경도
 * @returns 주소 문자열
 */
export const convertCoordsToAddress = async (
  lat: number,
  lng: number
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    kakao.maps.load(function () {
      const geocoder = new kakao.maps.services.Geocoder();
      const coord = new kakao.maps.LatLng(lat, lng);

      const callback = function (
        result: any[],
        status: kakao.maps.services.Status
      ) {
        if (status === kakao.maps.services.Status.OK) {
          if (result[0]) {
            // 도로명 주소가 있는 경우 도로명 주소 사용, 없으면 지번 주소 사용
            const address = result[0].road_address
              ? result[0].road_address.address_name
              : result[0].address.address_name;
            resolve(address);
          } else {
            reject("No address found");
          }
        } else {
          reject("Geocoder failed");
        }
      };

      geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    });
  });
};

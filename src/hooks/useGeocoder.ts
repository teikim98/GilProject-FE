"use client";

import { useEffect, useState } from "react";

interface GeocoderResult {
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
  };
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    building_name: string;
  } | null;
}

export function useGeocoder() {
  const [geocoder, setGeocoder] = useState<any>(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      const geocoderInstance = new window.kakao.maps.services.Geocoder();
      setGeocoder(geocoderInstance);
    }
  }, []);

  const coordsToAddress = async (
    lat: number,
    lng: number
  ): Promise<GeocoderResult | null> => {
    return new Promise((resolve, reject) => {
      if (!geocoder) {
        reject("Geocoder not initialized");
        return;
      }

      geocoder.coord2Address(
        lng,
        lat,
        (result: GeocoderResult[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            resolve(result[0]);
          } else {
            reject("Failed to convert coordinates to address");
          }
        }
      );
    });
  };

  const addressToCoords = (address: string)=>{
    return new Promise((resolve, reject) => {
      // Kakao Maps SDK 로드 체크
      if (!kakao?.maps?.services) {
        reject('Kakao Maps SDK not loaded');
        return;
      }
  
      const geocoder = new kakao.maps.services.Geocoder();
  
      geocoder.addressSearch(address, (result: any, status: any) => {
        if (status === kakao.maps.services.Status.OK) {
          resolve({
            lat: Number(result[0].y),
            lng: Number(result[0].x)
          });
        } else {
          reject('Failed to convert address to coordinates');
        }
      });
    });
  }
  

  return {
    coordsToAddress,
    addressToCoords,
    isLoaded: !!geocoder,
  };
}
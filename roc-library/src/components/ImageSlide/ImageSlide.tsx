// src/components/ImageSlider.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import centralLabImage from "../../../public/assets/images/Events/central_lab.png";

const images = [centralLabImage,centralLabImage];

export default function ImageSlider() {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      loop
      className="w-full"
    >
      {images.map((src, i) => (
        <SwiperSlide key={i} className="w-full">
          <Image
            src={src}
            alt={`Slide ${i + 1}`}
            className="object-cover h-[150px] w-full sm:h-[400px]"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

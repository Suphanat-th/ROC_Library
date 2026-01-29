// src/components/ImageSlider.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import centralLabImage from "../../../public/assets/images/Events/central_lab.png";
import monsterx3Image from "../../../public/assets/images/Events/monsterx3.png";
import Link from "next/link";


const slides = [
  // { src: centralLabImage, href: "/central-lab" },
  { src: monsterx3Image, href: "/monsterx3" },
];

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
      {slides.map((slide, i) => (
        <SwiperSlide key={i} className="w-full cursor-pointer">
          <Link href={slide.href} passHref>
            <Image
              src={slide.src}
              alt={`Slide ${i + 1}`}
              className="object-cover h-[150px] w-full sm:h-[400px]"
              width={800}   // กำหนด width/height สำหรับ next/image
              height={400}
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

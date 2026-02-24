"use client";

import { useMemo, useState } from "react";
import JobStoneCard from "./stoneClasses";
import { JobSelect } from "./jobFilter";
import { JobClass, StoneClasses } from "@/types/StoneClassses";

export default function JobStonesPage() {
  const jobStones: JobClass[] = [
    //Lord Knight
    {
      name: "Lord Knight",
      class: "LordKnight",
      image: "/assets/images/ClassesJob/LordKnight.webp",
      Stone: [
        {
          name: "Lord Knight Stone I",
          version: 1,
          image: "/assets/images/ClassesJob/LordKnight.webp",
          position: "",
          description: null,
          stone: [
            {
              name: "Lord Knight Stone",
              version: 0,
              image: "/assets/images/Icon/DefualtIconStone.png",
              stone: [],
              position: "garment",
              description: {
                default: [
                  "<span>เพิ่มดาเมจ Bowling Bash </span><img src='https://irowiki.org/w/images/5/53/Bowling_Bash.png?20070923200800' class='h-6 w-6 mx-3'/> และ Brandish Spear <img src='https://irowiki.org/w/images/2/20/Brandish_Spear.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 10%</span>",
                ],
                upper: [
                  "<span>เพิ่มดาเมจ Clashing Spiral</span> <img src='https://irowiki.org/w/images/0/0f/Clashing_Spiral.png' class='h-6 w-6 mx-3'/> <span> ขึ้น 10%</span>",
                ],
                middle: [
                  "มีโอกาส 1% ที่จะได้รับ HP,SP กลับมา 10% ของความเสียหายกายภาพ",
                ],
                lower: ["ลด Fix Cast time 40%"],
              },
            },
            {
              name: "Lord Knight Stone",
              version: 1,
              image: "/assets/images/Icon/DefualtIconStone.png",
              stone: [],
              position: "upper",
              description: {
                default: [
                  "<span>ทุกๆ การเรียนรู้สกิล Spear Mastery </span><img src='https://irowiki.org/w/images/5/52/Spear_Mastery.png' class='h-6 w-6 mx-3'/>  <span>  1 เลเวล ATK +2</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Lord Knight Stone",
              version: 2,
              image: "/assets/images/Icon/DefualtIconStone.png",
              stone: [],
              position: "middle",
              description: {
                default: [
                  "<span>เพิ่มดาเมจ Clashing Spiral</span> <img src='https://irowiki.org/w/images/0/0f/Clashing_Spiral.png' class='h-6 w-6 mx-3'/><span> ขึ้น 15%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Lord Knight Stone",
              version: 3,
              image: "/assets/images/Icon/DefualtIconStone.png",
              stone: [],
              position: "lower",
              description: {
                default: [
                  "<span>ทุกๆ การเรียนรู้สกิล Cavalier Mastery</span><img src='https://irowiki.org/w/images/9/9f/Cavalier_Mastery.png' class='h-6 w-6 mx-3'/> <span> เพิ่ม 1 เลเวล เพิ่ม ASPD 1%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
          ],
        },

        {
          name: "Lord Knight Stone II",
          version: 1,
          image: "/assets/images/ClassesJob/LordKnight.webp",
          position: "",
          description: null,
          stone: [
            {
              name: "Lord Knight Stone II",
              version: 0,
              image: "/assets/images/Icon/LordKnightStoneGarment2.png",
              stone: [],
              position: "garment",
              description: {
                default: [
                  "<span>เพิ่มดาเมจ Bowling Bash </span><img src='https://irowiki.org/w/images/5/53/Bowling_Bash.png?20070923200800' class='h-6 w-6 mx-3'/> <span>ขึ้น 20%</span>",
                ],
                upper: [
                  "<span>เพิ่มดาเมจ Bowling Bash </span><img src='https://irowiki.org/w/images/5/53/Bowling_Bash.png?20070923200800' class='h-6 w-6 mx-3'/> <span>ขึ้น 10%</span>",
                ],
                middle: [
                  "<span>ทุก ๆ การเรียนรู้สกิล Parrying </span><img src='https://irowiki.org/w/images/4/44/Parry.png' class='h-6 w-6 mx-3'/>  <span>2 เลเวล ลดระยะเวลาร่ายแบบคงที่ 0.1 วินาที (FIX)</span>",
                ],
                lower: ["เพิ่ม Damage ทางกายภาพระยะใกล้ 5%"],
              },
            },
            {
              name: "Lord Knight Stone II",
              version: 1,
              image: "/assets/images/Icon/LordKnightStone2.png",
              stone: [],
              position: "upper",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้สกิล  Concentration</span><img src='https://irowiki.org/cl/images/8/80/Spear_Dynamo.png' class='h-6 w-6 mx-3'/>  <span> 1 เลเวล เพิ่ม DEF +10</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Lord Knight Stone II",
              version: 2,
              image: "/assets/images/Icon/LordKnightStone2.png",
              stone: [],
              position: "middle",
              description: {
                default: [
                  "<span>เพิ่มดาเมจ Bowling Bash </span><img src='https://irowiki.org/w/images/5/53/Bowling_Bash.png?20070923200800' class='h-6 w-6 mx-3'/> <span>ขึ้น 20%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Lord Knight Stone II",
              version: 3,
              image: "/assets/images/Icon/LordKnightStone2.png",
              stone: [],
              position: "lower",
              description: {
                default: [
                  "<span>ทุกๆ การเรียนรู้สกิล Aura Blade </span><img src='https://irowiki.org/cl/images/c/c3/Aura_Blade.png' class='h-6 w-6 mx-3'/> <span>เพิ่ม 1 เลเวล พิ่ม ATK+5 , HIT+1</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
          ],
        },
      ],
    },
    // Paladin
    {
      name: "Paladin",
      class: "Paladin",
      image: "/assets/images/ClassesJob/Paladin.webp",
      Stone: [
        {
          name: "Paladin Stone I",
          version: 1,
          image: "/assets/images/ClassesJob/Paladin.webp",
          position: "",
          description: null,
          stone: [
            {
              name: "Paladin Stone",
              version: 0,
              image: "/assets/images/Icon/PaladinGarmentStone.png",
              stone: [],
              position: "garment",
              description: {
                default: [
                  "<span>เพิ่มดาเมจของ Holy Cross </span><img src='https://irowiki.org/w/images/b/bb/Holy_Cross.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 15%</span>",
                ],
                upper: [
                  "มีโอกาส 2% ที่จะได้รับ SP เพิ่มขึ้น 1% เมื่อทำการโจมตีทางกายภาพ",
                ],
                middle: ["ความเร็วในการโจมตีเพิ่มขึ้น 10%"],
                lower: [
                  "<span>เพิ่มดาเมจของ Holy Cross </span><img src='https://irowiki.org/w/images/b/bb/Holy_Cross.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 15%</span>",
                ],
              },
            },
            {
              name: "Paladin Stone",
              version: 1,
              image: "/assets/images/Icon/LordKnightStone2.png",
              stone: [],
              position: "upper",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้ Faith </span><img src='https://irowiki.org/w/images/e/e6/Faith.png' class='h-6 w-6 mx-3'/>  <span> 2 เลเวล, MHP + 1%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Paladin Stone",
              version: 2,
              image: "/assets/images/Icon/LordKnightStone2.png",
              stone: [],
              position: "middle",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้ Spear Mastery</span> <img src='	https://irowiki.org/w/images/5/52/Spear_Mastery.png' class='h-6 w-6 mx-3'/><span> 2 เลเวล, เพิ่มพลังโจมตีทางกายภาพระยะใกล้ 1%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Paladin Stone",
              version: 3,
              image: "/assets/images/Icon/LordKnightStone2.png",
              stone: [],
              position: "lower",
              description: {
                default: [
                  "<span>เพิ่มดาเมจของ Holy Cross </span><img src='https://irowiki.org/w/images/b/bb/Holy_Cross.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 20%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
          ],
        },
        {
          name: "Paladin Stone II",
          version: 1,
          image: "/assets/images/ClassesJob/Paladin.webp",
          position: "",
          description: null,
          stone: [
            {
              name: "Paladin Stone II",
              version: 0,
              image: "/assets/images/Icon/PaladinGarmentStone.png",
              stone: [],
              position: "garment",
              description: {
                default: [
                  "<span>เพิ่มดาเมจของ Grand Cross </span><img src='	https://irowiki.org/w/images/9/92/Grand_Cross.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 15%</span>",
                ],
                upper: [
                  "<span>ทุก ๆ การเรียนรู้สกิล Auto Guard </span><img src='	https://irowiki.org/w/images/9/92/Grand_Cross.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 15%</span>",
                ],
                middle: ["เพิ่ม Damage ทางเวทมนตร์ธาตุ Holy 5%"],
                lower: [
                  "<span>เพิ่มดาเมจของ Grand Cross </span><img src='	https://irowiki.org/w/images/9/92/Grand_Cross.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 15%</span>",
                ],
              },
            },
            {
              name: "Paladin Stone II",
              version: 1,
              image: "/assets/images/Icon/LordKnightStone2.png",
              stone: [],
              position: "upper",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้ Faith </span><img src='https://irowiki.org/w/images/e/e6/Faith.png' class='h-6 w-6 mx-3'/>  <span> 1 เลเวล ลดระยะเวลาร่ายแบบแปรผัน 1% (VCT)</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Paladin Stone II",
              version: 2,
              image: "/assets/images/Icon/LordKnightStone2.png",
              stone: [],
              position: "middle",
              description: {
                default: [
                  "<span>เพิ่มดาเมจของ Grand Cross </span><img src='	https://irowiki.org/w/images/9/92/Grand_Cross.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 20%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Paladin Stone II",
              version: 3,
              image: "/assets/images/Icon/LordKnightStone2.png",
              stone: [],
              position: "lower",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้สกิล Grand Cross </span><img src='	https://irowiki.org/w/images/9/92/Grand_Cross.png' class='h-6 w-6 mx-3'/> <span>1 เลเวล เพิ่ม Damage ทางเวทมนตร์ธาตุ Holy 1%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
          ],
        },
      ],
    },
    //Assasin Cross
    {
      name: "Assasin Cross",
      class: "AssasinCross",
      image: "/assets/images/ClassesJob/AssasinCross.webp",
      Stone: [
        {
          name: "Assasin Cross Stone I",
          version: 1,
          image: "/assets/images/ClassesJob/AssasinCross.webp",
          position: "",
          description: null,
          stone: [
            {
              name: "Assasin Cross Stone I",
              version: 0,
              image: "/assets/images/Icon/AssasinGarmentStone.png",
              stone: [],
              position: "garment",
              description: {
                default: [
                  "<span>เพิ่มดาเมจของ Meteor Assault </span><img src='https://irowiki.org/w/images/6/6b/Meteor_Assault.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 20%</span>",
                ],
                upper: [
                  "มีโอกาส 2% ที่จะได้รับ SP เพิ่มขึ้น 1% เมื่อทำการโจมตีทางกายภาพ",
                ],
                middle: ["เพิ่ม HIT + 100"],
                lower: [
                  "<span>เพิ่มดาเมจของ Meteor Assault </span><img src='https://irowiki.org/w/images/6/6b/Meteor_Assault.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 15%</span>",
                ],
              },
            },
            {
              name: "Assasin Cross Stone I",
              version: 1,
              image: "/assets/images/Icon/ThiefStone.png",
              stone: [],
              position: "upper",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้ Katar Mastery </span><img src='https://irowiki.org/w/images/9/9a/Katar_Mastery.png' class='h-6 w-6 mx-3'/>  <span> 1 เลเวล, ATK + 2</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Assasin Cross Stone I",
              version: 2,
              image: "/assets/images/Icon/ThiefStone.png",
              stone: [],
              position: "middle",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้ Lefthand Mastery</span><img src='https://irowiki.org/w/images/4/44/Lefthand_Mastery.png' class='h-6 w-6 mx-3'/> <span>1 เลเวล, HIT + 2</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Assasin Cross Stone I",
              version: 3,
              image: "/assets/images/Icon/ThiefStone.png",
              stone: [],
              position: "lower",
              description: {
                default: [
                  "<span>เพิ่มดาเมจของ Meteor Assault </span><img src='https://irowiki.org/w/images/6/6b/Meteor_Assault.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 20%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
          ],
        },
        {
          name: "Assasin Cross Stone II",
          version: 1,
          image: "/assets/images/ClassesJob/AssasinCross.webp",
          position: "",
          description: null,
          stone: [
            {
              name: "Assasin Cross Stone II",
              version: 0,
              image: "/assets/images/Icon/AssasinGarmentStone.png",
              stone: [],
              position: "garment",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้ Katar Mastery </span><img src='https://irowiki.org/w/images/6/6b/Meteor_Assault.png' class='h-6 w-6 mx-3'/> <span> ถึงเลเวล 10 สามารถใช้สกิล Double Attack Lv. 3 </span>",
                  "<span>(ใช้สกิล Double Attack กับอาวุธทุกประเภท)</span>",
                  "<span>เมื่อเรียนรู้สกิล Double Attack สูงกว่า Lv. 3 จะใช้ตามเลเวลที่เรียนรู้</span>",
                ],
                upper: ["ATK + 5%, Critical Damage +15%"],
                middle: [
                  "<span>เพิ่มดาเมจของ Sonic Blow </span><img src='https://irowiki.org/w/images/7/78/Sonic_Blow.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 20%</span>",
                ],
                lower: ["ลด Delay หลังใช้สกิล 5%"],
              },
            },
            {
              name: "Assasin Cross Stone II",
              version: 1,
              image: "/assets/images/Icon/ThiefStone.png",
              stone: [],
              position: "upper",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้สกิล Soul Destroyer </span><img src='https://irowiki.org/w/images/8/80/Soul_Destroyer.png' class='h-6 w-6 mx-3'/>  <span> 1 เลเวล ลด Delay หลังใช้สกิล 1%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Assasin Cross Stone II",
              version: 2,
              image: "/assets/images/Icon/ThiefStone.png",
              stone: [],
              position: "middle",
              description: {
                default: [
                  "<span>เพิ่มดาเมจของ Sonic Blow </span><img src='https://irowiki.org/w/images/7/78/Sonic_Blow.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 20%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Assasin Cross Stone II",
              version: 3,
              image: "/assets/images/Icon/ThiefStone.png",
              stone: [],
              position: "lower",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้สกิล Advanced Katar Mastery </span><img src='https://irowiki.org/w/images/2/24/Advanced_Katar_Mastery.png' class='h-6 w-6 mx-3'/> <span>1 เลเวล เพิ่ม Damage ทางกายภาพต่อศัตรูทุกขนาด 2%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
          ],
        },
      ],
    },
    
    //Stalker
    {
      name: "Stalker",
      class: "Stalker",
      image: "/assets/images/ClassesJob/Stalker.webp",
      Stone: [
        {
          name: "Stalker Stone I",
          version: 1,
          image: "/assets/images/ClassesJob/AssasinCross.webp",
          position: "",
          description: null,
          stone: [
            {
              name: "Assasin Cross Stone I",
              version: 0,
              image: "/assets/images/Icon/AssasinGarmentStone.png",
              stone: [],
              position: "garment",
              description: {
                default: [
                  "<span>เพิ่มดาเมจของ Meteor Assault </span><img src='https://irowiki.org/w/images/6/6b/Meteor_Assault.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 20%</span>",
                ],
                upper: [
                  "มีโอกาส 2% ที่จะได้รับ SP เพิ่มขึ้น 1% เมื่อทำการโจมตีทางกายภาพ",
                ],
                middle: ["เพิ่ม HIT + 100"],
                lower: [
                  "<span>เพิ่มดาเมจของ Meteor Assault </span><img src='https://irowiki.org/w/images/6/6b/Meteor_Assault.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 15%</span>",
                ],
              },
            },
            {
              name: "Assasin Cross Stone I",
              version: 1,
              image: "/assets/images/Icon/ThiefStone.png",
              stone: [],
              position: "upper",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้ Katar Mastery </span><img src='https://irowiki.org/w/images/9/9a/Katar_Mastery.png' class='h-6 w-6 mx-3'/>  <span> 1 เลเวล, ATK + 2</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Assasin Cross Stone I",
              version: 2,
              image: "/assets/images/Icon/ThiefStone.png",
              stone: [],
              position: "middle",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้ Lefthand Mastery</span><img src='https://irowiki.org/w/images/4/44/Lefthand_Mastery.png' class='h-6 w-6 mx-3'/> <span>1 เลเวล, HIT + 2</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Assasin Cross Stone I",
              version: 3,
              image: "/assets/images/Icon/ThiefStone.png",
              stone: [],
              position: "lower",
              description: {
                default: [
                  "<span>เพิ่มดาเมจของ Meteor Assault </span><img src='https://irowiki.org/w/images/6/6b/Meteor_Assault.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 20%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
          ],
        },
        {
          name: "Stalker Stone II",
          version: 1,
          image: "/assets/images/ClassesJob/AssasinCross.webp",
          position: "",
          description: null,
          stone: [
            {
              name: "Assasin Cross Stone II",
              version: 0,
              image: "/assets/images/Icon/AssasinGarmentStone.png",
              stone: [],
              position: "garment",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้ Katar Mastery </span><img src='https://irowiki.org/w/images/6/6b/Meteor_Assault.png' class='h-6 w-6 mx-3'/> <span> ถึงเลเวล 10 สามารถใช้สกิล Double Attack Lv. 3 </span>",
                  "<span>(ใช้สกิล Double Attack กับอาวุธทุกประเภท)</span>",
                  "<span>เมื่อเรียนรู้สกิล Double Attack สูงกว่า Lv. 3 จะใช้ตามเลเวลที่เรียนรู้</span>",
                ],
                upper: ["ATK + 5%, Critical Damage +15%"],
                middle: [
                  "<span>เพิ่มดาเมจของ Sonic Blow </span><img src='https://irowiki.org/w/images/7/78/Sonic_Blow.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 20%</span>",
                ],
                lower: ["ลด Delay หลังใช้สกิล 5%"],
              },
            },
            {
              name: "Assasin Cross Stone II",
              version: 1,
              image: "/assets/images/Icon/ThiefStone.png",
              stone: [],
              position: "upper",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้สกิล Soul Destroyer </span><img src='https://irowiki.org/w/images/8/80/Soul_Destroyer.png' class='h-6 w-6 mx-3'/>  <span> 1 เลเวล ลด Delay หลังใช้สกิล 1%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Assasin Cross Stone II",
              version: 2,
              image: "/assets/images/Icon/ThiefStone.png",
              stone: [],
              position: "middle",
              description: {
                default: [
                  "<span>เพิ่มดาเมจของ Sonic Blow </span><img src='https://irowiki.org/w/images/7/78/Sonic_Blow.png' class='h-6 w-6 mx-3'/> <span>ขึ้น 20%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Assasin Cross Stone II",
              version: 3,
              image: "/assets/images/Icon/ThiefStone.png",
              stone: [],
              position: "lower",
              description: {
                default: [
                  "<span>ทุก ๆ การเรียนรู้สกิล Advanced Katar Mastery </span><img src='https://irowiki.org/w/images/2/24/Advanced_Katar_Mastery.png' class='h-6 w-6 mx-3'/> <span>1 เลเวล เพิ่ม Damage ทางกายภาพต่อศัตรูทุกขนาด 2%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
          ],
        },
      ],
    },
    //Oboro
    {
      name: "Ninja",
      class: "Ninja",
      image: "/assets/images/ClassesJob/LordKnight.webp",
      Stone: [
        {
          name: "Oboro Stone",
          version: 1,
          image: "/assets/images/ClassesJob/Oboro.webp",
          position: "",
          description: null,
          stone: [
            {
              name: "Oboro Stone",
              version: 0,
              image: "/assets/images/Icon/OboroStoneGarment.png",
              stone: [],
              position: "garment",
              description: {
                default: [
                  "<span>เพิ่ม Damage สกิล </span><img src='https://irowiki.org/w/images/3/3e/Flaming_Petals.png' class='h-6 w-6 mx-3'/><span> Flaming Petals 20%</span>",
                ],
                upper: [
                  "<span>เพิ่ม Damage สกิล </span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/3/3f/Exploding_Dragon.png' class='h-6 w-6 mx-3'/><span> [Exploding Dragon] , </span></span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/3/3f/Snow_Flake_Draft.png' class='h-6 w-6 mx-3'/> <span> [Snow Flake Draft] , </span></span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/1/1c/First_Wind.png' class='h-6 w-6 mx-3'/>  <span> [First Wind] </span></span>",
                  "<span>เพิ่มขึ้น 30%</span>",
                ],
                middle: [
                  "<span>เพิ่ม Damage สกิล </span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/d/d0/Freezing_Spear.png' class='h-6 w-6 mx-3'/><span> [Freezing Spear] , </span></span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/c/c4/Wind_Blade.png' class='h-6 w-6 mx-3'/> <span> [Wind Blade] , </span></span>",
                  "<span>เพิ่มขึ้น 20%</span>",
                ],
                lower: ["ลดระยะเวลาร่ายแบบแปรผัน 15%"],
              },
            },
            {
              name: "Ninja Stone",
              version: 1,
              image: "/assets/images/Icon/OboroStoneGarment.png",
              stone: [],
              position: "upper",
              description: {
                default: [
                  "<div class='flex justify-center'>ทุก ๆ การเรียนรู้สกิล <img src='https://irowiki.org/w/images/b/b2/Ninja_Mastery.png' class='h-6 w-6 mx-3'/>  Ninja Mastery 1 เลเวล ATK +2, MATK +2 </div>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Ninja Stone",
              version: 2,
              image: "/assets/images/Icon/OboroStoneGarment.png",
              stone: [],
              position: "middle",
              description: {
                default: [
                  "<div class='flex justify-center'>เพิ่ม Damage สกิล <img src='https://irowiki.org/w/images/d/d8/Throw_Huuma_Shuriken.png' class='h-6 w-6 mx-3'/>  Throw Huuma Shuriken 20%</div>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
            {
              name: "Ninja Stone",
              version: 3,
              image: "/assets/images/Icon/OboroStoneGarment.png",
              stone: [],
              position: "lower",
              description: {
                default: [
                  "<span>เพิ่ม Damage สกิล </span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/3/3f/Exploding_Dragon.png' class='h-6 w-6 mx-3'/><span> [Exploding Dragon] , </span></span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/3/3f/Snow_Flake_Draft.png' class='h-6 w-6 mx-3'/> <span> [Snow Flake Draft] , </span></span>",
                  "<span class='underline font-bold w-full flex flex-wrap items-center gap-1 whitespace-normal'><img src='https://irowiki.org/w/images/1/1c/First_Wind.png' class='h-6 w-6 mx-3'/>  <span> [First Wind] </span></span>",
                  "<span>เพิ่มขึ้น 20%</span>",
                ],
                upper: [],
                middle: [],
                lower: [],
              },
            },
          ],
        },
      ],
    },
  ];

  //   [
  //     {
  //       name: "Lord Knight Stone",
  //       job: "Lord Knight",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Swordman",
  //       image: "/assets/images/ClassesJob/LordKnight.webp",
  //     },
  //     {
  //       name: "Paladin Stone",
  //       job: "Paladin",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Mage",
  //       image: "/assets/images/ClassesJob/Paladin.webp",
  //     },
  //     {
  //       id: 3,
  //       name: "High Wizard Stone",
  //       job: "High Wizard",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/HighWizard.webp",
  //     },
  //     {
  //       name: "Professor Stone",
  //       job: "Professor",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/Professor.webp",
  //     },
  //     {
  //       name: "Mastersmith Stone",
  //       job: "Mastersmith",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/.webp",
  //     },
  //     {
  //       name: "Biochemist Stone",
  //       job: "Biochemist",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/.webp",
  //     },
  //     {
  //       name: "High Priest Stone",
  //       job: "High Priest",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/.webp",
  //     },
  //     {
  //       name: "Champion Stone",
  //       job: "Champion",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/.webp",
  //     },
  //     {
  //       name: "Assassin Cross Stone",
  //       job: "Assassin Cross",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/.webp",
  //     },
  //     {
  //       name: "Stalker Stone",
  //       job: "Stalker",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/.webp",
  //     },
  //     {
  //       name: "Sniper Stone",
  //       job: "Sniper",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/Sniper.webp",
  //     },
  //     {
  //       name: "Clown Stone",
  //       job: "Clown",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/Clown.webp",
  //     },
  //     {
  //       name: "Gypsy Stone",
  //       job: "Gypsy",
  //       description: "ใช้เปลี่ยนอาชีพเป็น Archer",
  //       image: "/assets/images/ClassesJob/Gypsy.webp",
  //     },
  //   ];
  const jobOptions = [
    {
      value: "all",
      label: "All",
      image: "/assets/images/Icon/stoneIcon.png", // ใส่ไอคอนรวม หรือ placeholder
    },
    ...jobStones.flatMap((f) =>
      f.Stone.map((s) => ({
        value: s.name,
        label: s.name,
        image: s.image,
      })),
    ),
  ];

  const [filterClasses, setFilterClasses] = useState("all");

  const filteredClasses = useMemo(() => {
    if (filterClasses === "all") {
      // ดึง Stone ทุกก้อน ทุกอาชีพ
      return jobStones
        .flatMap((job) => job.Stone)
        .sort((a, b) => a.version - b.version);
    }

    // filter ตามชื่อ Stone
    return jobStones
      .flatMap((job) =>
        job.Stone.filter((stone) => stone.name === filterClasses),
      )
      .sort((a, b) => a.version - b.version);
  }, [filterClasses, jobStones]);
  console.log(filterClasses);
  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        🪨 หินอาชีพ (Job Stones)
      </h1>

      <div className="flex justify-center mb-6">
        <JobSelect
          options={jobOptions}
          value={filterClasses}
          onChange={setFilterClasses}
        />
      </div>

      <div className="grid grid-cols-1  gap-4">
        {filteredClasses.map((stone) => (
          <JobStoneCard key={stone.name} {...stone} />
        ))}
      </div>
    </main>
  );
}

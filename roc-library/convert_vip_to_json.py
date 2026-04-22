#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VIP Database Converter
แปลงข้อมูล Tab-Separated เป็น JSON Format
"""

import json
import re

# ข้อมูล input (paste ข้อมูลที่นี่)
data_raw = """VIP-1200	วัชรพล จันทร์เรืองรอง	Tak Kung	https://www.facebook.com/sick.kz?mibextid=ZbWKwL	
VIP-1201	รังสิรัตน์ เปรมฤดีสนิท	Rangsirat Premrudesanit	https://www.facebook.com/AuziieValentine	
VIP-1202	จิรัฎฐ์ แพทย์วงค์	Gu Pu	https://www.facebook.com/gu.pu.980?mibextid=ZbWKwL	
VIP-1203	เก้ากันท์ญา สุรารักษ์วงษ์วีระ	Ball Mostly Cloudy	https://www.facebook.com/9THseptember/	
VIP-1204	อรรถวิท อันเรืองปัญญา	Attawit Unruangpunya	https://www.facebook.com/AttawitGolfNaJa/	
VIP-1205	ธิติสรรค์ แก้วซาว	Tk Jame	https://www.facebook.com/DevilJameZ	0823176863
VIP-1206	วิทเคน สุกคง	Witaken Sookkong	https://www.facebook.com/khunkenshura	
VIP-1207	เบญจรงค์ ปัญญารักษา	Banjarong Panyaraksa 	https://www.facebook.com/Immaterielle17th?mibextid=LQQJ4d	
VIP-1208	สหรัฐ ศรีฟอง	Saharat Srifong	https://www.facebook.com/bellmoos.hanny?mibextid=LQQJ4d	0922822162
VIP-1209	สมชัย ปริงทอง	Buzz Buzz	https://www.facebook.com/profile.php?id=100071500599871&mibextid=ZbWKwL	
VIP-1210	ธีรพงค์ บัวละภา	Boss Teerapong	https://www.facebook.com/teera.tb	0945512755
VIP-1211	พงศกร พระไตรยะ	Pongsakorn Pratraiya 	https://www.facebook.com/pongsakron.pratiya/?locale=th_TH	
VIP-1212		ยังไม่พร้อมค้า-ขาย ระวังโจรแอบอ้าง		
VIP-1213	ยุทธนา จันทร์อยู่	Yuttana Chanyu	https://www.facebook.com/not.yuttanna	
VIP-1214	สุเทพ พันธ์สวัสดิ์	สุเทพ พันธ์สวัสดิ์	https://www.facebook.com/profile.php?id=100009074326740	
VIP-1215	นิรุช  พรามจร	Nirut Pramjorn	https://www.facebook.com/emstorm3309	
VIP-1216	อัครินทร์  แสงสว่าง	Aukrin Saengsawang	https://www.facebook.com/thawatchai.saengsawang.5?mibextid=LQQJ4d	
VIP-1217	ณัฐพงศ์ พิพัฒน์ธนทรัพย์	Nattapong Pipattanasub	https://www.facebook.com/Nicky.Pipattanasub?locale=th_TH	
VIP-1218	คเณศ จันทร์สำราญ	คเณศ จันทร์สำราญ	https://www.facebook.com/kanet41590/	
VIP-1219	ภคพล พลีขัน	Phakapol Pleekhan	https://www.facebook.com/ChocolateDevilArmi?mibextid=ZbWKwL	
VIP-1220	สุระชาตรี ปล้องสูงเนิน	Surachatee P. Bank	https://www.facebook.com/banky.phimai	089-055-6656"""

def parse_vip_data(raw_data):
    """
    แปลงข้อมูล tab-separated เป็น list of dictionaries
    """
    vip_list = []
    lines = raw_data.strip().split('\n')
    
    for line in lines:
        if not line.strip():
            continue
            
        # Split by tab
        parts = line.split('\t')
        
        # Clean up the parts
        code = parts[0].strip() if len(parts) > 0 else ""
        name = parts[1].strip() if len(parts) > 1 else ""
        facebook_name = parts[2].strip() if len(parts) > 2 else ""
        facebook_link = parts[3].strip() if len(parts) > 3 else ""
        phone = parts[4].strip() if len(parts) > 4 else ""
        
        # Remove quotes and extra whitespace
        name = re.sub(r'^["\s]+|["\s]+$', '', name)
        facebook_name = re.sub(r'^["\s]+|["\s]+$', '', facebook_name)
        facebook_link = re.sub(r'^["\s]+|["\s]+$', '', facebook_link)
        phone = re.sub(r'^["\s]+|["\s]+$', '', phone)
        
        vip_entry = {
            "code": code,
            "name": name,
            "facebookName": facebook_name,
            "facebookLink": facebook_link,
            "phone": phone
        }
        
        vip_list.append(vip_entry)
    
    return vip_list

def generate_json(vip_list):
    """
    สร้าง JSON string จาก VIP list
    """
    return json.dumps(vip_list, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    # Parse data
    vip_data = parse_vip_data(data_raw)
    
    # Generate JSON
    json_output = generate_json(vip_data)
    
    # Print to console
    print(json_output)
    
    # Save to file
    with open('vip_output.json', 'w', encoding='utf-8') as f:
        f.write(json_output)
    
    print(f"\n✓ บันทึกแล้ว {len(vip_data)} รายการ ลงในไฟล์ vip_output.json")

import os
import cv2
import numpy as np
from pathlib import Path

DIR_C2 = Path(r"dataset_pipeline\public_reference_images\class_2_upeneus_sulphureus")

for img_path in sorted(DIR_C2.glob("*.jpg")):
    img = cv2.imread(str(img_path))
    h, w, _ = img.shape
    c0 = np.mean(img[5:25, 5:25], axis=(0,1))
    c1 = np.mean(img[5:25, w-25:w-5], axis=(0,1))
    c2 = np.mean(img[h-25:h-5, 5:25], axis=(0,1))
    c3 = np.mean(img[h-25:h-5, w-25:w-5], axis=(0,1))
    avg_bg_rgb = (round((c0[2]+c1[2]+c2[2]+c3[2])/4, 1), round((c0[1]+c1[1]+c2[1]+c3[1])/4, 1), round((c0[0]+c1[0]+c2[0]+c3[0])/4, 1))
    
    # Check center area (specimen)
    center = img[int(h*0.3):int(h*0.7), int(w*0.3):int(w*0.7)]
    m_fish = np.mean(center, axis=(0,1))
    fish_rgb = (round(m_fish[2], 1), round(m_fish[1], 1), round(m_fish[0], 1))
    
    print(f"File: {img_path.name}")
    print(f"  Background RGB (corners avg): {avg_bg_rgb}")
    print(f"  Center Fish RGB: {fish_rgb}")

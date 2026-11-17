import os
import cv2
import numpy as np
from pathlib import Path
from PIL import Image

DIR_C2 = Path(r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI\dataset_pipeline\public_reference_images\class_2_upeneus_sulphureus")

for img_path in sorted(DIR_C2.glob("*.jpg")):
    img = cv2.imread(str(img_path))
    h, w, c = img.shape
    # Calculate average color
    mean_bgr = cv2.mean(img)[:3]
    mean_rgb = (round(mean_bgr[2], 1), round(mean_bgr[1], 1), round(mean_bgr[0], 1))
    
    # Check brightness and contrast
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    mean_lum = round(np.mean(gray), 1)
    std_lum = round(np.std(gray), 1)
    
    print(f"File: {img_path.name}")
    print(f"  Dimensions: {w}x{h} ({w/h:.2f}:1)")
    print(f"  Mean RGB: {mean_rgb} | Lum: {mean_lum} (std {std_lum})")

import cv2
import numpy as np

img = cv2.imread(r"dataset_pipeline\public_reference_images\class_2_upeneus_sulphureus\FG-C2-012_upeneus_sulphureus.jpg")
h, w, _ = img.shape
# Check corners / border colors
corners = [
    img[10:50, 10:50],
    img[10:50, w-50:w-10],
    img[h-50:h-10, 10:50],
    img[h-50:h-10, w-50:w-10]
]
for i, c in enumerate(corners):
    m = np.mean(c, axis=(0,1))
    print(f"Corner {i} BGR: {m}")

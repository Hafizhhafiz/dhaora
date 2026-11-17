from PIL import Image
import numpy as np

img_path = 'dataset_pipeline/public_reference_images/class_1_selaroides_leptolepis/FG-C1-019_1_selaroides_leptolepis.jpg'
with Image.open(img_path) as img:
    w, h = img.size
    arr = np.array(img)
    # calculate average color
    mean_r = np.mean(arr[:, :, 0])
    mean_g = np.mean(arr[:, :, 1])
    mean_b = np.mean(arr[:, :, 2])
    print(f"FG-C1-019 dimensions: {w}x{h}")
    print(f"Mean RGB: R={mean_r:.1f}, G={mean_g:.1f}, B={mean_b:.1f}")
    # Underwater images typically have high B and G, low R, especially in background

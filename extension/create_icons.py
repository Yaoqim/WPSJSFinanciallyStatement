from PIL import Image, ImageDraw

# 创建三种大小的图标
sizes = {
    'icons/icon-16.png': 16,
    'icons/icon-48.png': 48,
    'icons/icon-128.png': 128
}

for filepath, size in sizes.items():
    # 创建图像（蓝色背景）
    img = Image.new('RGB', (size, size), color=(102, 126, 234))
    draw = ImageDraw.Draw(img)
    
    # 在图像上绘制边框作为占位
    if size >= 48:
        draw.rectangle([2, 2, size-2, size-2], outline=(255, 255, 255), width=2)
    
    img.save(filepath)
    print(f"已创建 {filepath}")

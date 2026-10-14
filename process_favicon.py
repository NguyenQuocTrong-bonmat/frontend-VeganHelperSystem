from PIL import Image, ImageChops

def trim(im):
    bg = Image.new(im.mode, im.size, im.getpixel((0,0)))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)
    return im

def make_square(im, min_size=64, fill_color=(255, 255, 255, 0)):
    x, y = im.size
    size = max(min_size, x, y)
    
    # Optional: add 10% padding
    pad = int(size * 0.1)
    size += pad * 2
    
    new_im = Image.new('RGBA', (size, size), fill_color)
    new_im.paste(im, (int((size - x) / 2), int((size - y) / 2)))
    return new_im

try:
    img = Image.open(r"C:\Users\ADMIN\.gemini\antigravity-ide\brain\ece3b7f2-31b4-4a87-9f1b-263774e9b0e2\.user_uploaded\media_1791271817121.png")
    img = img.convert("RGBA")
    
    # Find bounding box of non-transparent / non-white pixels
    # Wait, the background is off-white (#FAFAFA)
    # Let's just use the transparent cropping if it's transparent, or trim using top-left pixel.
    trimmed = trim(img)
    
    squared = make_square(trimmed)
    
    favicon = squared.resize((64, 64), Image.Resampling.LANCZOS)
    favicon.save(r"d:\HocTap\Project\VeganHelperFE\project\frontend-VeganHelperSystem-new\public\favicon.png", "PNG")
    
    # Save a copy as favicon.ico just in case
    squared.resize((32, 32), Image.Resampling.LANCZOS).save(r"d:\HocTap\Project\VeganHelperFE\project\frontend-VeganHelperSystem-new\public\favicon.ico", format="ICO", sizes=[(32, 32)])
    print("Success")
except Exception as e:
    print(f"Error: {e}")

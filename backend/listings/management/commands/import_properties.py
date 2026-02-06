import os
import re
import shutil
import json
from django.core.management.base import BaseCommand
from listings.models import Area, Property, PropertyImage, PropertyVideo
from django.conf import settings

class Command(BaseCommand):
    help = "Import properties and media from src/data/properties.ts"

    def handle(self, *args, **options):
        base_dir = settings.BASE_DIR.parent  # one level above backend/
        data_file = base_dir / "src" / "data" / "properties.ts"
        img_dir = base_dir / "src" / "assets" / "images"
        vid_dir = base_dir / "src" / "assets" / "videos"

        if not data_file.exists():
            self.stdout.write(self.style.ERROR(f"File not found: {data_file}"))
            return

        # Extract JSON-like array from properties.ts
        text = data_file.read_text(encoding="utf-8")
        match = re.search(r"properties\s*=\s*(\[.*\])", text, re.S)
        if not match:
            self.stdout.write(self.style.ERROR("Could not find properties array in file."))
            return

        json_like = match.group(1)
        # convert TS object-like to JSON
        json_like = re.sub(r"([,{\[])\s*(\w+)\s*:", r'\1"\2":', json_like)  # quote keys
        json_like = json_like.replace("'", '"')
        try:
            data = json.loads(json_like)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error parsing JSON: {e}"))
            return

        os.makedirs(settings.MEDIA_ROOT / "property_images", exist_ok=True)
        os.makedirs(settings.MEDIA_ROOT / "property_videos", exist_ok=True)

        created_count = 0
        for item in data:
            area_name = item.get("area", "Unknown")
            area_obj, _ = Area.objects.get_or_create(name=area_name)

            prop = Property.objects.create(
                name=item.get("name", "Unnamed"),
                area=area_obj,
                address=item.get("address", ""),
                price=item.get("price", 0),
                rooms=item.get("rooms", 0),
                bathrooms=item.get("bathrooms", 0),
                size=item.get("size", 0),
                floor=item.get("floor", 0),
                furnished=item.get("furnished", False),
                type=item.get("type", ""),
                description=item.get("description", ""),
                contact=item.get("contact", ""),
                featured=item.get("featured", False),
            )
            created_count += 1

            # handle images
            images = item.get("images", [])
            for idx, img in enumerate(images):
                src_path = img_dir / os.path.basename(img)
                if src_path.exists():
                    dest_path = settings.MEDIA_ROOT / "property_images" / src_path.name
                    shutil.copy(src_path, dest_path)
                    PropertyImage.objects.create(property=prop, image=f"property_images/{src_path.name}", order=idx)

            # handle video (optional random or placeholder)
            video_field = item.get("video") or item.get("videoUrl") or item.get("videos")
            if video_field:
                vids = video_field if isinstance(video_field, list) else [video_field]
                for vidx, vid in enumerate(vids):
                    src_path = vid_dir / os.path.basename(vid)
                    if src_path.exists():
                        dest_path = settings.MEDIA_ROOT / "property_videos" / src_path.name
                        shutil.copy(src_path, dest_path)
                        PropertyVideo.objects.create(property=prop, video=f"property_videos/{src_path.name}", order=vidx)

        self.stdout.write(self.style.SUCCESS(f"Imported {created_count} properties successfully!"))

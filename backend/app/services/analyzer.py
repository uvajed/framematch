from PIL import Image
import numpy as np
from io import BytesIO
from colorthief import ColorThief
import colorsys


class ImageAnalyzer:
    def analyze(self, image_bytes: BytesIO) -> dict:
        image = Image.open(image_bytes)
        image_bytes.seek(0)

        camera_analysis = self._analyze_camera(image)
        lighting_analysis = self._analyze_lighting(image)
        color_analysis = self._analyze_color(image_bytes, image)

        summary = self._generate_summary(camera_analysis, lighting_analysis, color_analysis)

        return {
            "camera": camera_analysis,
            "lighting": lighting_analysis,
            "color": color_analysis,
            "summary": summary,
            "recreationGuide": self._generate_recreation_guide(
                camera_analysis, lighting_analysis, color_analysis
            ),
        }

    def _analyze_camera(self, image: Image.Image) -> dict:
        width, height = image.size
        aspect_ratio = width / height

        img_array = np.array(image.convert("L"))

        # Estimate focal length based on perspective distortion analysis
        focal_estimate, sensor_hint = self._estimate_focal_length(img_array, width, height)
        edges = np.abs(np.diff(img_array.astype(float), axis=0))
        edge_variance = np.var(edges)

        if edge_variance > 2000:
            aperture = "f/5.6 - f/8 (Deep DoF)"
            dof = "Deep"
        elif edge_variance > 1000:
            aperture = "f/2.8 - f/4"
            dof = "Medium"
        else:
            aperture = "f/1.4 - f/2.0 (Shallow DoF)"
            dof = "Shallow"

        brightness = np.mean(img_array)
        if brightness > 150:
            iso = "Low (100-400)"
        elif brightness > 80:
            iso = "Medium (400-1600)"
        else:
            iso = "Higher (1600+)"

        motion_blur = self._detect_motion_blur(img_array)
        if motion_blur > 0.7:
            shutter = "Slow (1/30s or slower)"
        elif motion_blur > 0.4:
            shutter = "~1/60s - 1/125s"
        else:
            shutter = "Fast (1/250s+)"

        return {
            "focalLength": focal_estimate,
            "aperture": aperture,
            "depthOfField": dof,
            "iso": iso,
            "shutterSpeed": shutter,
            "sensorSize": sensor_hint,
            "aspectRatio": f"{width}:{height}",
        }

    def _detect_motion_blur(self, gray_image: np.ndarray) -> float:
        laplacian = np.abs(
            gray_image[:-2, 1:-1].astype(float)
            + gray_image[2:, 1:-1].astype(float)
            + gray_image[1:-1, :-2].astype(float)
            + gray_image[1:-1, 2:].astype(float)
            - 4 * gray_image[1:-1, 1:-1].astype(float)
        )
        sharpness = np.var(laplacian)
        blur_score = 1.0 - min(sharpness / 500, 1.0)
        return blur_score

    def _estimate_focal_length(self, gray_image: np.ndarray, width: int, height: int) -> tuple:
        """
        Estimate focal length based on perspective distortion analysis.
        Wide angle lenses show more edge distortion and perspective exaggeration.
        """
        h, w = gray_image.shape

        # 1. Analyze edge vs center sharpness (wide angles have softer corners)
        center_region = gray_image[h//3:2*h//3, w//3:2*w//3]
        corner_tl = gray_image[:h//4, :w//4]
        corner_tr = gray_image[:h//4, 3*w//4:]
        corner_bl = gray_image[3*h//4:, :w//4]
        corner_br = gray_image[3*h//4:, 3*w//4:]

        def get_sharpness(region):
            if region.size < 100:
                return 0
            gx = np.diff(region.astype(float), axis=1)
            gy = np.diff(region.astype(float), axis=0)
            return float(np.mean(np.abs(gx)) + np.mean(np.abs(gy)))

        center_sharp = get_sharpness(center_region)
        corner_sharp = np.mean([
            get_sharpness(corner_tl),
            get_sharpness(corner_tr),
            get_sharpness(corner_bl),
            get_sharpness(corner_br)
        ])

        # Edge falloff ratio - wide angles have more falloff
        if center_sharp > 0:
            edge_falloff = corner_sharp / center_sharp
        else:
            edge_falloff = 1.0

        # 2. Analyze gradient direction variance (wide angles have more radial distortion)
        gx = np.diff(gray_image.astype(float), axis=1)
        gy = np.diff(gray_image.astype(float), axis=0)

        # Sample points from edges
        edge_gradient_variance = 0
        samples = []
        for i in range(0, h, h//10):
            for j in range(0, min(w-1, gx.shape[1]), w//10):
                if i < gy.shape[0] and j < gx.shape[1]:
                    samples.append(np.sqrt(gx[i,j]**2 + gy[min(i,gy.shape[0]-1),j]**2))

        if samples:
            edge_gradient_variance = float(np.var(samples))

        # 3. Analyze brightness falloff from center to edges (vignetting, more on wide angles)
        center_brightness = float(np.mean(center_region))
        corner_brightness = float(np.mean([
            np.mean(corner_tl), np.mean(corner_tr),
            np.mean(corner_bl), np.mean(corner_br)
        ]))

        if center_brightness > 0:
            vignette_ratio = corner_brightness / center_brightness
        else:
            vignette_ratio = 1.0

        # 4. Calculate focal length score
        # Lower edge_falloff = more corner softness = wider lens
        # Lower vignette_ratio = more vignetting = wider lens
        # Higher edge_gradient_variance = more distortion = wider lens

        wide_score = 0

        # Edge sharpness falloff (wide lenses have softer corners)
        # This is the most reliable indicator
        if edge_falloff < 0.6:
            wide_score += 5
        elif edge_falloff < 0.7:
            wide_score += 4
        elif edge_falloff < 0.8:
            wide_score += 3
        elif edge_falloff < 0.9:
            wide_score += 2
        elif edge_falloff < 1.0:
            wide_score += 1

        # Vignetting (wide lenses have more vignetting)
        # Note: image content can affect this, so weight it less
        if vignette_ratio < 0.7:
            wide_score += 2
        elif vignette_ratio < 0.85:
            wide_score += 1

        # Gradient variance (perspective distortion)
        if edge_gradient_variance > 800:
            wide_score += 2
        elif edge_gradient_variance > 300:
            wide_score += 1

        # Map score to focal length estimate
        if wide_score >= 6:
            focal_estimate = "~14-24mm (ultra-wide)"
            sensor_hint = "Ultra-wide angle lens"
        elif wide_score >= 4:
            focal_estimate = "~24-35mm (wide)"
            sensor_hint = "Wide angle lens"
        elif wide_score >= 3:
            focal_estimate = "~35mm"
            sensor_hint = "Wide-normal lens"
        elif wide_score >= 2:
            focal_estimate = "~50mm"
            sensor_hint = "Standard lens"
        elif wide_score >= 1:
            focal_estimate = "~50-85mm"
            sensor_hint = "Standard to short tele"
        else:
            focal_estimate = "~85mm+"
            sensor_hint = "Portrait/Telephoto lens"

        return focal_estimate, sensor_hint

    def _analyze_lighting(self, image: Image.Image) -> dict:
        img_array = np.array(image.convert("L"))
        h, w = img_array.shape

        left_half = img_array[:, : w // 2]
        right_half = img_array[:, w // 2 :]
        left_brightness = np.mean(left_half)
        right_brightness = np.mean(right_half)

        if right_brightness > left_brightness * 1.1:
            key_side = "right"
            key_angle = "45°"
        elif left_brightness > right_brightness * 1.1:
            key_side = "left"
            key_angle = "45°"
        else:
            key_side = "frontal"
            key_angle = "0° (frontal)"

        top_half = img_array[: h // 2, :]
        bottom_half = img_array[h // 2 :, :]
        top_brightness = np.mean(top_half)
        bottom_brightness = np.mean(bottom_half)

        if top_brightness > bottom_brightness * 1.2:
            vertical_angle = "30° up"
        elif bottom_brightness > top_brightness * 1.1:
            vertical_angle = "below eye level"
        else:
            vertical_angle = "eye level"

        contrast = np.std(img_array)
        if contrast > 70:
            quality = "Hard"
            ratio = "4:1 or higher"
        elif contrast > 45:
            quality = "Medium"
            ratio = "3:1"
        else:
            quality = "Soft"
            ratio = "2:1"

        bright_threshold = np.percentile(img_array, 95)
        bright_regions = img_array > bright_threshold
        num_bright_clusters = self._count_clusters(bright_regions)
        sources = str(min(max(num_bright_clusters, 1), 4))

        pattern = self._detect_lighting_pattern(img_array)

        rgb_array = np.array(image.convert("RGB"))
        avg_r = np.mean(rgb_array[:, :, 0])
        avg_b = np.mean(rgb_array[:, :, 2])

        if avg_r > avg_b * 1.15:
            temperature = "Warm (3200K - 4500K)"
        elif avg_b > avg_r * 1.1:
            temperature = "Cool (5600K - 7000K)"
        else:
            temperature = "Neutral (5000K - 5600K)"

        return {
            "keyLightAngle": key_angle,
            "keyLightSide": key_side,
            "verticalAngle": vertical_angle,
            "quality": quality,
            "ratio": ratio,
            "sources": sources,
            "pattern": pattern,
            "temperature": temperature,
            "fillLight": bool(contrast < 60),
            "backLight": bool(top_brightness > np.mean(img_array) * 1.1),
        }

    def _count_clusters(self, binary_image: np.ndarray) -> int:
        """Simple cluster counting without scipy dependency."""
        bright_pixels = np.sum(binary_image)
        total_pixels = binary_image.size
        bright_ratio = bright_pixels / total_pixels

        if bright_ratio > 0.15:
            return 3
        elif bright_ratio > 0.08:
            return 2
        else:
            return 1

    def _detect_lighting_pattern(self, gray_image: np.ndarray) -> str:
        h, w = gray_image.shape
        center_region = gray_image[h // 3 : 2 * h // 3, w // 3 : 2 * w // 3]
        left_region = gray_image[h // 3 : 2 * h // 3, : w // 3]
        right_region = gray_image[h // 3 : 2 * h // 3, 2 * w // 3 :]

        center_mean = np.mean(center_region)
        left_mean = np.mean(left_region)
        right_mean = np.mean(right_region)

        diff = abs(left_mean - right_mean)

        if diff > 40:
            return "Split"
        elif diff > 20:
            return "Rembrandt"
        elif center_mean > (left_mean + right_mean) / 2 * 1.1:
            return "Butterfly"
        else:
            return "Loop"

    def _analyze_color(self, image_bytes: BytesIO, image: Image.Image) -> dict:
        try:
            color_thief = ColorThief(image_bytes)
            palette = color_thief.get_palette(color_count=6, quality=1)
            palette_hex = ["#" + "".join(f"{c:02x}" for c in color) for color in palette]
        except Exception:
            palette_hex = ["#1a2634", "#3d4f5f", "#d4a574", "#f5e6d3", "#8b5a2b"]

        rgb_array = np.array(image.convert("RGB"))
        avg_color = np.mean(rgb_array, axis=(0, 1))

        r, g, b = avg_color / 255.0
        h, l, s = colorsys.rgb_to_hls(r, g, b)

        if h < 0.1 or h > 0.9:
            temp = "Warm (orange/red tones)"
        elif 0.1 <= h < 0.2:
            temp = "Warm (yellow tones)"
        elif 0.5 <= h < 0.7:
            temp = "Cool (blue/teal tones)"
        else:
            temp = "Neutral"

        shadows = rgb_array[rgb_array.mean(axis=2) < 85]
        highlights = rgb_array[rgb_array.mean(axis=2) > 170]

        if len(shadows) > 0:
            shadow_avg = np.mean(shadows, axis=0)
            if shadow_avg[2] > shadow_avg[0]:
                shadow_tint = "Teal/Blue tint"
            elif shadow_avg[0] > shadow_avg[2]:
                shadow_tint = "Warm/Brown tint"
            else:
                shadow_tint = "Neutral"
        else:
            shadow_tint = "Neutral"

        if len(highlights) > 0:
            highlight_avg = np.mean(highlights, axis=0)
            if highlight_avg[0] > highlight_avg[2]:
                highlight_tint = "Warm highlights"
            elif highlight_avg[2] > highlight_avg[0]:
                highlight_tint = "Cool highlights"
            else:
                highlight_tint = "Neutral"
        else:
            highlight_tint = "Neutral"

        gray = np.array(image.convert("L"))
        contrast = np.std(gray)
        if contrast > 65:
            contrast_level = "High"
        elif contrast > 40:
            contrast_level = "Medium"
        else:
            contrast_level = "Low"

        if s > 0.5:
            saturation = "Saturated"
        elif s > 0.25:
            saturation = "Normal"
        else:
            saturation = "Desaturated"

        return {
            "palette": palette_hex,
            "temperature": temp,
            "contrast": contrast_level,
            "saturation": saturation,
            "shadows": f"Lifted, {shadow_tint}",
            "highlights": highlight_tint,
        }

    def _generate_summary(self, camera: dict, lighting: dict, color: dict) -> str:
        return (
            f"This appears to be a {camera['depthOfField'].lower()} depth of field shot, "
            f"likely captured with a {camera['focalLength']} lens at {camera['aperture']}. "
            f"The lighting is {lighting['quality'].lower()} with the key light positioned at "
            f"{lighting['keyLightAngle']} from camera {lighting['keyLightSide']}. "
            f"The color grade features {color['temperature'].lower()} tones with {color['contrast'].lower()} contrast."
        )

    def _generate_recreation_guide(
        self, camera: dict, lighting: dict, color: dict
    ) -> list:
        return [
            f"Use a {camera['focalLength']} lens at {camera['aperture']} for similar depth of field",
            f"Position your key light at {lighting['keyLightAngle']} from camera {lighting['keyLightSide']}, {lighting['verticalAngle']}",
            f"Use a {lighting['quality'].lower()} light source (softbox for soft, bare bulb for hard)",
            f"Aim for a {lighting['ratio']} lighting ratio between key and fill",
            f"In post, apply a {color['temperature'].lower()} grade with {color['contrast'].lower()} contrast",
            f"Push shadows toward {color['shadows'].split(', ')[-1].lower()} for the cinematic look",
        ]

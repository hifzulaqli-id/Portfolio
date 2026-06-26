# Quick Guide: Integrating ImageInput to Admin Forms

For each form with image URL fields, follow this pattern:

## 1. Import ImageInput

```tsx
import { ImageInput } from "@/components/admin/image-input";
```

## 2. Replace Input with ImageInput

**Before:**
```tsx
<div className="space-y-2">
  <Label>Field Name URL</Label>
  <Input placeholder="/images/..." {...register("field_url")} />
</div>
```

**After:**
```tsx
<ImageInput
  label="Field Name"
  value={watch("field_url")}
  onChange={(val) => setValue("field_url", val, { shouldDirty: true })}
  aspectRatio="video" // or "square" or "portrait"
/>
```

## 3. Aspect Ratios by Field Type

- **square**: Logos, avatars, profile photos (issuer_logo, logo_url, photo_url)
- **video**: Thumbnails, OG images (thumbnail_url, og_image_url)
- **portrait**: Certificates (certificate_image_url)

## 4. Forms to Update

### ✅ Done:
- [x] project-form.tsx (thumbnail_url, gallery_urls)
- [x] profile-editor.tsx (photo_url)

### 🔄 Remaining:

**certification-manager.tsx:**
```tsx
<ImageInput
  label="Logo Penerbit"
  value={watch("issuer_logo_url") || ""}
  onChange={(val) => setValue("issuer_logo_url", val, { shouldDirty: true })}
  aspectRatio="square"
/>

<ImageInput
  label="Gambar Sertifikat"
  value={watch("certificate_image_url") || ""}
  onChange={(val) => setValue("certificate_image_url", val, { shouldDirty: true })}
  aspectRatio="portrait"
/>
```

**blog-manager.tsx:**
```tsx
<ImageInput
  label="Thumbnail"
  value={watch("thumbnail_url") || ""}
  onChange={(val) => setValue("thumbnail_url", val, { shouldDirty: true })}
  aspectRatio="video"
/>
```

**experience-manager.tsx:**
```tsx
<ImageInput
  label="Logo Perusahaan/Organisasi"
  value={watch("logo_url") || ""}
  onChange={(val) => setValue("logo_url", val, { shouldDirty: true })}
  aspectRatio="square"
/>
```

**education-manager.tsx:**
```tsx
<ImageInput
  label="Logo Institusi"
  value={watch("logo_url") || ""}
  onChange={(val) => setValue("logo_url", val, { shouldDirty: true })}
  aspectRatio="square"
/>
```

**app/admin/(panel)/settings/page.tsx:**
```tsx
<ImageInput
  label="OG Image (Social Share)"
  value={watch("og_image_url") || ""}
  onChange={(val) => setValue("og_image_url", val, { shouldDirty: true })}
  aspectRatio="video"
/>
```

**app/admin/(panel)/skills/page.tsx** (if has form):
- For icon field: Either ImageInput OR icon picker (see Workstream C)
```tsx
<ImageInput
  label="Custom Icon"
  value={watch("icon_url") || ""}
  onChange={(val) => setValue("icon_url", val, { shouldDirty: true })}
  aspectRatio="square"
/>
```

## 5. Testing Checklist

For each updated form:
1. Open form in admin panel
2. Try uploading an image (should compress and show preview)
3. Try pasting a URL (should work via URL mode toggle)
4. Save and verify image displays on public pages
5. Check store.json has base64 data (starts with `data:image/`)

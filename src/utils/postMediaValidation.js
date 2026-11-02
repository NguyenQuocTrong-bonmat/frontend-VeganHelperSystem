const MAX_MEDIA_FILES = 10;
const MAX_POST_UPLOAD_BYTES = 200 * 1024 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

export function validatePostMediaSelection(files, retainedMediaCount = 0) {
  if (retainedMediaCount + files.length > MAX_MEDIA_FILES) {
    return `A post can contain at most ${MAX_MEDIA_FILES} media files.`;
  }

  let totalBytes = 0;
  for (const file of files) {
    if (file.size <= 0) return 'Media files must not be empty.';
    if (file.type.startsWith('image/') && file.size > MAX_IMAGE_BYTES) {
      return 'Each image must be no larger than 5 MB.';
    }
    if (file.type.startsWith('video/') && file.size > MAX_VIDEO_BYTES) {
      return 'Each video must be no larger than 200 MB.';
    }

    totalBytes += file.size;
    if (totalBytes > MAX_POST_UPLOAD_BYTES) {
      return 'Media files in one upload must total no more than 200 MB.';
    }
  }

  return '';
}

import { faker } from '@faker-js/faker';
import { PhotoUploader } from 'src/domain/services/photo-uploader';

interface PhotoUpload {
  fileName: string;
  url: string;
}

export class FakePhotoUploader extends PhotoUploader {
  public uploads: PhotoUpload[] = [];
  async upload({ fileName }): Promise<string> {
    const url = faker.image.url();
    this.uploads.push({
      fileName,
      url,
    });

    return url;
  }
}

export interface PhotoUploaderRequest {
    fileType: string
    fileName: string
    body: Buffer
}

export abstract class PhotoUploader {
    abstract upload(props: PhotoUploaderRequest): Promise<string>
}
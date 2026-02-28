import { google } from 'googleapis';
import { config } from '@/lib/config';

class GoogleDriveService {
  private drive: ReturnType<typeof google.drive> | null = null;

  private getDrive() {
    if (!this.drive) {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: config.google.serviceAccountEmail,
          private_key: config.google.privateKey?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });
      this.drive = google.drive({ version: 'v3', auth });
    }
    return this.drive;
  }

  async uploadReceipt(
    base64Data: string,
    mimeType: string,
    fileName: string
  ): Promise<string> {
    const drive = this.getDrive();

    // Remove data URI prefix if present
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    const fileMetadata: Record<string, unknown> = {
      name: fileName,
      parents: config.google.driveFolderId ? [config.google.driveFolderId] : [],
    };

    const media = {
      mimeType,
      body: require('stream').Readable.from(buffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id',
    });

    if (!response.data.id) {
      throw new Error('Failed to upload file to Google Drive');
    }

    // Make the file readable by anyone with the link
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return response.data.id;
  }

  async getFileUrl(fileId: string): Promise<string> {
    return `https://drive.google.com/uc?id=${fileId}`;
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      const drive = this.getDrive();
      await drive.files.delete({ fileId });
    } catch (error) {
      console.error('Failed to delete file from Drive:', error);
    }
  }
}

export const googleDriveService = new GoogleDriveService();

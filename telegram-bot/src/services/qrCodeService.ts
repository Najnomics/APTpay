import QRCode from 'qrcode';

export class QRCodeService {
  static async generateQR(text: string): Promise<Buffer> {
    try {
      const qrCodeBuffer = await QRCode.toBuffer(text, {
        type: 'png',
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return qrCodeBuffer;
    } catch (error) {
      console.error('QR Code generation failed:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  static async generateQRDataURL(text: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(text, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return qrCodeDataURL;
    } catch (error) {
      console.error('QR Code generation failed:', error);
      throw new Error('Failed to generate QR code');
    }
  }
}
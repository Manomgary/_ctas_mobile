import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { LocalFile } from '../interfaces/interfaces-local';

import * as _moment from 'moment';
const moment = _moment;

@Injectable({
  providedIn: 'root'
})
export class CaptureImageService {
  private image: LocalFile;
  
  constructor(private plt: Platform) {}

  async getImage() {
    const image = await Camera.getPhoto({
      quality: 40,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      saveToGallery: false
    });

    if (image) {
      const base64 = await this.readAsBase64(image);
      console.log("base64 file::::", base64);
      const fileName = new Date().getTime() + 'jpeg';
      this.image = {
        name: fileName,
        date: moment().format("YYYY-MM-DD"),
        data: `data:image/jpeg;base64,${base64}`
      };
    }
    return await this.image;
  }

  // convert to base 64
  async readAsBase64(image: Photo) {
    console.log("***** convert to base64 Mode *****", image);
    if (this.plt.is('hybrid')) {
      console.log("-------------HYBRIDE TESTE--------------");
      const file = await Filesystem.readFile({
          path: image.path
      });

      return file.data;
    } else {
        // Fetch the photo, read as a blob, then convert to base64 format
        console.log("------------web Path---------");
        const response = await fetch(image.webPath);
        const blob = await response.blob();

        return await this.convertBlobToBase64(blob) as string;
    }
  }
  
  // Helper function
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

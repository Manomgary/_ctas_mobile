import { Injectable } from '@angular/core';
//import
import * as XLSX from 'xlsx';
import { File } from '@ionic-native/file/ngx';
import { Loc_export_excel } from '../interfaces/interfaces-local';

import * as _moment from 'moment';
const moment = _moment;

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor(private file: File) {}

  onExport(data_: Loc_export_excel[]) {
    /**var ws_mep_sv_pa = XLSX.utils.json_to_sheet(this.mep_export_pa);
    var ws_sv_pa = XLSX.utils.json_to_sheet(this.sv_export_pa);*/
    const wb_sv_pa = XLSX.utils.book_new();

    data_.forEach((item, inde) => {
      let ws = XLSX.utils.json_to_sheet(item.data);
      XLSX.utils.book_append_sheet(wb_sv_pa, ws, item.name_feuille);
      if ((data_.length - 1) === inde) {
        var buffer = XLSX.write(
          wb_sv_pa,
          {
            bookType: 'xlsx',
            type: 'array'
          }
        );
        let save_data = {
          buffer: buffer,
          file_name: item.name_file
        }
        this.saveToPhone(save_data);
      }
    });
    
    /**XLSX.utils.book_append_sheet(wb_sv_pa, ws_mep_sv_pa, "MEP Plants d'arbre");
    XLSX.utils.book_append_sheet(wb_sv_pa, ws_sv_pa, "SV Plants d'arbre");*/

    /**var buffer_pa = XLSX.write(
      wb_sv_pa,
      {
        bookType: 'xlsx',
        type: 'array'
      }
    );
    this.saveToPhone(buffer_pa);*/
  }
   saveToPhone(data_) {
    var fileType= 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    var fileExtension = ".xlsx";
    var fileName = data_.file_name + '_'  + moment().format('YYYYMMDD_HHmmss');
    var data:Blob = new Blob([data_.buffer], {type: fileType});
    this.file.writeFile(this.file.externalRootDirectory, fileName+fileExtension,data,{replace: true})
          .then(() => {
            alert("Export Réussie");
          });
  }

}

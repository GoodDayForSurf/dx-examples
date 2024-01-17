import { Component } from '@angular/core';
import { DxiItemModule } from "devextreme-angular/ui/nested";
import { CommonModule } from "@angular/common";
import {
  DxFileUploaderModule,
  DxTreeViewModule,
} from "devextreme-angular";
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import {
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";
// @ts-ignore
import devextremeAjax from 'devextreme/core/utils/ajax';
import { sendRequestFactory } from './ng-http-client-helper';

const url = 'https://js.devexpress.com/Demos/WidgetsGallery/odata/HierarchicalItems';

@Component({
  selector: 'demo-app',
  providers: [],
  template: `
    <dx-file-uploader
      #fileUploader
      uploadUrl="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
      [multiple]="false"
      accept="*"
      [(value)]="value"
      uploadMode="instantly"
    ></dx-file-uploader>
    <dx-tree-view
      [dataSource]="dataSource"
      [expandAllEnabled]="true"
      [expandNodesRecursive]="true"
      dataStructure="plain"
      keyExpr="Id"
      displayExpr="Name"
      parentIdExpr="CategoryId"
      hasItemsExpr="IsGroup"
      [virtualModeEnabled]="true"
    ></dx-tree-view>`,
  styleUrls: [],
  standalone: true,
  imports: [DxiItemModule, CommonModule, DxTreeViewModule, HttpClientModule, DxFileUploaderModule],
  preserveWhitespaces: true,
})
export class AppComponent {
  dataSource = new DataSource({
    store: new ODataStore({
      version: 2,
      url: url,
    }),
  });

  value: any[] = [];

  constructor(http: HttpClient) {
    devextremeAjax.inject({ sendRequest: sendRequestFactory(http) });
    /*http.get(url).subscribe((result) => {
      console.log('---HTT_GET--DONE ----->', result);
    });*/
  }

}

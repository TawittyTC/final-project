import { Component ,OnInit,AfterViewInit,ElementRef,ViewChild,} from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit{
  canvas: any ;
  constructor(){

  }


  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas',{
      isDrawingMode:true
    })
}

}

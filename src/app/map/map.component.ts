import { Component ,OnInit} from '@angular/core';
import { fabric } from 'fabric';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faReply,
  faShare,
  faClone,
  faTrash,
  faUndo,
  faRedo,
  faObjectGroup,
  faObjectUngroup,
  faPlus,
  faMinus
} from '@fortawesome/free-solid-svg-icons';

import { FURNISHINGS } from 'src/app/models/furnishings';
import { AppService } from 'src/app/app.service';
import { ChairsLayoutComponent } from 'src/app/chairs-layout/chairs-layout.component';
library.add(faReply, faShare, faClone, faTrash, faUndo, faRedo, faObjectGroup, faObjectUngroup, faMinus, faPlus);

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

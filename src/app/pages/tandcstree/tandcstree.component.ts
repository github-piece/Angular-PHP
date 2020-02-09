import { Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { of as observableOf } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';

/** File node data with possible child nodes. */


/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */

@Component({
  selector: 'app-tandcstree',
  templateUrl: './tandcstree.component.html',
  styleUrls: ['./tandcstree.component.scss']
})
export class TandcstreeComponent {

  panelOpenState = false;

}

import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-extended-tables-page',
  templateUrl: './extended-tables.component.html',
  styleUrls: [ './styles/_extended-tables.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class ExtendedTablesPageComponent {
  displayedColumns: string[] = ['picture', 'name', 'status', 'progress', 'comments', 'policy'];
  dataSource = undefined;

  constructor(private route: ActivatedRoute) {
    this.dataSource = route.snapshot.data['tableData'].data;
  }
}

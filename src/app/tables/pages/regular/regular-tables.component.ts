import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-regular-tables-page',
  templateUrl: './regular-tables.component.html',
  styleUrls: [ './styles/_regular-tables.scss' ]
})

export class RegularTablesPageComponent {

  displayedColumns: string[] = ['id', 'name', 'country', 'city', 'birthday', 'age', 'salary'];
  dataSource = undefined;

  constructor(private route: ActivatedRoute) {
    this.dataSource = route.snapshot.data['tableData'].data;
  }
}

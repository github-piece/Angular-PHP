import {Component, OnInit, ViewChild} from '@angular/core';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {BusinessServiceService} from '../../_services/business/business-service.service';
import {MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';

@Component({
    selector: 'app-maindashboard',
    templateUrl: './maindashboard.component.html',
    styleUrls: ['./maindashboard.component.scss']
})

export class MaindashboardComponent implements OnInit {

    // TreeMap options
    type1 = 'TreeMap';
    businessList = [['treeMap', null, 0, 0]];
    options1 = {
        minColor: '#f44336',
        midColor: '#ffc107',
        maxColor: '#00c853',
        headerHeight: 0,
        showScale: false
    };
    // BarCharts options
    type2 = 'Histogram';
    tenureList = [];
    goalList = [];
    options2 = {
        legend: 'none',
        colors: ['#607d8b']
    };

    lat: any;
    lng: any;
    address = '';
    showActions = false;
    zoom = 2;

    u_id: any;
    businessData = [];
    userData: any = [];

    tableData = [];
    dataSource: any;
    tasks: any[];
    pageSize = 5;
    currentPage = 0;
    totalSize = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private authenticationService: AuthenticationService,
        private businessService: BusinessServiceService,
    ) { }
    ngOnInit() {
        if (this.authenticationService.currentUser == null) {
            this.showActions = false;
        } else {
            this.showActions = true;
            this.userData = this.authenticationService.currentUserSubject.value;
            this.getBusinessList(this.userData.u_id);
        }
    }
    viewMap() {
        console.log('address', this.address);
        this.businessService.getGeometry(this.address)
            .pipe(first())
            .subscribe(
                 data => {
                    this.lat = 37.0551565;
                    this.lng = -95.6726939;
                },
                error => {
                });
    }
    getBusinessList(userId) {
        this.businessService.getBusinessList(userId)
            .pipe(first())
            .subscribe(
                data => {
                    this.businessData = data;
                    let businessArray = [];
                    for (let i = 0; i < this.businessData.length; i++) {
                        const businessValue = this.businessData[i].business.split(',');
                        businessArray = businessArray.concat(businessValue);
                    }
                    const businessArrayName = businessArray.filter((v, i, a) => a.indexOf(v) === i);
                    for (let j = 0; j < businessArrayName.length; j++) {
                        this.businessList[j + 1] = [businessArrayName[j], 'treeMap', 0, businessArrayName.length - j - 1];
                        for (let i = 0; i < businessArray.length; i++) {
                            if (businessArrayName[j] === businessArray[i]) {
                                this.businessList[j + 1][2] = Number(this.businessList[j + 1][2]) + 1;
                            }
                        }
                    }
                    let tenureArray = [];
                    let goalArray = [];
                    for (let j = 0; j < this.businessData.length; j++) {
                        tenureArray = tenureArray.concat(this.businessData[j].tenure);
                        const goalValue = this.businessData[j].goal.split(',');
                        goalArray = goalArray.concat(goalValue);
                        this.tableData[j] = {
                            'no': this.businessData[j].no, 'name': this.businessData[j].name, 'location': this.businessData[j].country, 'address': this.businessData[j].address
                        };
                    }
                    const tenureName = tenureArray.filter((v, i, a) => a.indexOf(v) === i);
                    for (let j = 0; j < tenureName.length; j++) {
                        if (tenureName[j] !== '') {
                            this.tenureList[j] = [tenureName[j], 0];
                            for (let i = 0; i < this.businessData.length; i++) {
                                if (tenureName[j] === this.businessData[i].tenure) {
                                    this.tenureList[j][1] = Number(this.tenureList[j][1]) + 1;
                                }
                            }
                        }
                    }
                    const goalArrayName = goalArray.filter((v, i, a) => a.indexOf(v) === i);
                    for (let j = 0; j < goalArrayName.length; j++) {
                        this.goalList[j] = [goalArrayName[j], 0];
                        for (let i = 0; i < goalArray.length; i++) {
                            if (goalArrayName[j] === goalArray[i]) {
                                this.goalList[j][1] = Number(this.goalList[j][1]) + 1;
                            }
                        }
                    }
                    this.getTasks();
                },
                error => {
                    console.log('error', error);
                });
    }
    getTasks() {
        const data = this.tableData;
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
        this.tasks = data;
        this.totalSize = this.tasks.length;
        this.iterator();
    }

    handlePage(event?: PageEvent) {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.iterator();
    }

    private iterator() {
        const end = (this.currentPage + 1) * this.pageSize;
        const start = this.currentPage * this.pageSize;
        const part = this.tasks.slice(start, end);
        this.dataSource = part;
    }
}

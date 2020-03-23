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
    public charts: Array<{
        title: string;
        type: string;
        data: Array<Array<string | number | {}>>;
        roles?: Array<{ type: string; role: string; index?: number }>;
        columnNames?: Array<string>;
        options?: {};
        length: number;
    }> = [];

    businessList = [['treeMap', null, 0, 0]];
    tenureList = [];
    goalList = [];

    lat: any;
    lng: any;
    address = '';
    showActions = false;
    zoom = 2;

    u_id: any;
    businessData = [];
    userData: any = [];
    mapData = [];

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
            this.userData = this.authenticationService.currentUserSubject.value;
            this.getBusinessList(this.userData.u_id);
        }
    }
    onAddress(businessId) {
        this.mapData = [];
        for (let i = 0; i < this.businessData.length; i++) {
            if (this.businessData[i].id === businessId) {
                this.mapData[0] = this.businessData[i];
            }
        }
    }
    getAddress() {
        for (let i = 0; i < this.businessData.length; i++) {
            this.businessService.getGeometry(this.businessData[i].address)
                .pipe(first())
                .subscribe(
                    data => {
                        this.businessData[i].lat = data.lat;
                        this.businessData[i].lng = data.lng;
                    });
        }
        this.mapData = this.businessData;
    }
    onAddressAll() {
        this.mapData = this.businessData;
    }
    getBusinessList(userId) {
        this.businessService.getBusinessList(userId)
            .pipe(first())
            .subscribe(
                data => {
                    this.showActions = true;
                    this.businessData = data;
                    this.getAddress();
                    let businessArray = [];
                    for (let i = 0; i < this.businessData.length; i++) {
                        if (this.businessData[i].pic.substr(0, 4) !== 'http') {
                            this.businessData[i].pic = 'mse/' + this.businessData[i].pic;
                        }
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
                    this.charts.push({
                        title: 'Businesses listed by Industry',
                        type: 'TreeMap',
                        data: this.businessList,
                        options: {
                                    minColor: '#f44336',
                                    midColor: '#ffc107',
                                    maxColor: '#00c853',
                                    headerHeight: 0,
                                    showScale: false
                        },
                        length: 3
                    });
                    let goalArray = []; let tenureArray = [];
                    for (let j = 0; j < this.businessData.length; j++) {
                        const goalValue = this.businessData[j].goal.split(',');
                        goalArray = goalArray.concat(goalValue);
                        tenureArray = tenureArray.concat(this.businessData[j].tenure);
                        this.tableData[j] = {
                            'no': this.businessData[j].no, 'name': this.businessData[j].name, 'location': this.businessData[j].country, 'address': this.businessData[j].address
                        };
                    }
                    const tenureArrayName = tenureArray.filter((v, i, a) => a.indexOf(v) === i);
                    for (let j = 0; j < tenureArrayName.length; j++) {
                        this.tenureList[j] = [tenureArrayName[j], 0];
                        for (let i = 0; i < this.businessData.length; i++) {
                            if (tenureArrayName[j] === this.businessData[i].tenure) {
                                this.tenureList[j][1] += parseFloat(this.businessData[i].tenure);
                            }
                        }
                    }
                    this.charts.push({
                        title: 'Tenure Lists',
                        type: 'PieChart',
                        columnNames: ['Business', 'Years'],
                        data: this.tenureList,
                        length: 1
                    });
                    const goalArrayName = goalArray.filter((v, i, a) => a.indexOf(v) === i);
                    for (let j = 0; j < goalArrayName.length; j++) {
                        this.goalList[j] = [goalArrayName[j], 0, this.getRandomColor(), goalArrayName[j]];
                        for (let i = 0; i < goalArray.length; i++) {
                            if (goalArrayName[j] === goalArray[i]) {
                                this.goalList[j][1] = Number(this.goalList[j][1]) + 1;
                            }
                        }
                    }
                    this.charts.push({
                        title: 'Business Goals',
                        type: 'PieChart',
                        columnNames: ['Business', 'Times'],
                        roles: [
                            { role: 'style', type: 'string', index: 2},
                            { role: 'tooltip', type: 'string', index: 3}
                        ],
                        data: this.goalList,
                        options: {
                            slices: {
                                1: {offset: 0.2},
                                3: {offset: 0.3},
                                5: {offset: 0.4},
                                7: {offset: 0.3},
                                9: {offset: 0.1},
                                11: {offset: 0.3},
                                13: {offset: 0.4},
                                15: {offset: 0.3},
                                17: {offset: 0.2},
                            }
                        },
                        length: 2
                    });
                    this.getTasks();
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
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}

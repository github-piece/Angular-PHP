import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {BusinessServiceService} from '../../_services/business/business-service.service';
import {first} from 'rxjs/operators';
import {BuysellService} from '../../_services/buysell/buysell.service';
import {GoogleChartComponent} from 'angular-google-charts';

@Component({
    selector: 'app-portfoliodashboard',
    templateUrl: './portfoliodashboard.component.html',
    styleUrls: ['./portfoliodashboard.component.scss']
})
export class PortfoliodashboardComponent implements OnInit {
    public charts: Array<{
        title: string;
        type: string;
        data: Array<Array<string | number | {}>>;
        roles?: Array<{ type: string; role: string; index?: number }>;
        columnNames?: Array<string>;
        options?: {};
    }> = [];

    businessList = [['treeMap', null, 0, 0]];
    tenureList = [];
    goalList = [];

    address = '';
    showActions = false;
    zoom = 2;

    userData: any = [];
    businessData = [];

    tableData = [];
    dataSource: any;
    contractBuySource: any;
    contractSellSource: any;
    tasks: any[];
    details: any[];
    sell: any[];
    pageSize = 5;
    currentPage = 0;
    totalSize = 0;
    detailsSize = 0;
    sellSize = 0;
    myBusiness = [];
    buyBusiness = [];
    allBusiness = [];
    historyBuyList: any = [];
    historySellList: any = [];
    historyList: any = [];
    businessIds = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private authenticationService: AuthenticationService,
        private businessService: BusinessServiceService,
        private buysellService: BuysellService,

    ) {}
    ngOnInit() {
        if (this.authenticationService.currentUserSubject.value == null) {
            this.showActions = false;
        } else {
            this.userData = this.authenticationService.currentUserSubject.value;
            this.getBusinessList(this.userData.u_id);
            this.getSellHistory();
            this.getBuyHistory();
            this.showActions = true;
        }
    }
    getBusinessList(userId) {
        this.businessService.getBusinessList(userId)
            .pipe(first())
            .subscribe(
                data => {
                    this.businessData = data;
                });
    }
    getSellHistory() {
        this.buysellService.getSellHistory(this.userData.u_id)
            .pipe(first())
            .subscribe(
                data => {
                    this.historySellList = data;
                    for (let i = 0; i < this.historySellList.length; i++) {
                        const date = new Date(this.historySellList[i].date_created);
                        this.historySellList[i].nextDate = new Date(date.setFullYear(date.getFullYear() + 1)).toString();
                    }
                }
            );
    }
    getBuyHistory() {
        this.buysellService.getBuyHistory(this.userData.u_id)
            .pipe(first())
            .subscribe(
                data => {
                    this.historyBuyList = data;
                    const businessId = [];
                    for (let i = 0; i < this.historyBuyList.length; i++) {
                        const date = new Date(this.historyBuyList[i].date_created);
                        this.historyBuyList[i].nextDate = new Date(date.setFullYear(date.getFullYear() + 1)).toString();
                        for (let j = 0; j < this.allBusiness.length; j++) {
                            if (this.historyBuyList[i].business_id === this.allBusiness[j].business_id) {
                                this.historyBuyList[i].businessName = this.allBusiness[j].name;
                            }
                        }
                    }
                    this.historyList = this.historyBuyList.concat(this.historySellList);
                    for (let i = 0; i < this.historyList.length; i++) {
                        businessId[i] = this.historyList[i].business_id;
                    }
                    this.businessIds = businessId.filter((v, i, a) => a.indexOf(v) === i);
                    let count = 0; let index = 0;
                    for (let i = 0; i < this.businessData.length; i++) {
                        if (this.businessData[i].u_id === this.userData.u_id) {
                            this.myBusiness[index] = this.businessData[i];
                            index++;
                        }
                        for ( let j = 0; j < this.businessIds.length; j++) {
                            if (this.businessData[i].business_id === this.businessIds[j]) {
                                this.buyBusiness[count] = this.businessData[i];
                                count++;
                            }
                        }
                    }
                    this.businessData = [];
                    this.businessData = this.buyBusiness;
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
                        }
                    });
                    let goalArray = [];
                    for (let j = 0; j < this.businessData.length; j++) {
                        const goalValue = this.businessData[j].goal.split(',');
                        goalArray = goalArray.concat(goalValue);
                        this.tableData[j] = {
                            'no': this.businessData[j].no, 'name': this.businessData[j].name, 'location': this.businessData[j].country, 'address': this.businessData[j].address
                        };
                    }
                    for (let i = 0; i < this.businessData.length; i++) {
                        this.tenureList[i] = [
                            this.businessData[i].name, parseFloat(this.businessData[i].tenure), this.getRandomColor(), this.businessData[i].name
                        ];
                    }
                    this.charts.push({
                        title: 'Tenure Lists',
                        type: 'Histogram',
                        columnNames: ['Business', 'Years'],
                        roles: [
                            { role: 'style', type: 'string', index: 2},
                            { role: 'tooltip', type: 'string', index: 3}
                        ],
                        data: this.tenureList,
                        options: {
                            hAxis: {
                                title: 'Years'
                            },
                            vAxis: {
                                title: 'Business Name'
                            },
                            legend: 'none'
                        }
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
                        type: 'Histogram',
                        columnNames: ['Business', 'Times'],
                        roles: [
                            { role: 'style', type: 'string', index: 2},
                            { role: 'tooltip', type: 'string', index: 3}
                        ],
                        data: this.goalList,
                        options: {
                            hAxis: {
                                title: 'Count'
                            },
                            vAxis: {
                                title: 'Goal Name'
                            },
                            legend: 'none'
                        }
                    });
                    this.getTasks();
                });
    }
    getTasks() {
        const data = this.tableData;
        const buyContracts = this.historyBuyList;
        const sellContracts = this.historySellList;
        this.dataSource = new MatTableDataSource<any>(data);
        this.contractBuySource = new MatTableDataSource<any>(buyContracts);
        this.contractSellSource = new MatTableDataSource<any>(sellContracts);
        this.dataSource.paginator = this.paginator;
        this.contractBuySource.paginator = this.paginator;
        this.contractSellSource.paginator = this.paginator;
        this.tasks = data;
        this.details = buyContracts;
        this.sell = sellContracts;
        this.totalSize = this.tasks.length;
        this.detailsSize = this.details.length;
        this.sellSize = this.sell.length;
        this.iterator();
    }
    private iterator() {
        const end = (this.currentPage + 1) * this.pageSize;
        const start = this.currentPage * this.pageSize;
        const part = this.tasks.slice(start, end);
        const detailPart = this.details.slice(start, end);
        const sellPart = this.sell.slice(start, end);
        this.dataSource = part;
        this.contractBuySource = detailPart;
        this.contractSellSource = sellPart;
    }
    handlePage(event?: PageEvent) {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.iterator();
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

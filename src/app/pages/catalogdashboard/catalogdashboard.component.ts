import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {CatalogueService} from '../../_services/catalogue/catalogue.service';
import {BuysellService} from '../../_services/buysell/buysell.service';
import {ModalComponent} from '../modal/modal.component';
import {ChartType, RadialChartOptions} from 'chart.js';
import {Label} from 'ng2-charts';

interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
}

@Component({
    selector: 'app-catalogdashboard',
    templateUrl: './catalogdashboard.component.html',
    styleUrls: ['./catalogdashboard.component.scss'],
})

export class CatalogdashboardComponent {
    showActions = false;
    userData: any = [];
    businessInfo: any;
    amount = [];
    businessUser: any = [];
    explain_index: any = 0;
    explain_number: any = 0;
    mainBusiness = [];
    showBusiness = [];
    nameSearch = '';
    countrySearch = '';
    goalSearch = '';
    businessMatch = true;
    unSdg = [];
    interactions = [];
    stakeholders = [];
    stakeholdersCountry = [];
    stakeholdersButton3 = [];
    stakeholdersButton4 = [];
    stakeholdersConsideration = [];
    stakeholdersMap = [];
    stakeholdersProvince = [];
    stakeholdersDistrict = [];
    stakeholdersMunicipality = [];
    type = [];
    radarChartData: any = [{
        data: []
    }];
    radarChartOptions: RadialChartOptions = {
        responsive: true,
    };
    radarChartLabels: Label[] = [];
    radarChartType: ChartType = 'radar';
    scoring = [];
    countryList = [];
    goalList = [];
    historyList: any;
    tabList = ['Business', 'Financial', 'Sustainability', 'Scoring', 'Funding', 'Badges'];
    tabIndex = [];
    p = 1;
    tabNum = 0;
    constructor(
        private authenticationService: AuthenticationService,
        private catalogueService: CatalogueService,
        private buysellService: BuysellService,
        private dialog: MatDialog
    ) {
        if (this.authenticationService.currentUserSubject.value == null) {
            this.showActions = false;
        } else {
            this.showActions = true;
            this.userData = this.authenticationService.currentUserSubject.value;
            this.getBusinessList();
        }
    }

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
    getBusinessList() {
        this.businessInfo = [];
        this.catalogueService.getBusinessList(this.userData.u_id)
            .pipe(first())
            .subscribe(
                business_info => {
                    this.businessInfo = business_info;
                    this.mainBusiness = this.businessInfo[0]['mainBusiness'];
                    for (let i = 0; i < this.mainBusiness.length; i++) {
                        if (this.mainBusiness[i]['image for front page'].substring(0, 4) !== 'http') {
                            this.mainBusiness[i]['image for front page'] = 'mse/' + this.mainBusiness[i]['image for front page'];
                        }
                        for (let j = 0; j < this.businessInfo[2].businessUser.length; j++) {
                            if (this.mainBusiness[i].u_id === this.businessInfo[2].businessUser[j].u_id) {
                                this.mainBusiness[i].businessUser = this.businessInfo[2].businessUser[j].u_name;
                            }
                        }
                    }
                    this.getHistory();
                    this.countryList = this.businessInfo[1].countryList;
                    this.goalList = this.businessInfo[3].goalList;
                    this.buysellService.fundTypes = this.businessInfo[6].instruments;
                    this.radarChartLabels = ['resource counter', 'opportunity counter', 'venture life cycle', 'liability of age size', 'organisation', 'entrepreneur', 'environment', 'impact sector'];
                    this.mainBusiness.forEach((main_business_item, index) => {
                        this.scoring[index] = [
                            {
                                data: [
                                    main_business_item['resource counter'], main_business_item['opportunity counter'], main_business_item['venture life cycle'], main_business_item['liability of age size'], main_business_item['organisation'], main_business_item['entrepreneur'], main_business_item['environment'], main_business_item['impact sector']
                                ],
                                label: main_business_item['business name']
                            },
                            {
                                data: [
                                    main_business_item['resource counter'] / business_info[4]['business_length'], main_business_item['opportunity counter'] / business_info[4]['business_length'],
                                    main_business_item['venture life cycle'] / business_info[4]['business_length'], main_business_item['liability of age size'] / business_info[4]['business_length'],
                                    main_business_item['organisation'] / business_info[4]['business_length'], main_business_item['entrepreneur'] / business_info[4]['business_length'],
                                    main_business_item['environment'] / business_info[4]['business_length'], main_business_item['impact sector'] / business_info[4]['business_length']
                                ],
                                label: 'Average Scoring'
                            }
                        ];
                        this.radarChartData[index] = this.scoring[index] as any[];
                    });
                    this.catalogueService.getTabData(this.userData.u_id, JSON.stringify(this.mainBusiness), 'Sustainability').
                    pipe().subscribe( data => {this.setTabData(2, data); });
                    this.catalogueService.getTabData(this.userData.u_id, JSON.stringify(this.mainBusiness), 'Badges').
                    pipe().subscribe( data => {this.setTabData(5, data); });
                });
    }
    getHistory() {
        this.historyList = [];
        this.buysellService.getBuyHistory(this.userData.u_id)
            .pipe(first())
            .subscribe(
                data => {
                    this.historyList = data;
                    let k = 0;
                    for (let j = 0; j < this.mainBusiness.length; j++) {
                        const value = this.mainBusiness[j]['how much they\'re raising'];
                        for (let i = 0; i < this.historyList.length; i++) {
                            if (this.mainBusiness[j].business_id === this.historyList[i].business_id) {
                                const length = this.mainBusiness[j]['how much they\'re raising'].length;
                                const symbol = this.mainBusiness[j]['how much they\'re raising'].slice(length - 3, length);
                                this.mainBusiness[j]['how much they\'re raising'] = parseFloat(this.mainBusiness[j]['how much they\'re raising']) - this.historyList[i].amount;
                                this.mainBusiness[j]['how much they\'re raising'] = this.mainBusiness[j]['how much they\'re raising'] + symbol;
                            }
                        }
                        const remain = this.mainBusiness[j]['how much they\'re raising'].slice(0, this.mainBusiness[j]['how much they\'re raising'].length - 3);
                        if (remain !== '0') {
                            this.showBusiness[k] = this.mainBusiness[j];
                            this.amount[k] = value;
                            k++;
                        }
                    }
                    this.mainBusiness = [];
                    this.mainBusiness = this.showBusiness;
                });
    }
    buy(business_id, business) {
        this.buysellService.business_id = business_id;
        this.buysellService.business_remain = business['how much they\'re raising'];
        this.buysellService.modal_content = 'Are you going to buy this item?';
        this.buysellService.action = 'buy';
        this.buysellService.business_name = business['business name'];
        this.buysellService.commission = this.businessInfo[5]['commission'][0];
        this.buysellService.business_id = business['business_id'];
        this.openDialog();
    }
    sell(business_id) {
        this.buysellService.business_id = business_id;
        this.buysellService.modal_content = 'ARE you sure want to sell more?';
        this.buysellService.action = 'sell';
        this.openDialog();
    }
    openDialog(): void {
        const dialogRef = this.dialog.open(ModalComponent, {
            width: '600px',
            data: {fundTypes: this.type}
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getBusinessList();
        });
    }
    explain_content(i, j) {
        this.explain_index = i;
        this.explain_number = j;
    }
    businessSearch(businessName, countryName, goalName) {
        this.nameSearch = businessName;
        this.countrySearch = countryName;
        this.goalSearch = goalName;
        const searchBusiness = [];
        let j = 0;
        for (let i = 0; i < this.mainBusiness.length; i++) {
            if (this.nameSearch === '' || this.mainBusiness[i]['business name'] === this.nameSearch) {
                if (this.countrySearch === '' || this.mainBusiness[i]['country'].includes(this.countrySearch)) {
                    if (this.goalSearch === '' || this.mainBusiness[i]['goal name'].includes(this.countrySearch)) {
                        searchBusiness[j] = this.mainBusiness[i];
                        j++;
                    }
                }
            }
        }
        if ( j === 0) {
            this.businessMatch = false;
        }
        this.showBusiness = searchBusiness;
    }
    showAllBusiness() {
        this.nameSearch = '';
        this.countrySearch = '';
        this.goalSearch = '';
        this.showBusiness = this.mainBusiness;
        this.businessMatch = true;
    }
    round(string) {
        if (isNaN(string) || string === '') {
            return 'No available data';
        }
        return parseFloat(string).toFixed(2);
    }
    setTabData(index: number, data) {
        if (index === 2) {
            this.unSdg = data['unSdg'];
            this.interactions = data['interactions'];
            this.stakeholders = data['stakeholders'];
            this.stakeholdersCountry = this.stakeholders['country'];
            this.stakeholdersButton3 = this.stakeholders['button3'];
            this.stakeholdersButton4 = this.stakeholders['button4'];
            this.stakeholdersConsideration = this.stakeholders['consideration'];
            this.stakeholdersMap = this.stakeholders['maps'];
            this.stakeholdersProvince = this.stakeholders['province'];
            this.stakeholdersDistrict = this.stakeholders['district'];
            this.stakeholdersMunicipality = this.stakeholders['municipality'];
        } else {
            this.unSdg = data['unSdg'];
        }
    }
    groupShow(index: number) {
        this.tabNum = index;
    }
}



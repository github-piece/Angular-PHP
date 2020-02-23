import {Component} from '@angular/core';
import {first} from 'rxjs/operators';
import {BreakpointObserver} from '@angular/cdk/layout';
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
    userid: any;
    businessInfo: any;
    amount = [];
    // Business information
    businessUser: any = [];
    profile: any;
    explain_index: any = 0;
    click_flag: any = 0;
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

    constructor(private breakpointObserver: BreakpointObserver,
                private authenticationService: AuthenticationService,
                private catalogueService: CatalogueService,
                private buysellService: BuysellService,
                public dialog: MatDialog,
    ) {
        if (this.authenticationService.currentUserSubject.value == null) {
            // if user didnt login
            this.showActions = false;
        } else {
            this.showActions = true;
            this.userid = this.authenticationService.currentUserSubject.value.u_id;
            this.getBusinessList();
        }
    }

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
    // Get business answers and users information.
    getBusinessList() {
        this.businessInfo = [];
        this.catalogueService.getBusinessList(this.userid)
            .pipe(first())
            .subscribe(
                business_info => {
                    this.businessInfo = business_info;
                    this.mainBusiness = this.businessInfo['mainBusiness'];
                    for (let i = 0; i < this.mainBusiness.length; i++) {
                        for (let j = 0; j < this.businessInfo.businessUser.length; j++) {
                            if (this.mainBusiness[i].u_id === this.businessInfo.businessUser[j].u_id) {
                                this.mainBusiness[i].businessUser = this.businessInfo.businessUser[j].u_name;
                            }
                        }
                    }
                    this.getHistory();
                    this.countryList = this.businessInfo.countryList;
                    this.goalList = this.businessInfo.goalList;
                    this.buysellService.fundTypes = this.businessInfo.instruments;
                    this.unSdg = this.businessInfo['unSdg'];
                    this.interactions = this.businessInfo['interactions'];
                    this.stakeholders = this.businessInfo['stakeholders'];
                    this.stakeholdersCountry = this.stakeholders['country'];
                    this.stakeholdersButton3 = this.stakeholders['button3'];
                    this.stakeholdersButton4 = this.stakeholders['button4'];
                    this.stakeholdersConsideration = this.stakeholders['consideration'];
                    this.stakeholdersMap = this.stakeholders['maps'];
                    this.radarChartLabels = ['resource counter', 'opportunity counter', 'venture life cycle', 'liability of age size'
                        , 'organisation', 'entrepreneur', 'environment', 'impact sector'];
                    this.mainBusiness.forEach((main_business_item, index) => {
                        this.scoring[index] = [
                            { data: [main_business_item['resource counter'], main_business_item['opportunity counter'],
                                    main_business_item['venture life cycle'], main_business_item['liability of age size'],
                                    main_business_item['organisation'], main_business_item['entrepreneur'],
                                    main_business_item['environment'], main_business_item['impact sector'], ],
                                label: main_business_item['business name'] },
                            {data: [
                                main_business_item['resource counter'] / business_info['business_length'], main_business_item['opportunity counter'] / business_info['business_length'],
                                main_business_item['venture life cycle'] / business_info['business_length'], main_business_item['liability of age size'] / business_info['business_length'],
                                    // tslint:disable-next-line:max-line-length
                                main_business_item['organisation'] / business_info['business_length'], main_business_item['entrepreneur'] / business_info['business_length'],
                                    // tslint:disable-next-line:max-line-length
                                main_business_item['environment'] / business_info['business_length'], main_business_item['impact sector'] / business_info['business_length'], ],
                                label: 'Average Scoring'}
                        ];
                        this.radarChartData[index] = this.scoring[index] as any[];
                    });
                },
                error => {
                });
    }
    getHistory() {
        this.historyList = [];
        this.buysellService.getBuyHistory(this.userid)
            .pipe(first())
            .subscribe(
                data => {
                    this.historyList = data;
                    let k = 0;
                    for (let j = 0; j < this.mainBusiness.length; j++) {
                        const value = this.mainBusiness[j]['how much they\'re raising'];
                        for (let i = 0; i < this.historyList.length; i++) {
                            // console.log(this.historyList[i].business_id);
                            if (this.mainBusiness[j].business_id === this.historyList[i].business_id) {
                                const length = this.mainBusiness[j]['how much they\'re raising'].length;
                                const symbol = this.mainBusiness[j]['how much they\'re raising'].slice(length - 3, length);
                                // tslint:disable-next-line:max-line-length radix
                                this.mainBusiness[j]['how much they\'re raising'] = parseFloat(this.mainBusiness[j]['how much they\'re raising']) - this.historyList[i].amount;
                                // tslint:disable-next-line:max-line-length
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
                },
                error => {
                }
            );
    }
    buy(business_id, business) {
        this.buysellService.business_id = business_id;
        this.buysellService.business_remain = business['how much they\'re raising'];
        this.buysellService.modal_content = 'Are you going to buy this item?';
        this.buysellService.action = 'buy';
        this.buysellService.business_name = business['business name'];
        this.buysellService.commission = this.businessInfo['commission'][0];
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
            console.log(result);
            this.getBusinessList();
        });
    }
    // When click the button, display the content for corresponding index.
    explain_content(i, index) {
        this.explain_index = i;
        if (index) {
            this.click_flag = index;
        } else {
            if (index === '0') {
                this.click_flag = 0;
            } else {
                this.click_flag = undefined;
            }
        }
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
}



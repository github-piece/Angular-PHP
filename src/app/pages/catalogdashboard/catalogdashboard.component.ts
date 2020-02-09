import {Component} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {first, map} from 'rxjs/operators';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MatDialog} from '@angular/material';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {CatalogueService} from '../../_services/catalogue/catalogue.service';
import {BuysellService} from '../../_services/buysell/buysell.service';
import {ModalComponent} from '../modal/modal.component';
import {ChartType, RadialChartOptions} from 'chart.js';
import {Label} from 'ng2-charts';

interface BusinessNode {
    name: string;
    children?: BusinessNode[];
}

const TREE_DATA: BusinessNode[] = [
    {
        name: 'Fruit',
        children: [
            {name: 'Business Summary'},
            {name: 'Financial Summary'},
            {name: 'Sustainability Measures'},
            {name: 'Scoring Summary'},
            {name: 'Funding Channels'},
            {name: 'Badges'}
        ]
    }, {
        name: 'Vegetables',
        children: [
            {name: 'Business Summary'},
            {name: 'Financial Summary'},
            {name: 'Sustainability Measures'},
            {name: 'Scoring Summary'},
            {name: 'Funding Channels'},
            {name: 'Badges'}
        ]
    },
];

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
    /** Based on the screen size, switch from standard to one column per row */
    cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({matches}) => {
            if (matches) {
                return [
                    {title: 'Card 1', cols: 1, rows: 1},
                    {title: 'Card 2', cols: 1, rows: 1},
                    {title: 'Card 3', cols: 1, rows: 1},
                    {title: 'Card 4', cols: 1, rows: 1}
                ];
            }

            return [
                {title: 'Card 1', cols: 2, rows: 1},
                {title: 'Card 2', cols: 1, rows: 1},
                {title: 'Card 3', cols: 1, rows: 2},
                {title: 'Card 4', cols: 1, rows: 1}
            ];
        })
    );

    // Business information
    businessUser: any = [];
    profile: any;
    explain_index: any = 0;
    click_flag: any = 0;
    mainBusiness = [];
    unSdg = [];
    interactions = [];
    stakeholders = [];
    stakeholdersCountry = [];
    stakeholdersButton3 = [];
    stakeholdersButton4 = [];
    stakeholdersConsideration = [];
    stakeholdersMap = [];
    radarChartData: any = [{
        data: []
    }];
    radarChartOptions: RadialChartOptions = {
        responsive: true,
    };
    radarChartLabels: Label[] = [];
    radarChartType: ChartType = 'radar';
    scoring = [];

    private _transformer = (node: BusinessNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            level: level,
        };
    }

    treeControl = new FlatTreeControl<ExampleFlatNode>(
        node => node.level, node => node.expandable);

    treeFlattener = new MatTreeFlattener(
        this._transformer, node => node.level, node => node.expandable, node => node.children);

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    constructor(private breakpointObserver: BreakpointObserver,
                private authenticationService: AuthenticationService,
                private catalogueService: CatalogueService,
                private buysellService: BuysellService,
                public dialog: MatDialog,
    ) {
        this.dataSource.data = TREE_DATA;
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
                    // All info including answers and users.
                    this.businessInfo = business_info;
                    this.mainBusiness = this.businessInfo['mainBusiness'];
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
    buy(business_id, business) {
        this.buysellService.business_id = business_id;
        this.buysellService.business_remain = business['how much they\'re raising'];
        this.buysellService.modal_content = 'Are you going to buy this item?';
        this.buysellService.action = 'buy';
        this.buysellService.business_name = business['business name'];
        this.buysellService.commission = this.businessInfo['commission'][0];
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
            width: '300px'

        });

        dialogRef.afterClosed().subscribe(result => {
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
}



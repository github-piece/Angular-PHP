import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagesComponent} from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SlickModule} from 'ngx-slick';
import {ChartsModule} from 'ng2-charts';
import {MainnavComponent} from '../common/mainnav/mainnav.component';
import {PagenotfoundtreeComponent} from './pagenotfoundtree/pagenotfoundtree.component';
import {FaqstreeComponent} from './faqstree/faqstree.component';
import {WishlistorgtreeComponent} from './wishlistorgtree/wishlistorgtree.component';
import {TandcstreeComponent} from './tandcstree/tandcstree.component';
import {PortanalysistreeComponent} from './portanalysistree/portanalysistree.component';
import {MenubarComponent} from '../common/menubar/menubar.component';
import {MessagingComponent} from './messaging/messaging.component';
import {AlertComponent} from '../alert/alert.component';
import {ChartComponent} from './chart/chart.component';
import {AutocomponentComponent} from '../autocomponent/autocomponent.component';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from '../core';
import {SharedModule} from '../shared';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {MaterialModule} from '../material.module';
import {MatDialogModule, MatDividerModule, MatRadioModule, MatRippleModule, MatTableModule, MatTabsModule} from '@angular/material';
import {GooglePlaceModule} from 'ngx-google-places-autocomplete';
import {HowtoService} from '../_services/howto/howto.service';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MaindashboardComponent} from './maindashboard/maindashboard.component';
import {HowtodashboardComponent} from './howtodashboard/howtodashboard.component';
import {NewsfeeddashboardComponent} from './newsfeeddashboard/newsfeeddashboard.component';
import {PortfoliodashboardComponent} from './portfoliodashboard/portfoliodashboard.component';
import {HistorydashboardComponent} from './historydashboard/historydashboard.component';
import {CatalogdashboardComponent} from './catalogdashboard/catalogdashboard.component';
import {AboutusdashboardComponent} from './aboutusdashboard/aboutusdashboard.component';
import {ContactusdashboardComponent} from './contactusdashboard/contactusdashboard.component';
import {UpcominglistingsdashboardComponent} from './upcominglistingsdashboard/upcominglistingsdashboard.component';
import {NewlistingtableComponent} from './newlistingtable/newlistingtable.component';
import {AlllistingtableComponent} from './alllistingtable/alllistingtable.component';
import {ListingABusinessComponent} from './listing-abusiness/listing-abusiness.component';
import {HowtodetailsComponent} from './howtodashboard/howtodetails.component';
import {AboutDetailsComponent} from './aboutusdashboard/aboutdetails/aboutusdetails.component';
import {UserpagedashboardComponent} from './userpagedashboard/userpagedashboard.component';
import {DetailArticleComponent} from './detail-article/detail-article.component';
import {AgmCoreModule} from '@agm/core';
import {AgGridModule} from 'ag-grid-angular';
import {BsDropdownModule} from 'ngx-bootstrap';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import {SliderComponent} from './slider/slider.component';
import {SliderItemDirective} from './slider/slider-item.directive';
import { RadarChartComponent } from './radar-chart/radar-chart.component';
import {GoogleChartsModule} from 'angular-google-charts';
import { EditModalComponent } from './userModal/edit-modal/edit-modal.component';
import { CreateModalComponent } from './userModal/create-modal/create-modal.component';
import {NgxPaginationModule} from 'ngx-pagination';
@NgModule({
        declarations: [
            PagesComponent,
            MaindashboardComponent,
            NewsfeeddashboardComponent,
            HowtodashboardComponent,
            MainnavComponent,
            PortfoliodashboardComponent,
            CatalogdashboardComponent,
            HistorydashboardComponent,
            UserpagedashboardComponent,
            AboutusdashboardComponent,
            ContactusdashboardComponent,
            PagenotfoundtreeComponent,
            FaqstreeComponent,
            WishlistorgtreeComponent,
            TandcstreeComponent,
            PortanalysistreeComponent,
            UpcominglistingsdashboardComponent,
            NewlistingtableComponent,
            AlllistingtableComponent,
            MenubarComponent,
            ListingABusinessComponent,
            MessagingComponent,
            AlertComponent,
            ChartComponent,
            DetailArticleComponent,
            AutocomponentComponent,
            HowtodetailsComponent,
            AboutDetailsComponent,
            SliderComponent,
            SliderItemDirective,
            RadarChartComponent,
            EditModalComponent,
            CreateModalComponent,
        ],
        imports: [
            PagesRoutingModule,
            CommonModule,
            ReactiveFormsModule,
            FormsModule,
            SlickModule.forRoot(),
            ChartsModule,
            HttpClientModule,
            CoreModule,
            SharedModule,
            TransferHttpCacheModule,
            MaterialModule,
            MatDialogModule,
            MatTabsModule,
            MatTableModule,
            MatRadioModule,
            GooglePlaceModule,
            ImageCropperModule,
            MatRippleModule,
            AgmCoreModule,
            AgGridModule.withComponents(null),
            BsDropdownModule.forRoot(),
            NgxIntlTelInputModule,
            TreeViewModule,
            GoogleChartsModule,
            NgxPaginationModule
        ],
        bootstrap: [CatalogdashboardComponent],
        providers: [
            HowtoService,
        ],
        entryComponents: [
            HowtodetailsComponent,
            AboutDetailsComponent,
            EditModalComponent,
            CreateModalComponent
        ]
    },
)
export class PagesModule {
}

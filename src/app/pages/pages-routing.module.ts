import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PagesComponent} from './pages.component';
import {WishlistorgtreeComponent} from './wishlistorgtree/wishlistorgtree.component';
import {FaqstreeComponent} from './faqstree/faqstree.component';
import {TandcstreeComponent} from './tandcstree/tandcstree.component';
import {SendmailComponent} from '../auth/sendmail/sendmail.component';
import {ResetpwdComponent} from '../auth/resetpwd/resetpwd.component';
import {MessagingComponent} from './messaging/messaging.component';
import {MaindashboardComponent} from './maindashboard/maindashboard.component';
import {NewsfeeddashboardComponent} from './newsfeeddashboard/newsfeeddashboard.component';
import {HowtodashboardComponent} from './howtodashboard/howtodashboard.component';
import {PortfoliodashboardComponent} from './portfoliodashboard/portfoliodashboard.component';
import {CatalogdashboardComponent} from './catalogdashboard/catalogdashboard.component';
import {HistorydashboardComponent} from './historydashboard/historydashboard.component';
import {AboutusdashboardComponent} from './aboutusdashboard/aboutusdashboard.component';
import {ContactusdashboardComponent} from './contactusdashboard/contactusdashboard.component';
import {UpcominglistingsdashboardComponent} from './upcominglistingsdashboard/upcominglistingsdashboard.component';
import {ListingABusinessComponent} from './listing-abusiness/listing-abusiness.component';
import {UserpagedashboardComponent} from './userpagedashboard/userpagedashboard.component';
import {DetailArticleComponent} from './detail-article/detail-article.component';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: '',
                redirectTo: 'maindashboard',
                pathMatch: 'full'
            },
            {
                path: 'maindashboard',
                component: MaindashboardComponent,
            },
            {path: 'newsfeed', component: NewsfeeddashboardComponent},
            {path: 'howtopage', component: HowtodashboardComponent},
            {path: 'portfolio', component: PortfoliodashboardComponent},
            {path: 'catalogue', component: CatalogdashboardComponent},
            {path: 'history', component: HistorydashboardComponent},
            {path: 'wishlist', component: WishlistorgtreeComponent},
            {path: 'userpage', component: UserpagedashboardComponent},
            {path: 'FAQs', component: FaqstreeComponent},
            {path: 'aboutus', component: AboutusdashboardComponent},
            {path: 'termsandconditions', component: TandcstreeComponent},
            {path: 'contactus', component: ContactusdashboardComponent},
            {path: 'sendmail', component: SendmailComponent},
            {path: 'resetpwd', component: ResetpwdComponent},
            {path: 'upcominglistings', component: UpcominglistingsdashboardComponent},
            {path: 'listingABusinessComponent', component: ListingABusinessComponent},
            {path: 'messaging', component: MessagingComponent},
            {path: 'detailArticle', component: DetailArticleComponent},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}

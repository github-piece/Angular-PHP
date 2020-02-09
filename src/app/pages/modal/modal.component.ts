import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {BuysellService} from '../../_services/buysell/buysell.service';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PayfastService} from '../../_services/payfast/payfast.service';
import {PAYMENT_METHOD_CREDIT} from '../../../config/Constant';
import {URL_PAYFAST_BUY} from '../../../config/url.servicios';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
    public business_id: any;
    public business_remain: any;
    public modal_content: any;
    public action: any;
    loading = false;
    userid: any;
    fail_sell: boolean;
    commission:any;
    platform_fee: any;
    item_name:any;
    url = URL_PAYFAST_BUY;
    signature:any;
    payFastForm:FormGroup;
    formData:FormData;
    submitted:boolean = false;
    curSymbol:any;balance_value:any;amount_to_buy;any;
    constructor(public dialogRef: MatDialogRef<ModalComponent>,
                private authenticationService: AuthenticationService,
                private buysellService: BuysellService,
                private fb:FormBuilder,
                private payfast:PayfastService) {
        this.formData = new FormData();
        this.payFastForm = this.fb.group({
            merchant_id:[''],merchant_key:[''],return_url:[''],cancel_url:[''],notify_url:[''],
            amount:[''], item_name:[''], payment_method:[''], signature:['']
        })
    }
    ngOnInit() {
        this.initModal();
    }
    //Get all data for modal.
    initModal(){
        this.userid = this.authenticationService.currentUserSubject.value.u_id;
        this.business_id = 0;
        this.modal_content = '';
        this.action = '';
        this.business_id = this.buysellService.business_id;
        this.modal_content = this.buysellService.modal_content;
        this.action = this.buysellService.action;
        this.item_name = this.buysellService.business_name;
        this.business_remain = this.buysellService.business_remain;
        this.curSymbol = this.getCurrencySymbol(this.business_remain);
        this.getCommission();
    }
    getCommission(){
        this.commission = this.buysellService.commission;
    }
    //When click the confirm button, then get signature.
    getSignature(){
        this.formData.append('merchant_id', this.commission['mse_merchant_id']);
        this.formData.append('merchant_key', this.commission['mse_merchant_key']);
        this.formData.append('return_url', this.commission['url_return']);
        this.formData.append('cancel_url', this.commission['url_cancel']);
        this.formData.append('notify_url', this.commission['url_notify']);
        this.platform_fee =  this.commission['mse_fee']*this.payFastForm.get('amount').value;
        this.amount_to_buy = this.payFastForm.get('amount').value;
        this.balance_value = parseFloat((parseFloat(this.business_remain) - parseFloat(this.amount_to_buy)).toPrecision(3));
        this.formData.append('amount',this.amount_to_buy);
        this.formData.append('item_name', this.item_name);
        this.formData.append('payment_method', this.commission['payment_method']);
        this.generateSignature(this.formData);
        this.submitted = true;
    }
    //Generate signature.
    generateSignature(formData){
        return this.payfast.generateSignature(formData)
            .pipe(first()).subscribe((res:any)=>{
                this.signature =res;
            });
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    //Get currency symbol.
    getCurrencySymbol(str){
        return str.replace(/[\d\., ]/g, '');
    }



    changeAmount() {
        this.fail_sell = false;
    }
    //Buy the business selected.
    // buyBusiness() {
    //     if (this.balance_value < 0) {    // if buy amount is more than reamining...
    //         this.fail_sell = true;
    //         this.loading = false;
    //         return;
    //     }
    //     const that = this.dialogRef;
    //     let that_loading = this.loading;
    //     this.fail_sell = false;
    //     this.buysellService.buy(this.business_id, this.amount, this.userid)
    //         .pipe(first())
    //         .subscribe(
    //             data => {
    //                 setTimeout(function () {
    //                     that.close();
    //                     that_loading = false;
    //                 }, 1500);
    //
    //                 this.getPortfolioList();
    //
    //             },
    //             error => {
    //             });
    // }
    // sell() {
    //     const that = this.dialogRef;
    //     let that_loading = this.loading;
    //
    //     this.buysellService.sell(this.business_id, this.amount, this.userid)
    //         .pipe(first())
    //         .subscribe(
    //             data => {
    //                 if (data === 1) {
    //                     this.fail_sell = false;
    //                     setTimeout(function () {
    //                         that.close();
    //                         that_loading = false;
    //                     }, 1500);
    //                 this.getPortfolioList();
    //             } else {
    //                 this.fail_sell = true;
    //                 this.loading = false;
    //
    //             }
    //             console.log('sell respponse = ', data);
    //
    //         },
    //         error => {
    //         });
    // }
    // onOkClick(): void {
    //     this.loading = true;
    //     if (this.amount === undefined) {
    //         this.loading = false;
    //         return;
    //     }
    //     switch (this.action) {
    //         case 'buy':
    //             // this.buy();
    //             break;
    //         case 'sell':
    //             this.sell();
    //             break;
    //
    //     }
    // }
    getPortfolioList() {
        this.buysellService.getPortfolio(this.userid)
            .pipe(first())
            .subscribe(
                data => {
                    this.buysellService.rowData = data;
                },
                error => {
                });
    }
    //Submit order.
    onCheckOut(){
    }
}

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {BuysellService} from '../../_services/buysell/buysell.service';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PayfastService} from '../../_services/payfast/payfast.service';
import {PAYMENT_METHOD_CREDIT} from '../../../config/Constant';
import {URL_PAYFAST_BUY} from '../../../config/url.servicios';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

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
    userName: string;
    fail_sell = false;
    commission: any;
    platform_fee: any;
    item_name: any;
    url = URL_PAYFAST_BUY;
    signature: any;
    payFastForm: FormGroup;
    formData: FormData;
    submitted = false;
    formShow = true;
    curSymbol: any;
    balance_value: any;
    amount_to_buy: any;
    max_amount: number;
    fundTypes = [];
    onShow = false;
    fund: any;
    rate: any;
    frequency: any;
    constructor(public dialogRef: MatDialogRef<ModalComponent>,
                private authenticationService: AuthenticationService,
                private buysellService: BuysellService,
                private fb: FormBuilder,
                private payfast: PayfastService) {
        this.formData = new FormData();
        this.payFastForm = this.fb.group({
            amount: ['', [
                Validators.required,
                (control: AbstractControl) => Validators.max(this.max_amount)(control),
                Validators.min(0)]],
            fundType: ['', Validators.required],
            rate: ['', Validators.required],
            frequency: ['', Validators.required]
        });
    }
    ngOnInit() {
        this.initModal();
    }
    // Get all data for modal.
    initModal() {
        this.userid = this.authenticationService.currentUserSubject.value.u_id;
        this.userName = this.authenticationService.currentUserSubject.value.u_name;
        this.modal_content = '';
        this.action = '';
        this.business_id = this.buysellService.business_id;
        this.modal_content = this.buysellService.modal_content;
        this.action = this.buysellService.action;
        this.fundTypes = this.buysellService.fundTypes;
        this.item_name = this.buysellService.business_name;
        this.business_remain = this.buysellService.business_remain;
        this.max_amount = parseFloat(this.business_remain);
        this.curSymbol = this.getCurrencySymbol(this.business_remain);
        this.getCommission();
    }
    getCommission() {
        this.commission = this.buysellService.commission;
        // this.commission['url_return'] = '';
        // this.commission['url_cancel'] = '';
        // this.commission['url_notify'] = '';
    }
    hasError = (controlName: string, errorName: string) => {
        return this.payFastForm.controls[controlName].hasError(errorName);
    }
    getSignature() {
        if (this.payFastForm.invalid) {
            return;
        }
        this.amount_to_buy = this.payFastForm.get('amount').value;
        this.formData.append('merchant_id', this.commission['mse_merchant_id']);
        this.formData.append('merchant_key', this.commission['mse_merchant_key']);
        this.formData.append('return_url', this.commission['url_return']);
        this.formData.append('cancel_url', this.commission['url_cancel']);
        this.formData.append('notify_url', this.commission['url_notify']);
        this.platform_fee =  this.commission['mse_fee'] * this.payFastForm.get('amount').value;
        this.fund = this.payFastForm.get('fundType').value;
        this.rate = this.payFastForm.get('rate').value;
        this.frequency = this.payFastForm.get('frequency').value;
        this.balance_value = parseFloat((parseFloat(this.business_remain) - parseFloat(this.amount_to_buy)).toPrecision(3));
        this.formData.append('amount', this.amount_to_buy);
        this.formData.append('item_name', this.item_name);
        this.formData.append('fund', this.fund);
        this.formData.append('rate', this.rate);
        this.formData.append('frequency', this.frequency);
        this.formData.append('payment_method', this.commission['payment_method']);
        this.formData.append('businessId', this.business_id);
        this.formData.append('balance', this.business_remain);
        this.formData.append('userId', this.userid);
        this.generateSignature(this.formData);
        this.formShow = false;
    }
    // Generate signature.
    generateSignature(formData) {
        return this.payfast.generateSignature(formData)
            .pipe(first()).subscribe((res: any) => {
                this.signature = res;
            });
    }
    onNoClick(): void {
        this.dialogRef.close();
    }

    getCurrencySymbol(str) {
        return str.replace(/[\d\., ]/g, '');
    }

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
    // Submit order.
    onCheckOut() {
        this.dialogRef.close();
        this.setHistory();
    }
    setHistory() {
        const userId = this.formData.get('userId');
        const businessId = this.formData.get('businessId');
        const balance = this.formData.get('balance');
        const amount = this.formData.get('amount');
        const fund = this.formData.get('fund');
        const rate = this.formData.get('rate');
        const frequency = this.formData.get('frequency');
        this.buysellService.buy(userId, businessId, balance, amount, fund, rate, frequency)
            .pipe(first())
            .subscribe(
                result => {
                    return result;
                },
                error => {
                });
    }
    showPart() {
        this.onShow = true;
    }
}

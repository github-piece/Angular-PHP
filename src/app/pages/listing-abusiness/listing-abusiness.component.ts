import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionsService} from '../../_services/questions/questions.service';
import {AnswerService} from '../../_services/answers/answer.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import {TreeViewComponent} from '@syncfusion/ej2-angular-navigations';
import {CatalogueService} from '../../_services/catalogue/catalogue.service';
import * as XLSX from 'xlsx';
import {Router} from '@angular/router';

type AOA = any[][];

@Component({
    selector: 'app-listing-abusiness',
    templateUrl: './listing-abusiness.component.html',
    styleUrls: ['../../layouts/pages/cards/styles/cards.scss', 'styles/listing-abusiness.component.scss'],
})
export class ListingABusinessComponent implements OnInit {
    @ViewChild('treeview')
    public tree: TreeViewComponent;
    businessAnswers: AOA;
    username = '';
    showProfile = true;
    showActions = false;
    submitted = false;
    onFinish = true;
    loading = false;
    address: string;
    userid: any;
    action =  'insert';
    profile: string;
    imagePath: any;
    imgURL = [];
    showImage = [];
    currentStep = 0;
    progress = '1';
    questionForm: FormGroup;
    questionData = [];
    rowData = [];
    col_validator: {};
    formData: FormData;
    upload_index = [];
    validatorMessage = {  };
    dom_flag = false;
    dom_position_click = false;
    country = [];
    selected_country: any;
    provinces = [];
    province = [];
    Municipalities = [];
    Municipality = [];
    file = [];
    chips: any = [];
    chips_temp: any = [];
    chips_row = [];
    chips_position = 0;
    selectable = true;
    removable = true;
    separatorKeysCodes = [COMMA, ENTER];
    addOnBlur = true;
    instruments = [];
    currency_code: any;
    currency_symbol: any = '';
    currency_amount: any = '';
    stakeholder = [];
    goals = [];
    balances = [];
    incomes = [];
    cashFlows = [];
    stakeholderRings = [];
    rings: any = '';
    explain_index: any;
    addItem_flag = false;
    dom_position: number;
    rangeMain = [];
    rangeExtra = [];
    rangeExtraDomAddItem = [];
    questionTypeID: any;
    addItem_colData = [];
    sectors: Object = [];
    addItem_rowsData: any = [];
    SearchCountryField = SearchCountryField;
    TooltipLabel = TooltipLabel;
    CountryISO = CountryISO;
    hidden = 1;
    sectorsSel: any = '';
    dom_addItem_flag = false;
    domAddItem_flag = false;
    message: string;
    click_flag: number;
    businessId = '';
    excelAnswers = [];
    public treeData: Object = {dataSource: this.sectors, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild'};
    public showCheckBox = true;
    constructor(private fb: FormBuilder,
                private questionnaireService: QuestionsService,
                private putAnswerService: AnswerService,
                private authenticationService: AuthenticationService,
                private catalogueService: CatalogueService,
                private router: Router
    ) {
        this.formData = new FormData();
    }
    ngOnInit() {
        if (this.authenticationService.currentUserSubject.value == null) {
            this.showActions = false;
        } else {
            this.showActions = true;
            this.userid = this.authenticationService.currentUserSubject.value.u_id;
        }
    }
    getProfile(profile) {
        this.questionData = [];
        this.profile = profile;
        this.getQuestionnaireList();
        return this.profile;
    }
    InitValidationMsg() {
        for (let i = 0; i < 10; i++) {
            if (this.rowData['col_' + i] === 'email') {
                this.validatorMessage['col_' + i + '_header'] = [{
                    type: 'email', errorMessage: 'Please type valid email address. eg topwolf0808@gmail.com'
                }, {
                    type: 'required', errorMessage: 'Please enter your email address.'
                }];
            } else {
                this.validatorMessage['col_' + i + '_header'] = [{
                    type: 'required', errorMessage: 'Please answer to this question, this field is required.'
                }];
            }
        }
    }
    initVar() {
        this.dom_position_click = false;
        this.dom_flag = false;
        this.domAddItem_flag = false;
        this.rangeMain = [];
        this.rangeExtra = [];
        this.rangeExtraDomAddItem = [];
        this.col_validator = {};
        this.addItem_flag = false;
        this.upload_index = [];
        this.chips = [];
        this.chips_temp = [];
        this.addItem_rowsData = [];
        this.addItem_colData = [];
    }
    getQuestionnaireList() {
        return this.questionnaireService.getQuestionnaireList(this.userid, this.profile)
            .pipe(first())
            .subscribe(
                data => {
                    if (data['rememberValue'][0].id_business_quiz !== '133') {
                        this.currentStep = data['rememberValue'][0].id_business_quiz;
                        this.businessId = data['rememberValue'][0].business_id;
                        this.action = 'update';
                    }
                    this.questionData = data['data'];
                    this.country = data['country'];
                    this.instruments = data['instruments'];
                    this.currency_code = data['currency_code'];
                    this.stakeholder = data['stakeholder'];
                    this.goals = data['goals'];
                    this.balances = data['balances'];
                    this.incomes = data['incomes'];
                    this.cashFlows = data['cashFlows'];
                    this.stakeholderRings = data['stakeholderRings'];
                    this.sectors = this.getTreeStructure(data['sectors']);
                    this.provinces = data['provinceList'];
                    this.Municipalities = data['Municipalities'];
                    this.question_start(this.currentStep);
                });
    }
    question_start(i) {
        let required;
        this.initVar();
        this.rowData = this.questionData[i];
        if (this.rowData['notes'] === 'Dom manipulation required') {
            this.dom_position = parseInt(this.rowData['dom_position']);
            this.dom_validator();
        } else if (this.rowData['notes'] === 'Add Item Option') {
            this.addItem_validator();
        } else if (this.rowData['notes'].includes('Dom manipulation required') && this.rowData['notes'].includes('Add Item Option')) {
            this.dom_addItem_validator();
        } else {
            for (let m = 0; m < 10; m++) {
                this.rangeMain.push(m);
            }
            if (this.rowData['required']) {
                required = 1;
            } else {
                required = 0;
            }
            this.form_validator(required, this.rowData);
        }
    }
    form_validator(required, rowData) {
        this.InitValidationMsg();
        if (required) {
            for (let i = 0; i < 10; i++) {
                if (rowData['col_' + i + '_header']) {
                    if (this.rowData['col_' + i] === 'email') {
                        this.col_validator['col_' + i + '_header'] = new FormControl('');
                    } else if (this.rowData['col_' + i] === 'SelectionAndDetails') {
                        this.col_validator['col_' + i + '_header'] = new FormControl('');
                    } else {
                        this.col_validator['col_' + i + '_header'] = new FormControl('');
                    }
                }
            }
        } else {
            for (let i = 0; i < 10; i++) {
                if (rowData['col_' + i + '_header']) {
                    this.col_validator['col_' + i + '_header'] = new FormControl('');
                }
            }
        }
        this.questionForm = this.fb.group(
            this.col_validator
        );
        this.showProfile = false;
    }
    dom_validator() {
        this.InitValidationMsg();
        for (let i = 0; i <= 10; i++) {
            if (this.rowData['col_' + i + '_header']) {
                this.col_validator['col_' + i + '_header'] = new FormControl('');
            }
        }
        this.col_validator['other'] = this.fb.array([]);
        this.questionForm = this.fb.group(
            this.col_validator
        );
        for (let i = 0; i <= this.dom_position; i++) {
            this.rangeMain.push(i);
        }
        for (let i = this.dom_position + 1; i < 10; i++) {
            this.rangeExtra.push(i);
        }
        this.dom_flag = true;
        this.showProfile = false;
    }
    addItem_validator() {
        let position;
        if (this.rowData['col_0'] === 'SelectionAndDetails') {
            position = 0;
            this.col_validator['col_0_header'] = [''];
        } else {
            position = -1;
        }
        this.col_validator['other'] = this.fb.array([this.addOtherSkillFormGroup(position)]);
        this.questionForm = this.fb.group(
            this.col_validator
        );
        for (let i = 0; i <= position; i++) {
            this.rangeMain.push(i);
        }
        for (let i = position + 1; i < 10; i++) {
            this.rangeExtra.push(i);
        }
        this.addItem_flag  = true;
    }
    dom_addItem_validator() {
        this.dom_position = parseInt(this.rowData['dom_position']);
        this.dom_addItem_flag = true;
        this.dom_validator();
    }
    changeStep() {
        if (!this.submitted) {
            if (!this.questionForm.valid) {
                for (const control in this.questionForm.controls) {
                    if (this.questionForm.controls.hasOwnProperty(control)) {
                        this.questionForm.controls[control].markAsTouched();
                    }
                }
                return false;
            } else {
                if (this.currentStep === 0) {
                    const businessName = this.questionForm.get('col_0_header').value;
                    const time = Date.now();
                    this.questionTypeID = businessName + time;
                }
                if (this.currentStep < this.questionData.length) {
                    this.currentStep++;
                } else {
                    return;
                }
                this.progress = String(Math.round(this.currentStep * 100 / this.questionData.length));
                if (this.addItem_flag || this.domAddItem_flag) {
                    for (const i of this.rangeExtra) {
                        if (this.questionForm.get('col_' + i + '_header')) {
                            this.addItem_colData['col_' + i + '_header'] = this.questionForm.get('col_' + i + '_header').value;
                        } else {
                            this.addItem_colData['col_' + i + '_header'] = '';
                        }
                    }
                    if (this.domAddItem_flag) {
                        this.addItem_colData['col_0_header'] = 'Yes';
                    }
                    for (const {addItem_rowData, index} of this.questionForm.get('other').value.map((addItem_rowData, index) => ({
                        addItem_rowData,index
                    }))) {
                        if (index === 0) {
                            const target = {};
                            Object.assign(target, this.addItem_colData);
                            this.addItem_rowsData[0] = target;
                            if (this.domAddItem_flag) {
                                this.addItem_rowsData[1] = addItem_rowData;
                            }
                        } else {
                            if (this.domAddItem_flag) {
                                this.addItem_rowsData[index + 1] = addItem_rowData;
                            } else {
                                this.addItem_rowsData[index] = addItem_rowData;
                            }
                        }
                    }
                }
                const answer_id = this.putAnswerList();
                if (answer_id) {
                    this.formData = new FormData();
                    this.question_start(this.currentStep);
                }
            }
        }
    }
    putAnswerList() {
        if (this.addItem_flag || this.domAddItem_flag) {
            this.formData.append('addItem_rowsData', JSON.stringify(this.addItem_rowsData));
        } else {
            for (let i = 0; i < 10; i++) {
                if (this.questionForm.get('col_' + i + '_header')) {
                    if (this.upload_index[i] === i) {
                        this.formData.append('col_' + i + '_header', '');
                    } else {
                        if (this.rowData['col_' + i].toLowerCase().includes('phone')
                            && this.questionForm.get('col_' + i + '_header').value) {
                            this.formData.append('col_' + i + '_header', this.questionForm.get('col_' + i + '_header').value.number);
                        } else if (this.rowData['col_' + i].toLowerCase().includes('sector')) {
                            this.formData.append('col_' + i + '_header', this.sectorsSel);
                        } else if (this.rowData['col_' + i].toLowerCase().includes('tag')) {
                            this.formData.append('col_' + i + '_header', this.chips);
                        } else {
                            this.formData.append('col_' + i + '_header', this.questionForm.get('col_' + i + '_header').value);
                        }
                    }
                }
            }
        }
        this.formData.append('userid', this.userid);
        this.formData.append('profile', this.profile);
        this.formData.append('id_business_quiz', this.rowData['id']);
        if (this.profile === 'business_profile') {
            localStorage.setItem('business_profile', this.questionTypeID);
        } else if (this.profile === 'scouter_profile') {
            localStorage.setItem('scouter_profile', this.questionTypeID);
        } else {
            localStorage.setItem('employer_profile', this.questionTypeID);
        }
        this.formData.append('questionTypeID', this.questionTypeID);
        this.formData.append('action', this.action);
        this.formData.append('businessId', this.businessId);
        return this.putAnswerService.putAnswer(this.formData)
            .pipe(first()).subscribe((res: any) => {
                    return res;
                },
                error => {
                    console.log(error);
                }
            );
    }
    onFileChange(event, i) {
        this.upload_index[i] = i;
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.formData.append('upload_file_' + i, file);
            this.formData.append('upload_index_' + i, this.upload_index[i]);
        }
        const mimeType = event.target.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.message = 'Only images are supported.';
            return;
        }
        const reader = new FileReader();
        this.imagePath = event.target.files;
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
            this.imgURL[i] = reader.result;
        };
        this.file[i] = event.target.files.item(0);
        this.showImage[i] = true;
    }
    goToStart() {
        this.showProfile = true;
        this.currentStep = 0;
        this.progress = '0';
        this.router.navigate(['']);
    }
    removeTag(chip: any, i): void {
        let index;
        if (this.addItem_flag) {
            index = this.chips_temp[i].indexOf(chip);
            if (index >= 0) {
                this.chips_temp[i].splice(index, 1);
            }
        } else {
            index = this.chips.indexOf(chip);
            if (index >= 0) {
                this.chips.splice(index, 1);
            }
        }
    }
    addTag(event: MatChipInputEvent, index, i): void {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
            if (this.addItem_flag) {
                if (this.chips_position !== index) {
                    this.chips_row = [];
                    if (this.chips_temp[index]) {
                        this.chips_row = this.chips_temp[index];
                    }
                    this.chips_row.push(value.trim());
                } else {
                    this.chips_row.push(value.trim());
                }
                this.chips_position = index;
                this.chips_temp[index] = this.chips_row;
                if (index === 0) {
                    this.questionForm.controls['col_' + i + '_header'].setValue(this.chips_temp[index]);
                } else {
                    (<FormArray>this.questionForm.controls['other']).
                        controls[index]['controls']['col_' + i + '_header'].setValue(this.chips_temp[index]);
                }
            } else {
                this.chips.push(value.trim());
            }
        }
        if (input) {
            input.value = '';
        }
    }
    addCurrencyAmount(event, i): void {
        this.currency_amount = event.target.value;
    }
    addCurrencySymbol(symbol, i): void {
        this.currency_symbol = symbol;
        this.questionForm.controls['col_' + i + '_header'].setValue(this.currency_amount + this.currency_symbol);
    }
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
    getStakeholderRing(ring, i) {
        let rings;
        if (this.rings) {
            rings = this.rings + ',' + ring ;
        } else {
            rings = ring;
        }
        this.rings = rings;
        this.questionForm.controls['col_' + i + '_header'].setValue(this.rings);
    }
    addOtherSkillFormGroup(position): FormGroup {
        for (let i = position + 1; i < 10; i++) {
            if (this.rowData['col_' + i + '_header']) {
                this.col_validator['col_' + i + '_header'] = new FormControl('');
            }
        }
        return this.fb.group(this.col_validator);
    }
    showExtraDom(event) {
        if (event.value === 'Yes') {
            this.dom_position_click = true;
        } else {
            this.dom_position_click = false;
            this.domAddItem_flag = false;
        }
    }
    addItem(): void {
        this.col_validator = {};
        this.chips_row = [];
        this.click_flag = undefined;
        let position;
        if (this.rowData['col_0'] === 'SelectionAndDetails') {
            position = 0;
        } else {
            position = -1;
        }
        (<FormArray>this.questionForm.get('other')).push(this.addOtherSkillFormGroup(position));
        const getAddBtn = document.getElementsByClassName('add-btn_1');
        for (let i = 0; i < getAddBtn.length; i++) {
            const btnDisplay = getAddBtn.item(i) as HTMLElement;
            btnDisplay.style.display = 'none';
        }
    }
    removeValidator(value, i) {
        if (value) {
            this.questionForm.get('col_' + i + '_header').clearValidators();
            this.questionForm.get('col_' + i + '_header').updateValueAndValidity();
        }
    }
    public nodeChecked(): void {
        const checkedNodesId = this.tree.checkedNodes;
        for (const checkedID of checkedNodesId) {
            for (const key in this.sectors) {
                if (this.sectors[key]['id'] === checkedID) {
                    this.sectorsSel += this.sectors[key]['name'] + ',';
                }
            }
        }
    }
    getTreeStructure(sectors) {
        let row_data = {}, i = 0;
        for (const row_sector of sectors) {
            for (const key in row_sector) {
                if (row_sector[key]) {
                    if (key !== 'id') {
                        if (key === 'sector') {
                            row_data['id'] = row_sector['id'];
                            row_data['name'] = row_sector[key];
                            if (row_sector['sub_sector_0']) {
                                row_data['hasChild'] = true;
                            } else {
                                row_data['hasChild'] = false;
                            }
                        }
                        for (let j = 0; j <= 4; j++) {
                            if (key === 'sub_sector_' + j) {
                                row_data['id'] = row_sector['id'] + '_sub_sector_' + j;
                                row_data['pid'] = row_sector['id'];
                                row_data['name'] = row_sector['sub_sector_' + j];
                            }
                        }
                        this.sectors[i] = row_data; row_data = {}; i++;
                    }
                }
            }
        }
        return this.sectors;
    }
    dom_addItem() {
        const position = 0;
        this.col_validator = {};
        this.rangeExtraDomAddItem = [];
        this.click_flag = undefined;
        (<FormArray>this.questionForm.get('other')).push(this.addOtherSkillFormGroup(position));
        for (let i = position + 1; i < 10; i++) {
            this.rangeExtraDomAddItem.push(i);
        }
        this.domAddItem_flag = true;
    }
    addCurrencySymbolDomAddItem(symbol, i, index) {
        this.currency_symbol = symbol;
        (<FormArray>this.questionForm.controls['other']).controls[index]['controls']
            ['col_' + i + '_header'].setValue(this.currency_amount + this.currency_symbol);
    }
    public handleAddressChange(address: any, i) {
        this.address = address['formatted_address'];
        this.questionForm.controls['col_' + i + '_header'].setValue(this.address);
    }
    getProvince(country) {
        this.province = [];
        this.selected_country = country;
        for (let i = 0; i < this.provinces.length; i++) {
            if (this.provinces[i].country === country) {
                this.province.push(this.provinces[i].names);
            }
        }
    }
    getMunicipality (selected_province, index) {
        if (!this.rowData['col_' + 1 * (index + 1)].toLowerCase().include('south africa') && this.selected_country === 'South Africa') {
            return ;
        }
        this.Municipality = [];
        for (let i = 0; i < this.Municipalities.length; i++) {
            if (this.Municipalities[i].province === selected_province) {
                this.Municipality.push(this.Municipalities[i]);
            }
        }
    }
    onSubmit() {
        this.onFinish = false;
        this.submitted = true;
        this.currentStep = this.questionData.length;
        this.progress = '100';
        return this.catalogueService.setBusinessList(this.userid, this.questionTypeID).pipe(first()).subscribe(result => {
            return result;
        });
    }
    import(evt: any) {
        const excelAnswers = []; let j = 0;
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) { throw new Error('Cannot use multiple files'); }
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];
            this.businessAnswers = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
            for (let i = 2; i < this.businessAnswers.length; i++) {
                if (this.businessAnswers[i][2] !== undefined) {
                    let value = '';
                    for (let n = 3; n <= 24; n += 3) {
                        if (this.businessAnswers[i][n] !== undefined) {
                            for (let m = 0; m < this.businessAnswers[i][n].length; m++) {
                                if (this.businessAnswers[i][n][m] === "'") {
                                    let character = "'";
                                    for (let k = m; k < this.businessAnswers[i][n].length; k++) {
                                        character += this.businessAnswers[i][n][k];
                                    }
                                    for (let ii = 0; ii < m; ii++) {
                                        value += this.businessAnswers[i][n][ii];
                                    }
                                    value += character;
                                    this.businessAnswers[i][n] = value;
                                    m = this.businessAnswers[i][n].length;
                                }
                            }
                        }
                    }
                    excelAnswers[j] = {
                        no: j + 1,
                        answer0: this.businessAnswers[i][3],
                        answer1: this.businessAnswers[i][6],
                        answer2: this.businessAnswers[i][9],
                        answer3: this.businessAnswers[i][12],
                        answer4: this.businessAnswers[i][15],
                        answer5: this.businessAnswers[i][18],
                        answer6: this.businessAnswers[i][21],
                        answer7: this.businessAnswers[i][24]
                    };
                    j++;
                }
            }
            const time = Date.now();
            return this.putAnswerService.excelAnswer(excelAnswers, this.userid, time)
                .pipe(first())
                .subscribe(data => {
                    this.questionTypeID = data.businessId;
                    this.catalogueService.setBusinessListByExcel(this.userid, this.questionTypeID)
                        .pipe(first())
                        .subscribe(result => {
                            this.router.navigate(['/pages/catalogue']);
                        }, error => {
                            this.router.navigate(['/pages/catalogue']);
                        });
                });
        };
        reader.readAsBinaryString(target.files[0]);
    }
}


import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ApiService } from '../_service/api.service';
import { interval, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_service/auth.service';
import { GroupService } from '../_service/group.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss'],
})
export class DeviceComponent implements OnInit {
  @Output() selectedGroupChanged: EventEmitter<string> = new EventEmitter<string>();
  showGroupDropdown: boolean = false;
  selectedGroup: string = '';
  groups: string[] = [''];
  data: any[] = [];
  editMode = false;
  editedData: any = {};
  groupData: any = {};
  newData: any = {};
  addMode = false;
  groupMode = false;
  unitCost: number | null = null;
  newGroup: any = {};
  apiGroups: any[] = [];



  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  private dataSubscription: Subscription | undefined;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private authService: AuthService,
    private groupService: GroupService // Inject the GroupService
  ) {}

  toggleGroupDropdown() {
    this.showGroupDropdown = !this.showGroupDropdown;
  }
  // ฟังก์ชันเลือกกลุ่ม
  selectGroup(group_id: string) {
    this.groupService.setSelectedGroup(group_id);
  }



  // สร้างฟังก์ชันเรียกข้อมูลของ device ตามกลุ่มที่เลือก
  getDevicesByGroup(group: string) {
    // ทำงานเรียกข้อมูลของ device ตามกลุ่มที่เลือก
  }

  ngOnInit(): void {
    this.loadData();

    this.dataSubscription = interval(2000).subscribe(() => {
      this.loadData();
      this.apiService.getAllGroups().subscribe((groups: any) => {
        this.apiGroups = groups;
      });
    });

    // Use 'selectedGroup$' instead of 'selectedGroupChanged$'
    this.groupService.selectedGroup$.subscribe((selectedGroup: string) => {
      this.selectedGroup = selectedGroup;
    });
  }


  isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  ngOnDestroy() {
    // ยกเลิกการสมัครสมาชิกเมื่อคอมโพนนิ้งถูกทำลาย
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // โหลดข้อมูลจาก API
  loadData() {
    this.apiService.getAllData().subscribe((response: any) => {
      this.data = response;
    });
  }

  getGroup(){
    this.apiService.getAllGroups().subscribe((response: any) => {
      this.data = response;
      console.log(response);
      // สร้างอาร์เรย์ใหม่ที่มีค่า group_id เฉพาะ
      this.groups = this.data.map((item: any) => item.group_id);
      // ลบค่าซ้ำออกจากอาร์เรย์ groups
      this.groups = [...new Set(this.groups)]; // ใช้ Set ในการลบค่าซ้ำ
      console.log(this.groups);
    });
  }

  // สร้างข้อมูลใหม่
  createNewData(newData: any) {
    this.apiService.createData(newData).subscribe(() => {
      this.loadData();
      this.newData = {}; // ล้างข้อมูลใหม่หลังจากสร้างข้อมูลเสร็จสิ้น
      this.addMode = false; // ปิดโหมดเพิ่มข้อมูลหลังจากสร้างข้อมูล
    });
  }
  // อัปเดตข้อมูล
  updateData(device_id: any, updatedData: any) {
    this.apiService.updateData(device_id, updatedData).subscribe(() => {
      this.loadData();
    });
  }

  // ลบข้อมูล
  deleteData(device_id: string) {
    console.log('device_id:', device_id); // ตรวจสอบค่า device_id ในคอลัมน์

    // ใช้ confirm() เพื่อขอยืนยันการลบข้อมูล
    const confirmed = confirm('คุณต้องการลบข้อมูลนี้หรือไม่?');
    if (confirmed) {
      this.apiService.deleteData(device_id).subscribe(() => {
        this.loadData();
      });
    }
  }

  // เริ่มโหมดแก้ไขข้อมูล
  enableEditMode(item: any) {
    this.editMode = true;
    this.editedData = { ...item };
  }

  // บันทึกข้อมูลหลังแก้ไข
  saveData() {
    this.apiService
      .updateData(this.editedData.device_id, this.editedData)
      .subscribe(
        () => {
          this.editMode = false;
          this.loadData();
          this.editedData = {}; // ล้างข้อมูลที่อยู่ใน editedData
        },
        (error) => {
          console.error('เกิดข้อผิดพลาดในระหว่างการบันทึกข้อมูล:', error);
        }
      );
  }

  // ยกเลิกโหมดแก้ไข
  cancelEditMode() {
    this.editMode = false;
    this.editedData = {}; // ล้างข้อมูลที่อยู่ใน editedData
  }

  // เริ่มโหมดเพิ่มข้อมูล
  enableAddMode() {
    this.addMode = true;
  }

  // ยกเลิกโหมดเพิ่มข้อมูล
  cancelAddMode() {
    this.addMode = false;
    this.newData = {}; // ล้างข้อมูลที่กรอกหลังยกเลิก
  }
  reloadPage() {
    // รีโหลดหน้าเว็บ
    location.reload();
  }

  // ฟังก์ชันเปิดโหมดตั้งค่าหน่วยค่าไฟ
  enableUnitCostMode() {
    // ทำการเปิดโหมดตั้งค่าหน่วยค่าไฟ และเรียก Modal ที่คุณสร้างขึ้น
    // เพื่อให้ผู้ใช้กรอกหน่วยค่าไฟ
  }

  // ฟังก์ชันสำหรับการอัปเดตหน่วยค่าไฟ
  saveUnitCost(): void {
    if (this.unitCost !== null && this.isNumeric(this.unitCost)) {
      // ค่าที่คุณกรอก
      console.log('ค่าที่คุณกรอก:', this.unitCost);

      // Use ApiService to update the unit cost
      this.apiService.updateUnitCost(this.unitCost as number).subscribe(
        () => {
          console.log('Unit Cost updated:', this.unitCost);
          alert('อัปเดต Unit Cost สำเร็จ');
        },
        (error) => {
          console.error('เกิดข้อผิดพลาดในการอัปเดต Unit Cost:', error);
          alert('เกิดข้อผิดพลาดในการอัปเดต Unit Cost');
        }
      );
    } else {
      alert('กรุณาใส่ค่าเป็นตัวเลขเท่านั้น');
    }
  }

  enableGroupMode() {
    this.groupMode = true;
  }

  cancelGroupMode() {
    this.groupMode = false;
    this.newGroup = {}; // ล้างข้อมูลที่กรอกหลังยกเลิก
  }

  createNewGroup(newGroup: any) {
    console.log('newGroup before API call:', newGroup);
    this.apiService.createGroup(newGroup).subscribe(() => {
      this.loadData();
      this.newGroup = {}; // Clear the form after creating the group
      this.groupMode = false; // Close the group mode
    });
  }



}

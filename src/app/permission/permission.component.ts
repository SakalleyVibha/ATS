import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonApiService } from '../core/services/common-api.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css',
})
export class PermissionComponent {
 modules:any = [];
 roles: any = []
rolePermission : any = [];

  constructor(private api : CommonApiService){
    this.getRolePermissionList()
    this.getModuleList();
    this.getRoles();
  }

  getRoles(){
    this.api.allgetMethod('role/roles',{}).subscribe({
      next: (res:any)=>{
          if(!res.error){
            console.log(res.data,'roles')
            this.roles = res.data;
          }else{
             console.log(res.error.message || res.error)
          }
      }
    })
  }

  getModuleList(){
    this.api.allPostMethod('rolepermission/getmodulesectionpermission',{})
    .pipe(map((res:any) =>{
      res.data = res.data.map((row:any) => {
        const totalRows = row.section_masters.reduce(
          (rowsCount:any, nextRm:any) => {
            const count = nextRm.permission_masters.length || 1; // need 1 row to show RM cell
            return rowsCount + count;
          }, 0);
        return {
          rowsCount: totalRows,
          ...row,
        };
      });
      return res
    }))
    .subscribe({
      next: (res:any)=>{
          if(!res.error){
            console.log(res.data,'modules')
            this.modules = res.data;
          }else{
             console.log(res.error.message || res.error)
          }
      }
    })
  }
  
  getRolePermissionList(){
    this.api.allPostMethod('rolepermission/getrolepermissions',{}).subscribe({
      next: (res:any)=>{
          if(!res.error){
           this.rolePermission = res.data;
          }else{
             console.log(res.message || res.error)
          }
      }
    })
  }

  onApply(){
    let payload = {
      rolePermissions : this.rolePermission
    }
    this.api.allPostMethod('rolepermission/addeditrolepermission',payload).subscribe({
      next: (res:any)=>{
           if(!res.error){
               console.log('successfully');
           }else{
              console.log(res.error.message || res.errror)
           }
      }
    })
  }

  changeBox(roleId:any,permission:any){
    let index = this.rolePermission.findIndex((v:any) => v.role_id == roleId && v.section_id == permission.section_id && v.module_id == permission.module_id && v.permission_id == permission.id);
     if(index == -1){
       this.rolePermission.push({role_id: roleId,module_id: permission.module_id, section_id: permission.section_id, permission_id: permission.id})
     }else{
         if(this.rolePermission[index].id){
           this.rolePermission[index]['deleted'] = !this.rolePermission[index]['deleted'];
         }else{
          this.rolePermission.splice(index,1)
         }
     }
    }
    checkPermission(roleId:any,permission:any){
      return this.rolePermission.findIndex((v:any) =>  v.deleted != 1 && v.role_id == roleId && v.section_id == permission.section_id && v.module_id == permission.module_id && v.permission_id == permission.id) != -1
    }
}

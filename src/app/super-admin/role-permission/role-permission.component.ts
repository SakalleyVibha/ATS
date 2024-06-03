import { Component } from '@angular/core';
import { map } from 'rxjs';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrl: './role-permission.component.css'
})
export class RolePermissionComponent {
 modules:any = [];
 roles: any = []
 rolePermission : any = [];
 popContent: string = '';
 popTitle: string = '';
 allPemissions:any = [];
 

  constructor(private api : CommonApiService, private communicate: CommunicateService,private toastr: ToastrService){
    this.getRolePermissionList()
    this.getModuleList();
    this.getRoles();
  }

  getRoles(){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('role/roles',{})
    .pipe(map((res:any)=>{
       res.data.forEach((role:any)=>{
          role = this.checkSelectAll(role);
       })
       return res
    }))
    .subscribe({
      next: (res:any)=>{
          if(!res.error){
            this.communicate.isLoaderLoad.next(false);
            this.roles = res.data;
          }else{
            this.communicate.isLoaderLoad.next(false);
             console.log(res.error.message || res.error)
          }
      }
    })
  }

  getModuleList(){
    this.communicate.isLoaderLoad.next(true);
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
            this.communicate.isLoaderLoad.next(false);
            this.modules = res.data;
            this.allPemissions = res.data.flatMap((m:any) => m.section_masters).flatMap((s:any)=> s.permission_masters);
          }else{
            this.communicate.isLoaderLoad.next(false);
             console.log(res.error.message || res.error)
          }
      }
    })
  }
  
  getRolePermissionList(){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('rolepermission/getrolepermissions',{}).subscribe({
      next: (res:any)=>{
          if(!res.error){
            this.communicate.isLoaderLoad.next(false);
           this.rolePermission = res.data;
          }else{
            this.communicate.isLoaderLoad.next(false);
             console.log(res.message || res.error)
          }
      }
    })
  }

  onApply(){
    let payload = {
      rolePermissions : this.rolePermission
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('rolepermission/addeditrolepermission',payload).subscribe({
      next: (res:any)=>{
           if(!res.error){
            this.toastr.success(res.message,"",{closeButton:true,timeOut:2000}).onHidden.subscribe(()=>{
              this.communicate.isLoaderLoad.next(false);
            });           
           }else{
            this.toastr.error(res.message || res.error,"",{closeButton:true,timeOut:3000}).onHidden.subscribe(()=>{
              this.communicate.isLoaderLoad.next(false);
            });
           }
      }
    })
  }

  changeBox(role:any,permission:any){
    let index = this.rolePermission.findIndex((v:any) => v.role_id == role.id && v.section_id == permission.section_id && v.module_id == permission.module_id && v.permission_id == permission.id);
     if(index == -1){
       this.rolePermission.push({role_id: role.id,module_id: permission.module_id, section_id: permission.section_id, permission_id: permission.id})
     }else{
         if(this.rolePermission[index].id){
           this.rolePermission[index]['deleted'] = !this.rolePermission[index]['deleted'];
         }else{
          this.rolePermission.splice(index,1)
         }
        }
     this.checkSelectAll(role)   
    }

    checkPermission(roleId:any,permission:any){
      return this.rolePermission.findIndex((v:any) =>  v.deleted != 1 && v.role_id == roleId && v.section_id == permission.section_id && v.module_id == permission.module_id && v.permission_id == permission.id) != -1
    }
    
    checkAll(role:any){
      role['selectAll'] = !role['selectAll'];
      this.allPemissions.forEach((p:any)=>{
        let index = this.rolePermission.findIndex((v:any) => v.role_id == role.id && v.section_id == p.section_id && v.module_id == p.module_id && v.permission_id == p.id);

        if(index !== -1 && this.rolePermission[index].id){
          this.rolePermission[index]['deleted'] =  !role['selectAll'];
        }else if(role['selectAll'] && index == -1){
            this.rolePermission.push({role_id: role.id,module_id: p.module_id, section_id: p.section_id, permission_id: p.id})
        }else if(!role['selectAll'] && index !== -1){
             this.rolePermission.splice(index,1)
        }
      })
      console.log(this.rolePermission)
    }

    checkSelectAll(role:any){
      role['selectAll'] = this.rolePermission.filter((rp:any) => rp.role_id == role.id && !rp.deleted).length == this.allPemissions.length;
    }
}

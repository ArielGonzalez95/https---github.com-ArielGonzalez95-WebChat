import { Component, OnInit } from '@angular/core';
import { InjectSetupWrapper } from '@angular/core/testing';
import { environment } from '@env/environment';
import { USER_STORAGE_KEY } from '@shared/constants/constant';
import { createClient } from '@supabase/supabase-js';
@Component({
  selector: 'app-perfil-user',
  templateUrl: './perfil-user.component.html',
  styleUrls: ['./perfil-user.component.scss']
})
export class PerfilUserComponent implements OnInit {
  NombreUsuario="";
  localidad="";
  pais="";
  isEnabled = true;
  usuarioExiste = false;
  constructor() { }

  ngOnInit(): void {
    this.obtener();

  }
  async obtener(){
    const supabase = createClient(environment.supabase.url, environment.supabase.publicKey);
    const user = supabase.auth.user()
    const usuario = user?.email;
    let { data: datos, error } = await supabase
  .from('datosUser')
  .select('*')
  .eq('usuariolog',usuario)
  datos?.forEach((elemento, indice, array) => {
    this.NombreUsuario = elemento.nombreUser;
    this.pais = elemento.pais;
    this.localidad = elemento.localidad;
    if(elemento.usuariolog){
      this.usuarioExiste = true;
    }
    
})
    console.log(this.usuarioExiste)
  }
  Edit(){
    this.isEnabled = false;

  }

  guardarCambios(){
    if(!this.usuarioExiste){
      this.insertarNew();
      this.isEnabled = true;

    }
    this.obtener();
    this.UpdateUser();
    this.isEnabled = true;
    
  }

  async UpdateUser(){
  
    const supabase = createClient(environment.supabase.url, environment.supabase.publicKey);
    const user = supabase.auth.user();
    const userLog = user?.email;
    const { data, error } = await supabase
    .from('datosUser')
    .update({ nombreUser: this.NombreUsuario, localidad:this.localidad, pais: this.pais })
    .eq('usuariolog',userLog)

  }

  async insertarNew(){
    console.log('insertaNuevo')
    const supabase = createClient(environment.supabase.url, environment.supabase.publicKey);
    const user = supabase.auth.user();
    const userLog = user?.email;
    console.log(userLog,this.NombreUsuario,this.localidad,this.pais)
    const { data, error } = await supabase
    
    .from('datosUser')
    .insert([
      
      { nombreUser: this.NombreUsuario, localidad:this.localidad, pais: this.pais, usuariolog:userLog },
    ])
  }
}

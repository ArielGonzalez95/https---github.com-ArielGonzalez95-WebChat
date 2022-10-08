import { Component, OnInit } from '@angular/core';
import { InjectSetupWrapper } from '@angular/core/testing';
import { environment } from '@env/environment';
import { USER_STORAGE_KEY } from '@shared/constants/constant';
import { createClient } from '@supabase/supabase-js';
import { ChatService } from '@auth/services/chat.service';
import { promises } from 'dns';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {
  comentarios:string = "";
  textoChat:string="";
  ArrayComentarios = new Array;
  supabase = createClient(environment.supabase.url, environment.supabase.publicKey);
  user = this.supabase.auth.user();
  usuarioActual:any;
  llamadaUser ="";
  constructor(private readonly chat: ChatService) { }

  ngOnInit(): void {
    this.EscucharChat(); 
    
  }
  async insertarNew(){
    const supabase = createClient(environment.supabase.url, environment.supabase.publicKey);
    const { data, error } = await supabase
    .from('comentarios')
    .insert([
      { Comentarios:this.comentarios, user:this.user?.email},
    ])
  }

  EscucharChat(): void{
    const supabase = createClient(environment.supabase.url, environment.supabase.publicKey);
    const user = supabase.auth.user();
  const mySubscription = supabase
  .from('comentarios')
  .on('*', async payload => {
    this.textoChat = payload.new.Comentarios;
    console.log(payload)
   await this.obtener(payload.new.user);
    this.ArrayComentarios.push(this.llamadaUser+":"+this.textoChat);
  })
  .subscribe()
  const subscriptions = supabase.getSubscriptions()
  }


  limpiar(): void {

    this.comentarios = "";
  }
  async obtener(userActual: string){
    const supabase = createClient(environment.supabase.url, environment.supabase.publicKey);
    const user = supabase.auth.user()
    const usuario = user?.email;
    let { data: datos, error } = await supabase
  .from('datosUser')
  .select('nombreUser')
  .eq('usuariolog',userActual)
  datos?.forEach((elemento, indice, array) => {
    console.log(elemento)
    this.llamadaUser = elemento.nombreUser;
  })
}

}


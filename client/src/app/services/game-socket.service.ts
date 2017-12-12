import { Injectable, EventEmitter } from '@angular/core';
import { Game } from '../interfaces/game.interface';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
const BASE_DOMAIN = environment.apiUrl;

@Injectable()
export class GameSocketService {
  socket:any;
  // messages:Array<Message> = [];
  constructor(){
    this.socket = io.connect(`${BASE_DOMAIN}`);

    this.socket.on('recibe-game', function(data:any){
      console.log(`Game Recibido: ${data.name}`);
      // this.messages.push({
      //   user: 'Game',
      //   game: data.game
      // })
    });
  }

  initGame(id){
    console.log(`Iniciando el juego: "${id}"`);
    this.socket.emit('init-game',{
      gameId:id
    })
    // this.messages.push({
    //   user: 'Yo',
    //   message:id
    // })
  }
}

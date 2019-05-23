import { Component, OnInit } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

@Component({
  selector: 'dbvis-echo-test',
  templateUrl: './echo-test.component.html',
  styleUrls: ['./echo-test.component.less']
})
export class EchoTestComponent implements OnInit {

  receivedMessages: string[] = [];

  constructor(private rxStompService: RxStompService) { }

  ngOnInit() {
    this.rxStompService.watch('/topic/echo').subscribe((message: Message) => {
      this.receivedMessages.push(message.body);
    });
  }

  sendMessage() {
    const message = `${new Date()}: test`;

    this.rxStompService.publish({destination: '/topic/echo', body: message});
  }

}

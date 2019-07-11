import * as StompServer from 'stomp-broker-js';

export class MyStompServer {

    private static instance: any;

    public static init(server: any) {
        MyStompServer.instance = new StompServer({
            server: server,
            // debug: console.log,
            path: '/ws',
            // protocol: 'sockjs',
            heartbeat: [2000,2000]
        });

        return MyStompServer.instance;
    }

    public static get() {
        return MyStompServer.instance;
    }
}
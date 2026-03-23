import SockJS from 'sockjs-client';

let client, transport;
transport = {
    async start(serverUrl) {
        client = new SockJS(serverUrl);

        client.onopen = () => {
            console.log(`Connected to notification server on ${serverUrl}`);
        };
        client.onmessage = () => {
            // console.log('Notification sended');
        };
        client.onclose = () => {
            setTimeout(() => {
                this.start(serverUrl);
            }, 5000);
        };
    },
    async send(message, userId) {
        const obj = {
            message,
            userId,
        };
        await client.send(JSON.stringify(obj));
    },
};

class SockJsClient {
    constructor(serverUrl) {
        transport.start(serverUrl);
    }
    async notification(message, userId) {
        await transport.send(message, userId);
    }
}

export default SockJsClient;

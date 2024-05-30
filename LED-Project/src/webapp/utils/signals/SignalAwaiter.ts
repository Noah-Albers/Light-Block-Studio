import { Events, SignalDispatcher } from "./SignalDispatcher";

export function awaitSignal<Key extends keyof Events>(type: Key, timeout?: number) {
    return new Promise((res, rej)=>{

        let timeoutId: NodeJS.Timeout;

        function onTimeout(){
            rej("Did not retreive signal in time");
            SignalDispatcher.off(type, onResolve);
        }
        function onResolve(_: any){
            clearTimeout(timeoutId);
            res(arguments[0]);
        }

        if(timeout !== undefined)
            timeoutId = setTimeout(onTimeout, timeout);

        SignalDispatcher.on(type, onResolve);
    });
}

export function sendSignalAwaitResponse<SendKey extends keyof Events, ResponseKey extends keyof Events>(sendType: SendKey, args: any, responseType: ResponseKey, timeout: number = 500) {
    return new Promise((res,rej)=>{
        awaitSignal(responseType, timeout).then(res).catch(rej);
        SignalDispatcher.emit(sendType, args);
    });
}
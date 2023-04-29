
export interface ILabelItem{
    label:string,
    value:string,
}

export interface IColumn{
    title:string,
    key:string,
    render?:(arg:any)=>any,
}

export interface ICallback<T>{
    (arg:T):any;
}

export interface MyWindow extends Window {
    $message: MessageApiInjection
}

declare var window :MyWindow;


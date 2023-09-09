
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

export interface ISize{
    width:number,
    height:number,
}

export interface IPoint{
    x:number,
    y:number,
}

export interface MyWindow extends Window {
    $message: MessageApiInjection
}

declare var window :MyWindow;

export interface IConsoleResult<T> {
    code: number,
    message: ?string,
    data: ?T,
}
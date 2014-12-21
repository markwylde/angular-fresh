/// <reference path="reference.ts"/>

class JsonAPI implements IApi {
    language = 'English';

    example(message:string) {
        console.log('looks like it worked: ' + message);
    }
}
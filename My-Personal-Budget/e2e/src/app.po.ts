import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-root .homepage .container h1')).getText() as Promise<string>;
  }
  getLoginButton():Promise<string>{
    return element(by.id('loginBtn')).getText() as Promise<string>;
  }
  getSignupButton():Promise<string>{
    return element(by.id('SignUpBtn')).getText() as Promise<string>;
  }
  clickLogin():void{
    element(by.id('loginBtn')).click();
  }
  getloginform():Promise<string>{
    return element(by.css('.user button')).getText() as Promise<string>;
  }
}

'use strict';

require('chromedriver');
const {
  Builder,
  By
} = require('selenium-webdriver');
const {
  Eyes,
  ClassicRunner,
  Target,
  RectangleSize
} = require('@applitools/eyes-selenium');

describe('DemoApp - ClassicRunner', function () {
  let runner, eyes, driver;

  beforeEach(async () => {
    runner = new ClassicRunner();
    eyes = new Eyes(runner);
    driver = await new Builder()
      .forBrowser('chrome')
      .build();
  });

  it('Smoke Test', async () => {
    // Start the test by setting AUT's name, test name and viewport size (width X height)
    await eyes.open(driver, 'DemoApp - ClassicRunner', 'Smoke Test', new RectangleSize(600, 800));

    await driver.get("https://localhost:3000");

    // Visual checkpoint #1 - Check the login page.
    await eyes.check("Login Window", Target.window());

    // This will create a test with two test steps.
    await driver.findElement(By.id("login")).click();

    // Visual checkpoint #2 - Check the app page.
    await eyes.check("App Window", Target.window().fully());
    await eyes.closeAsync();
  });

  afterEach(async () => {
    await driver.quit();
    await eyes.abortIfNotClosed();
    const allTestResults = await runner.getAllTestResults();
    console.log(allTestResults);
  });
});

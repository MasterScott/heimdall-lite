"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("expect-puppeteer");
describe('Google', () => {
    beforeAll(async () => {
        await page.goto('https://github.com/login');
    });
});
it('should fill out the form ', async () => {
    // let text = await page.evaluate(() => document.body.textContent)
    //   await page.click('button')
    await expect(page).toClick('button');
    //await page.type('#input-94', "HELOOOOOOOO")
    it('should fill out the form ', async () => {
        // let text = await page.evaluate(() => document.body.textContent)
        await expect(page).toClick('button', { text: 'login' });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvdGVzdHMvdW5pdC90ZXN0LnNwZWMudHMiLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBeUI7QUFFekIsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFFcEIsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2pCLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0lBQy9DLENBQUMsQ0FBQyxDQUFBO0FBR0EsQ0FBQyxDQUFDLENBQUE7QUFFRixFQUFFLENBQUMsMkJBQTJCLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDekMsa0VBQWtFO0lBQ3JFLCtCQUErQjtJQUM1QixNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7SUFFcEMsNkNBQTZDO0lBR2pELEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN4QyxrRUFBa0U7UUFFakUsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO0lBRTNELENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFDLENBQUEiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvdGVzdHMvdW5pdC90ZXN0LnNwZWMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdleHBlY3QtcHVwcGV0ZWVyJ1xuXG5kZXNjcmliZSgnR29vZ2xlJywgKCkgPT4ge1xuIFxuICAgIGJlZm9yZUFsbChhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHBhZ2UuZ290bygnaHR0cHM6Ly9naXRodWIuY29tL2xvZ2luJylcbiAgICB9KVxuXG5cbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZmlsbCBvdXQgdGhlIGZvcm0gJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBsZXQgdGV4dCA9IGF3YWl0IHBhZ2UuZXZhbHVhdGUoKCkgPT4gZG9jdW1lbnQuYm9keS50ZXh0Q29udGVudClcbiAgICAgLy8gICBhd2FpdCBwYWdlLmNsaWNrKCdidXR0b24nKVxuICAgICAgICBhd2FpdCBleHBlY3QocGFnZSkudG9DbGljaygnYnV0dG9uJylcblxuICAgICAgICAvL2F3YWl0IHBhZ2UudHlwZSgnI2lucHV0LTk0JywgXCJIRUxPT09PT09PT1wiKVxuXG5cbiAgICBpdCgnc2hvdWxkIGZpbGwgb3V0IHRoZSBmb3JtICcsIGFzeW5jICgpID0+IHtcbiAgICAgICAvLyBsZXQgdGV4dCA9IGF3YWl0IHBhZ2UuZXZhbHVhdGUoKCkgPT4gZG9jdW1lbnQuYm9keS50ZXh0Q29udGVudClcbiAgICAgICBcbiAgICAgICAgYXdhaXQgZXhwZWN0KHBhZ2UpLnRvQ2xpY2soJ2J1dHRvbicsIHsgdGV4dDogJ2xvZ2luJyB9KVxuXG4gICAgfSlcbn0pXG5cbiJdLCJ2ZXJzaW9uIjozfQ==
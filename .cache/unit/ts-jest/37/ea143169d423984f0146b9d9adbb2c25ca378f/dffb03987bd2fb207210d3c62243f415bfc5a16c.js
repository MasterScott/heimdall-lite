"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("expect-puppeteer");
describe('Google', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:8080/login');
    });
    it('Fill out login', async () => {
        await expect(page).toFillForm('form[name="saurabform"]', {
            login: 'saurabjdc@gmail.com',
            password: 'password',
        });
    });
    it('Click Login', async () => {
        await expect(page).toClick('button', { text: 'Login' });
        await page.waitForNavigation();
    });
    it('Wait for login', async () => {
        it('should display "google" text on page', async () => {
            let text = await page.evaluate(() => document.body.textContent);
            expect(text).toContain('google');
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvdGVzdHMvdW5pdC90ZXN0LnNwZWMudHMiLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBeUI7QUFFekIsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFFcEIsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2pCLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO0lBQ2xELENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzVCLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsRUFBRTtZQUNyRCxLQUFLLEVBQUUscUJBQXFCO1lBQzVCLFFBQVEsRUFBRSxVQUFVO1NBQ3JCLENBQUMsQ0FBQTtJQUVSLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN6QixNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFDdkQsTUFBTSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUNsQyxDQUFDLENBQUMsQ0FBQTtJQUdGLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM1QixFQUFFLENBQUMsc0NBQXNDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDbEQsSUFBSSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDbEUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNsQyxDQUFDLENBQUMsQ0FBQTtJQUNMLENBQUMsQ0FBQyxDQUFBO0FBRU4sQ0FBQyxDQUFDLENBQUEiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvdGVzdHMvdW5pdC90ZXN0LnNwZWMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdleHBlY3QtcHVwcGV0ZWVyJ1xuXG5kZXNjcmliZSgnR29vZ2xlJywgKCkgPT4ge1xuIFxuICAgIGJlZm9yZUFsbChhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHBhZ2UuZ290bygnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2xvZ2luJylcbiAgICB9KVxuIFxuICAgIGl0KCdGaWxsIG91dCBsb2dpbicsIGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgZXhwZWN0KHBhZ2UpLnRvRmlsbEZvcm0oJ2Zvcm1bbmFtZT1cInNhdXJhYmZvcm1cIl0nLCB7XG4gICAgICAgICAgICBsb2dpbjogJ3NhdXJhYmpkY0BnbWFpbC5jb20nLFxuICAgICAgICAgICAgcGFzc3dvcmQ6ICdwYXNzd29yZCcsXG4gICAgICAgICAgfSlcbiAgICAgICAgXG4gICAgfSlcblxuICAgIGl0KCdDbGljayBMb2dpbicsIGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgZXhwZWN0KHBhZ2UpLnRvQ2xpY2soJ2J1dHRvbicsIHsgdGV4dDogJ0xvZ2luJyB9KVxuICAgICAgICBhd2FpdCBwYWdlLndhaXRGb3JOYXZpZ2F0aW9uKClcbiAgICB9KVxuXG5cbiAgICBpdCgnV2FpdCBmb3IgbG9naW4nLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgZGlzcGxheSBcImdvb2dsZVwiIHRleHQgb24gcGFnZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gYXdhaXQgcGFnZS5ldmFsdWF0ZSgoKSA9PiBkb2N1bWVudC5ib2R5LnRleHRDb250ZW50KVxuICAgICAgICAgZXhwZWN0KHRleHQpLnRvQ29udGFpbignZ29vZ2xlJylcbiAgICAgICB9KVxuICAgIH0pXG5cbn0pIl0sInZlcnNpb24iOjN9
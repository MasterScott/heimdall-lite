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
    });
    it('should display "google" text on page', async () => {
        const page2 = await browser.newPage();
        let text = await page.evaluate(() => document.body.textContent);
        expect(text).toContain('google');
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvdGVzdHMvdW5pdC90ZXN0LnNwZWMudHMiLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBeUI7QUFFekIsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFFcEIsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2pCLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO0lBQ2xELENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzVCLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsRUFBRTtZQUNyRCxLQUFLLEVBQUUscUJBQXFCO1lBQzVCLFFBQVEsRUFBRSxVQUFVO1NBQ3JCLENBQUMsQ0FBQTtJQUVSLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN6QixNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7SUFFM0QsQ0FBQyxDQUFDLENBQUE7SUFHRSxFQUFFLENBQUMsc0NBQXNDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFFbEQsTUFBTSxLQUFLLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFdEMsSUFBSSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbEUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUNsQyxDQUFDLENBQUMsQ0FBQTtBQUdULENBQUMsQ0FBQyxDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIi9Vc2Vycy9zam9zaGkvdGVzdC9oZWltZGFsbC1saXRlL3Rlc3RzL3VuaXQvdGVzdC5zcGVjLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnZXhwZWN0LXB1cHBldGVlcidcblxuZGVzY3JpYmUoJ0dvb2dsZScsICgpID0+IHtcbiBcbiAgICBiZWZvcmVBbGwoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBwYWdlLmdvdG8oJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9sb2dpbicpXG4gICAgfSlcbiBcbiAgICBpdCgnRmlsbCBvdXQgbG9naW4nLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IGV4cGVjdChwYWdlKS50b0ZpbGxGb3JtKCdmb3JtW25hbWU9XCJzYXVyYWJmb3JtXCJdJywge1xuICAgICAgICAgICAgbG9naW46ICdzYXVyYWJqZGNAZ21haWwuY29tJyxcbiAgICAgICAgICAgIHBhc3N3b3JkOiAncGFzc3dvcmQnLFxuICAgICAgICAgIH0pXG4gICAgICAgIFxuICAgIH0pXG5cbiAgICBpdCgnQ2xpY2sgTG9naW4nLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IGV4cGVjdChwYWdlKS50b0NsaWNrKCdidXR0b24nLCB7IHRleHQ6ICdMb2dpbicgfSlcbiAgICAgICAgXG4gICAgfSlcblxuXG4gICAgICAgIGl0KCdzaG91bGQgZGlzcGxheSBcImdvb2dsZVwiIHRleHQgb24gcGFnZScsIGFzeW5jICgpID0+IHtcbiAgXG4gICAgICAgICAgICBjb25zdCBwYWdlMiA9IGF3YWl0IGJyb3dzZXIubmV3UGFnZSgpO1xuXG4gICAgICAgICAgICBsZXQgdGV4dCA9IGF3YWl0IHBhZ2UuZXZhbHVhdGUoKCkgPT4gZG9jdW1lbnQuYm9keS50ZXh0Q29udGVudClcbiAgICAgICAgIGV4cGVjdCh0ZXh0KS50b0NvbnRhaW4oJ2dvb2dsZScpXG4gICAgICAgfSlcblxuXG59KSJdLCJ2ZXJzaW9uIjozfQ==
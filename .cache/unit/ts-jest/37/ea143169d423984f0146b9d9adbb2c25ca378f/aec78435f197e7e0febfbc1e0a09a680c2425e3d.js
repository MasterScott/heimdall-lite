"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("expect-puppeteer");
describe('Google', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:8080/login');
    });
    it('should display "google" text on page', async () => {
        let text = await page.evaluate(() => document.body.textContent);
        await expect(page).toFillForm('form[name="saurabform"]', {
            login: 'James',
            password: 'Bond',
        });
        await expect(page).toClick('button', { text: 'Login' });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvdGVzdHMvdW5pdC90ZXN0LnNwZWMudHMiLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBeUI7QUFFekIsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFFcEIsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2pCLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO0lBQ2xELENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2xELElBQUksSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBRS9ELE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsRUFBRTtZQUNyRCxLQUFLLEVBQUUsT0FBTztZQUNkLFFBQVEsRUFBRSxNQUFNO1NBQ2pCLENBQUMsQ0FBQTtRQUNKLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtJQUMzRCxDQUFDLENBQUMsQ0FBQTtBQUVOLENBQUMsQ0FBQyxDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIi9Vc2Vycy9zam9zaGkvdGVzdC9oZWltZGFsbC1saXRlL3Rlc3RzL3VuaXQvdGVzdC5zcGVjLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnZXhwZWN0LXB1cHBldGVlcidcblxuZGVzY3JpYmUoJ0dvb2dsZScsICgpID0+IHtcbiBcbiAgICBiZWZvcmVBbGwoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBwYWdlLmdvdG8oJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9sb2dpbicpXG4gICAgfSlcbiBcbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgXCJnb29nbGVcIiB0ZXh0IG9uIHBhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGxldCB0ZXh0ID0gYXdhaXQgcGFnZS5ldmFsdWF0ZSgoKSA9PiBkb2N1bWVudC5ib2R5LnRleHRDb250ZW50KVxuXG4gICAgICAgIGF3YWl0IGV4cGVjdChwYWdlKS50b0ZpbGxGb3JtKCdmb3JtW25hbWU9XCJzYXVyYWJmb3JtXCJdJywge1xuICAgICAgICAgICAgbG9naW46ICdKYW1lcycsXG4gICAgICAgICAgICBwYXNzd29yZDogJ0JvbmQnLFxuICAgICAgICAgIH0pXG4gICAgICAgIGF3YWl0IGV4cGVjdChwYWdlKS50b0NsaWNrKCdidXR0b24nLCB7IHRleHQ6ICdMb2dpbicgfSlcbiAgICB9KVxuXG59KSJdLCJ2ZXJzaW9uIjozfQ==
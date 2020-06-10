"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("expect-puppeteer");
describe('Google', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:8080/login');
    });
});
it('should fill out the form ', async () => {
    // let text = await page.evaluate(() => document.body.textContent)
    await expect(page).toFillForm('form[name="saurabform"]', {
        username: 'James',
        password: 'Bond',
    });
    it('should fill out the form ', async () => {
        // let text = await page.evaluate(() => document.body.textContent)
        await expect(page).toClick('button', { text: 'login' });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvdGVzdHMvdW5pdC90ZXN0LnNwZWMudHMiLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBeUI7QUFFekIsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFFcEIsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2pCLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO0lBQ2xELENBQUMsQ0FBQyxDQUFBO0FBR0EsQ0FBQyxDQUFDLENBQUE7QUFFRixFQUFFLENBQUMsMkJBQTJCLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDekMsa0VBQWtFO0lBRWxFLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsRUFBRTtRQUNyRCxRQUFRLEVBQUUsT0FBTztRQUNqQixRQUFRLEVBQUUsTUFBTTtLQUV0QixDQUFDLENBQUE7SUFFSCxFQUFFLENBQUMsMkJBQTJCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDeEMsa0VBQWtFO1FBRWpFLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtJQUUzRCxDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUMsQ0FBQyxDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIi9Vc2Vycy9zam9zaGkvdGVzdC9oZWltZGFsbC1saXRlL3Rlc3RzL3VuaXQvdGVzdC5zcGVjLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnZXhwZWN0LXB1cHBldGVlcidcblxuZGVzY3JpYmUoJ0dvb2dsZScsICgpID0+IHtcbiBcbiAgICBiZWZvcmVBbGwoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBwYWdlLmdvdG8oJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9sb2dpbicpXG4gICAgfSlcblxuXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGZpbGwgb3V0IHRoZSBmb3JtICcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gbGV0IHRleHQgPSBhd2FpdCBwYWdlLmV2YWx1YXRlKCgpID0+IGRvY3VtZW50LmJvZHkudGV4dENvbnRlbnQpXG4gICAgICAgIFxuICAgICAgICBhd2FpdCBleHBlY3QocGFnZSkudG9GaWxsRm9ybSgnZm9ybVtuYW1lPVwic2F1cmFiZm9ybVwiXScsIHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiAnSmFtZXMnLFxuICAgICAgICAgICAgcGFzc3dvcmQ6ICdCb25kJyxcbiBcbiAgICAgfSlcblxuICAgIGl0KCdzaG91bGQgZmlsbCBvdXQgdGhlIGZvcm0gJywgYXN5bmMgKCkgPT4ge1xuICAgICAgIC8vIGxldCB0ZXh0ID0gYXdhaXQgcGFnZS5ldmFsdWF0ZSgoKSA9PiBkb2N1bWVudC5ib2R5LnRleHRDb250ZW50KVxuICAgICAgIFxuICAgICAgICBhd2FpdCBleHBlY3QocGFnZSkudG9DbGljaygnYnV0dG9uJywgeyB0ZXh0OiAnbG9naW4nIH0pXG5cbiAgICB9KVxufSlcblxuIl0sInZlcnNpb24iOjN9
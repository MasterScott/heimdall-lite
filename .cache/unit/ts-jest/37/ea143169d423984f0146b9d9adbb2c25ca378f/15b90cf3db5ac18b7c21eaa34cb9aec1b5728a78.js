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
    await expect(page).toClick('button', { text: 'Sign In' });
    //await page.type('#input-94', "HELOOOOOOOO")
    it('should fill out the form ', async () => {
        // let text = await page.evaluate(() => document.body.textContent)
        await expect(page).toClick('button', { text: 'login' });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvdGVzdHMvdW5pdC90ZXN0LnNwZWMudHMiLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBeUI7QUFFekIsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFFcEIsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2pCLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0lBQy9DLENBQUMsQ0FBQyxDQUFBO0FBR0EsQ0FBQyxDQUFDLENBQUE7QUFFRixFQUFFLENBQUMsMkJBQTJCLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDekMsa0VBQWtFO0lBQ2xFLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQTtJQUV6RCw2Q0FBNkM7SUFHakQsRUFBRSxDQUFDLDJCQUEyQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3hDLGtFQUFrRTtRQUVqRSxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7SUFFM0QsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDLENBQUMsQ0FBQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIvVXNlcnMvc2pvc2hpL3Rlc3QvaGVpbWRhbGwtbGl0ZS90ZXN0cy91bml0L3Rlc3Quc3BlYy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ2V4cGVjdC1wdXBwZXRlZXInXG5cbmRlc2NyaWJlKCdHb29nbGUnLCAoKSA9PiB7XG4gXG4gICAgYmVmb3JlQWxsKGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgcGFnZS5nb3RvKCdodHRwczovL2dpdGh1Yi5jb20vbG9naW4nKVxuICAgIH0pXG5cblxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBmaWxsIG91dCB0aGUgZm9ybSAnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIGxldCB0ZXh0ID0gYXdhaXQgcGFnZS5ldmFsdWF0ZSgoKSA9PiBkb2N1bWVudC5ib2R5LnRleHRDb250ZW50KVxuICAgICAgICBhd2FpdCBleHBlY3QocGFnZSkudG9DbGljaygnYnV0dG9uJywgeyB0ZXh0OiAnU2lnbiBJbicgfSlcblxuICAgICAgICAvL2F3YWl0IHBhZ2UudHlwZSgnI2lucHV0LTk0JywgXCJIRUxPT09PT09PT1wiKVxuXG5cbiAgICBpdCgnc2hvdWxkIGZpbGwgb3V0IHRoZSBmb3JtICcsIGFzeW5jICgpID0+IHtcbiAgICAgICAvLyBsZXQgdGV4dCA9IGF3YWl0IHBhZ2UuZXZhbHVhdGUoKCkgPT4gZG9jdW1lbnQuYm9keS50ZXh0Q29udGVudClcbiAgICAgICBcbiAgICAgICAgYXdhaXQgZXhwZWN0KHBhZ2UpLnRvQ2xpY2soJ2J1dHRvbicsIHsgdGV4dDogJ2xvZ2luJyB9KVxuXG4gICAgfSlcbn0pXG5cbiJdLCJ2ZXJzaW9uIjozfQ==
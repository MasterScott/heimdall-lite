"use strict";
describe('Google', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:8080/login');
    });
    it('should display "google" text on page', async () => {
        let text = await page.evaluate(() => document.body.textContent);
        await page.type('#username', 'username');
        await page.type('#password', 'password');
        expect(text).toContain('google');
    });
    it('should fill out the form ', async () => {
        // let text = await page.evaluate(() => document.body.textContent)
        await expect(page).toFillForm('form[name="saurabform"]', {
            username: 'James',
            password: 'Bond',
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvdGVzdHMvdW5pdC90ZXN0LnNwZWMudHMiLCJtYXBwaW5ncyI6IjtBQUFBLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBRXBCLFNBQVMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNqQixNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtJQUNsRCxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsRCxJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUMvRCxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUNwQyxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN4QyxrRUFBa0U7UUFFakUsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLHlCQUF5QixFQUFFO1lBQ3JELFFBQVEsRUFBRSxPQUFPO1lBQ2pCLFFBQVEsRUFBRSxNQUFNO1NBQ2pCLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBR1YsQ0FBQyxDQUFDLENBQUEiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvdGVzdHMvdW5pdC90ZXN0LnNwZWMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZGVzY3JpYmUoJ0dvb2dsZScsICgpID0+IHtcbiBcbiAgICBiZWZvcmVBbGwoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBwYWdlLmdvdG8oJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9sb2dpbicpXG4gICAgfSlcbiBcbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgXCJnb29nbGVcIiB0ZXh0IG9uIHBhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGxldCB0ZXh0ID0gYXdhaXQgcGFnZS5ldmFsdWF0ZSgoKSA9PiBkb2N1bWVudC5ib2R5LnRleHRDb250ZW50KVxuICAgICAgICBhd2FpdCBwYWdlLnR5cGUoJyN1c2VybmFtZScsICd1c2VybmFtZScpO1xuYXdhaXQgcGFnZS50eXBlKCcjcGFzc3dvcmQnLCAncGFzc3dvcmQnKTtcbiAgICAgICAgZXhwZWN0KHRleHQpLnRvQ29udGFpbignZ29vZ2xlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBmaWxsIG91dCB0aGUgZm9ybSAnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgLy8gbGV0IHRleHQgPSBhd2FpdCBwYWdlLmV2YWx1YXRlKCgpID0+IGRvY3VtZW50LmJvZHkudGV4dENvbnRlbnQpXG4gICAgICAgXG4gICAgICAgIGF3YWl0IGV4cGVjdChwYWdlKS50b0ZpbGxGb3JtKCdmb3JtW25hbWU9XCJzYXVyYWJmb3JtXCJdJywge1xuICAgICAgICAgICAgdXNlcm5hbWU6ICdKYW1lcycsXG4gICAgICAgICAgICBwYXNzd29yZDogJ0JvbmQnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiBcbn0pIl0sInZlcnNpb24iOjN9
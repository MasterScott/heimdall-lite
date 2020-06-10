"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = tslib_1.__importDefault(require("chai"));
const chai_as_promised_1 = tslib_1.__importDefault(require("chai-as-promised"));
chai_1.default.use(chai_as_promised_1.default);
const expect = chai_1.default.expect;
const store_1 = tslib_1.__importDefault(require("../../src/store/store"));
const report_intake_1 = tslib_1.__importDefault(require("../../src/store/report_intake"));
const data_store_1 = tslib_1.__importDefault(require("../../src/store/data_store"));
const vuex_module_decorators_1 = require("vuex-module-decorators");
const fs_1 = require("../util/fs");
const data_filters_1 = tslib_1.__importDefault(require("@/store/data_filters"));
const status_counts_1 = tslib_1.__importDefault(require("@/store/status_counts"));
const fs_2 = require("fs");
// import { shallowMount } from "@vue/test-utils";
describe("Parsing", () => {
    it("Report intake can read every raw file in hdf_data", function () {
        // Give it time!
        jest.setTimeout(0);
        let raw = fs_1.AllRaw();
        let intake = vuex_module_decorators_1.getModule(report_intake_1.default, store_1.default);
        let id = 0;
        let promises = Object.values(raw).map(file_result => {
            // Increment counter
            id += 1;
            // Do intake
            return intake.loadText({
                filename: file_result.name,
                unique_id: id,
                text: file_result.content
            });
        });
        // Done!
        return Promise.all(promises.map(p => expect(p).to.eventually.be.null));
    });
    // Note that the above side effect has LOADED THESE FILES! WE CAN USE THEM IN OTHER TESTS
    it("Counts statuses correctly", function () {
        // Grab modules
        let data = vuex_module_decorators_1.getModule(data_store_1.default, store_1.default);
        let filter = vuex_module_decorators_1.getModule(data_filters_1.default, store_1.default);
        let status_count = vuex_module_decorators_1.getModule(status_counts_1.default, store_1.default);
        // Get the exec files
        let exec_files = data.executionFiles;
        // For each, we will filter then count
        exec_files.forEach(file => {
            // Get the corresponding count file
            let count_filename = `tests/hdf_data/counts/${file.filename}.info.counts`;
            let count_file_content = fs_2.readFileSync(count_filename, "utf-8");
            let counts = JSON.parse(count_file_content);
            // Get the expected counts
            let expected = {
                Failed: counts.failed.total,
                Passed: counts.passed.total,
                "From Profile": 0,
                "Profile Error": counts.error.total,
                "Not Reviewed": counts.skipped.total,
                "Not Applicable": counts.no_impact.total
            };
            let expected_with_filename = {
                filename: file.filename,
                ...expected
            };
            // Get the actual
            let actual = status_count.hash({
                omit_overlayed_controls: true,
                fromFile: file.unique_id
            });
            let actual_with_filename = {
                filename: file.filename,
                ...actual
            };
            // Compare 'em
            expect(actual_with_filename).to.eql(expected_with_filename);
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvdGVzdHMvdW5pdC9wYXJzaW5nX2FuZF9jb3VudGluZy5zcGVjLnRzIiwibWFwcGluZ3MiOiI7OztBQUFBLHdEQUF3QjtBQUN4QixnRkFBZ0Q7QUFDaEQsY0FBSSxDQUFDLEdBQUcsQ0FBQywwQkFBZ0IsQ0FBQyxDQUFDO0FBQzNCLE1BQU0sTUFBTSxHQUFHLGNBQUksQ0FBQyxNQUFNLENBQUM7QUFFM0IsMEVBQTBDO0FBQzFDLDBGQUErRDtBQUMvRCxvRkFBbUQ7QUFDbkQsbUVBQW1EO0FBQ25ELG1DQUFvQztBQUNwQyxnRkFBc0Q7QUFDdEQsa0ZBQXNFO0FBQ3RFLDJCQUFrQztBQUNsQyxrREFBa0Q7QUFFbEQsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7SUFDdkIsRUFBRSxDQUFDLG1EQUFtRCxFQUFFO1FBQ3RELGdCQUFnQjtRQUNoQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLElBQUksR0FBRyxHQUFHLFdBQU0sRUFBRSxDQUFDO1FBQ25CLElBQUksTUFBTSxHQUFHLGtDQUFTLENBQUMsdUJBQWtCLEVBQUUsZUFBSyxDQUFDLENBQUM7UUFDbEQsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRVgsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDbEQsb0JBQW9CO1lBQ3BCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFUixZQUFZO1lBQ1osT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUNyQixRQUFRLEVBQUUsV0FBVyxDQUFDLElBQUk7Z0JBQzFCLFNBQVMsRUFBRSxFQUFFO2dCQUNiLElBQUksRUFBRSxXQUFXLENBQUMsT0FBTzthQUMxQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVE7UUFDUixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUMsQ0FBQyxDQUFDO0lBRUgseUZBQXlGO0lBRXpGLEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtRQUM5QixlQUFlO1FBQ2YsSUFBSSxJQUFJLEdBQUcsa0NBQVMsQ0FBQyxvQkFBUyxFQUFFLGVBQUssQ0FBQyxDQUFDO1FBQ3ZDLElBQUksTUFBTSxHQUFHLGtDQUFTLENBQUMsc0JBQWtCLEVBQUUsZUFBSyxDQUFDLENBQUM7UUFDbEQsSUFBSSxZQUFZLEdBQUcsa0NBQVMsQ0FBQyx1QkFBaUIsRUFBRSxlQUFLLENBQUMsQ0FBQztRQUV2RCxxQkFBcUI7UUFDckIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUVyQyxzQ0FBc0M7UUFDdEMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QixtQ0FBbUM7WUFDbkMsSUFBSSxjQUFjLEdBQUcseUJBQXlCLElBQUksQ0FBQyxRQUFRLGNBQWMsQ0FBQztZQUMxRSxJQUFJLGtCQUFrQixHQUFHLGlCQUFZLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQy9ELElBQUksTUFBTSxHQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUVqRCwwQkFBMEI7WUFDMUIsSUFBSSxRQUFRLEdBQWU7Z0JBQ3pCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUs7Z0JBQzNCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUs7Z0JBQzNCLGNBQWMsRUFBRSxDQUFDO2dCQUNqQixlQUFlLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLO2dCQUNuQyxjQUFjLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLO2dCQUNwQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUs7YUFDekMsQ0FBQztZQUVGLElBQUksc0JBQXNCLEdBQUc7Z0JBQzNCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDdkIsR0FBRyxRQUFRO2FBQ1osQ0FBQztZQUVGLGlCQUFpQjtZQUNqQixJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO2dCQUM3Qix1QkFBdUIsRUFBRSxJQUFJO2dCQUM3QixRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVM7YUFDekIsQ0FBQyxDQUFDO1lBRUgsSUFBSSxvQkFBb0IsR0FBRztnQkFDekIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixHQUFHLE1BQU07YUFDVixDQUFDO1lBRUYsY0FBYztZQUNkLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUM5RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvdGVzdHMvdW5pdC9wYXJzaW5nX2FuZF9jb3VudGluZy5zcGVjLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgY2hhaV9hc19wcm9taXNlZCBmcm9tIFwiY2hhaS1hcy1wcm9taXNlZFwiO1xuY2hhaS51c2UoY2hhaV9hc19wcm9taXNlZCk7XG5jb25zdCBleHBlY3QgPSBjaGFpLmV4cGVjdDtcblxuaW1wb3J0IFN0b3JlIGZyb20gXCIuLi8uLi9zcmMvc3RvcmUvc3RvcmVcIjtcbmltcG9ydCBSZXBvcnRJbnRha2VNb2R1bGUgZnJvbSBcIi4uLy4uL3NyYy9zdG9yZS9yZXBvcnRfaW50YWtlXCI7XG5pbXBvcnQgRGF0YVN0b3JlIGZyb20gXCIuLi8uLi9zcmMvc3RvcmUvZGF0YV9zdG9yZVwiO1xuaW1wb3J0IHsgZ2V0TW9kdWxlIH0gZnJvbSBcInZ1ZXgtbW9kdWxlLWRlY29yYXRvcnNcIjtcbmltcG9ydCB7IEFsbFJhdyB9IGZyb20gXCIuLi91dGlsL2ZzXCI7XG5pbXBvcnQgRmlsdGVyZWREYXRhTW9kdWxlIGZyb20gXCJAL3N0b3JlL2RhdGFfZmlsdGVyc1wiO1xuaW1wb3J0IFN0YXR1c0NvdW50TW9kdWxlLCB7IFN0YXR1c0hhc2ggfSBmcm9tIFwiQC9zdG9yZS9zdGF0dXNfY291bnRzXCI7XG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tIFwiZnNcIjtcbi8vIGltcG9ydCB7IHNoYWxsb3dNb3VudCB9IGZyb20gXCJAdnVlL3Rlc3QtdXRpbHNcIjtcblxuZGVzY3JpYmUoXCJQYXJzaW5nXCIsICgpID0+IHtcbiAgaXQoXCJSZXBvcnQgaW50YWtlIGNhbiByZWFkIGV2ZXJ5IHJhdyBmaWxlIGluIGhkZl9kYXRhXCIsIGZ1bmN0aW9uKCkge1xuICAgIC8vIEdpdmUgaXQgdGltZSFcbiAgICBqZXN0LnNldFRpbWVvdXQoMCk7XG4gICAgbGV0IHJhdyA9IEFsbFJhdygpO1xuICAgIGxldCBpbnRha2UgPSBnZXRNb2R1bGUoUmVwb3J0SW50YWtlTW9kdWxlLCBTdG9yZSk7XG4gICAgbGV0IGlkID0gMDtcblxuICAgIGxldCBwcm9taXNlcyA9IE9iamVjdC52YWx1ZXMocmF3KS5tYXAoZmlsZV9yZXN1bHQgPT4ge1xuICAgICAgLy8gSW5jcmVtZW50IGNvdW50ZXJcbiAgICAgIGlkICs9IDE7XG5cbiAgICAgIC8vIERvIGludGFrZVxuICAgICAgcmV0dXJuIGludGFrZS5sb2FkVGV4dCh7XG4gICAgICAgIGZpbGVuYW1lOiBmaWxlX3Jlc3VsdC5uYW1lLFxuICAgICAgICB1bmlxdWVfaWQ6IGlkLFxuICAgICAgICB0ZXh0OiBmaWxlX3Jlc3VsdC5jb250ZW50XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIERvbmUhXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzLm1hcChwID0+IGV4cGVjdChwKS50by5ldmVudHVhbGx5LmJlLm51bGwpKTtcbiAgfSk7XG5cbiAgLy8gTm90ZSB0aGF0IHRoZSBhYm92ZSBzaWRlIGVmZmVjdCBoYXMgTE9BREVEIFRIRVNFIEZJTEVTISBXRSBDQU4gVVNFIFRIRU0gSU4gT1RIRVIgVEVTVFNcblxuICBpdChcIkNvdW50cyBzdGF0dXNlcyBjb3JyZWN0bHlcIiwgZnVuY3Rpb24oKSB7XG4gICAgLy8gR3JhYiBtb2R1bGVzXG4gICAgbGV0IGRhdGEgPSBnZXRNb2R1bGUoRGF0YVN0b3JlLCBTdG9yZSk7XG4gICAgbGV0IGZpbHRlciA9IGdldE1vZHVsZShGaWx0ZXJlZERhdGFNb2R1bGUsIFN0b3JlKTtcbiAgICBsZXQgc3RhdHVzX2NvdW50ID0gZ2V0TW9kdWxlKFN0YXR1c0NvdW50TW9kdWxlLCBTdG9yZSk7XG5cbiAgICAvLyBHZXQgdGhlIGV4ZWMgZmlsZXNcbiAgICBsZXQgZXhlY19maWxlcyA9IGRhdGEuZXhlY3V0aW9uRmlsZXM7XG5cbiAgICAvLyBGb3IgZWFjaCwgd2Ugd2lsbCBmaWx0ZXIgdGhlbiBjb3VudFxuICAgIGV4ZWNfZmlsZXMuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgIC8vIEdldCB0aGUgY29ycmVzcG9uZGluZyBjb3VudCBmaWxlXG4gICAgICBsZXQgY291bnRfZmlsZW5hbWUgPSBgdGVzdHMvaGRmX2RhdGEvY291bnRzLyR7ZmlsZS5maWxlbmFtZX0uaW5mby5jb3VudHNgO1xuICAgICAgbGV0IGNvdW50X2ZpbGVfY29udGVudCA9IHJlYWRGaWxlU3luYyhjb3VudF9maWxlbmFtZSwgXCJ1dGYtOFwiKTtcbiAgICAgIGxldCBjb3VudHM6IGFueSA9IEpTT04ucGFyc2UoY291bnRfZmlsZV9jb250ZW50KTtcblxuICAgICAgLy8gR2V0IHRoZSBleHBlY3RlZCBjb3VudHNcbiAgICAgIGxldCBleHBlY3RlZDogU3RhdHVzSGFzaCA9IHtcbiAgICAgICAgRmFpbGVkOiBjb3VudHMuZmFpbGVkLnRvdGFsLFxuICAgICAgICBQYXNzZWQ6IGNvdW50cy5wYXNzZWQudG90YWwsXG4gICAgICAgIFwiRnJvbSBQcm9maWxlXCI6IDAsXG4gICAgICAgIFwiUHJvZmlsZSBFcnJvclwiOiBjb3VudHMuZXJyb3IudG90YWwsXG4gICAgICAgIFwiTm90IFJldmlld2VkXCI6IGNvdW50cy5za2lwcGVkLnRvdGFsLFxuICAgICAgICBcIk5vdCBBcHBsaWNhYmxlXCI6IGNvdW50cy5ub19pbXBhY3QudG90YWxcbiAgICAgIH07XG5cbiAgICAgIGxldCBleHBlY3RlZF93aXRoX2ZpbGVuYW1lID0ge1xuICAgICAgICBmaWxlbmFtZTogZmlsZS5maWxlbmFtZSxcbiAgICAgICAgLi4uZXhwZWN0ZWRcbiAgICAgIH07XG5cbiAgICAgIC8vIEdldCB0aGUgYWN0dWFsXG4gICAgICBsZXQgYWN0dWFsID0gc3RhdHVzX2NvdW50Lmhhc2goe1xuICAgICAgICBvbWl0X292ZXJsYXllZF9jb250cm9sczogdHJ1ZSxcbiAgICAgICAgZnJvbUZpbGU6IGZpbGUudW5pcXVlX2lkXG4gICAgICB9KTtcblxuICAgICAgbGV0IGFjdHVhbF93aXRoX2ZpbGVuYW1lID0ge1xuICAgICAgICBmaWxlbmFtZTogZmlsZS5maWxlbmFtZSxcbiAgICAgICAgLi4uYWN0dWFsXG4gICAgICB9O1xuXG4gICAgICAvLyBDb21wYXJlICdlbVxuICAgICAgZXhwZWN0KGFjdHVhbF93aXRoX2ZpbGVuYW1lKS50by5lcWwoZXhwZWN0ZWRfd2l0aF9maWxlbmFtZSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXSwidmVyc2lvbiI6M30=
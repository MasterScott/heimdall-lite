"use strict";
/* Provides async wrappers over various common functions/tasks */
Object.defineProperty(exports, "__esModule", { value: true });
/** Provides the resulting text of reading a file as a promise */
async function read_file_async(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reader.abort();
            reject(new DOMException("Problem parsing input file."));
        };
        reader.onload = () => {
            if (reader.result !== null && reader.result !== undefined) {
                resolve(reader.result.toString());
            }
            else {
                reject(new DOMException("Problem parsing input file."));
            }
        };
        reader.readAsText(file);
    });
}
exports.read_file_async = read_file_async;
/** Checks that a value is not null or undefined at a singular point.
 * Provides easy tracking of where data constraints aren't satisfied.
 */
function defined(x) {
    if (x === null || x === undefined) {
        throw new Error("Value must not be null/undefined");
    }
    else {
        return x;
    }
}
exports.defined = defined;
/** Sleeps for a given # of milliseconds */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.delay = delay;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvc3JjL3V0aWxpdGllcy9hc3luY191dGlsLnRzIiwibWFwcGluZ3MiOiI7QUFBQSxpRUFBaUU7O0FBRWpFLGlFQUFpRTtBQUMxRCxLQUFLLFVBQVUsZUFBZSxDQUFDLElBQVU7SUFDOUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztJQUNoQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO1lBQ3BCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNmLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDO1FBRUYsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7WUFDbkIsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLElBQUksSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtnQkFDekQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzthQUNuQztpQkFBTTtnQkFDTCxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO2FBQ3pEO1FBQ0gsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFqQkQsMENBaUJDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixPQUFPLENBQUksQ0FBdUI7SUFDaEQsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7UUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0tBQ3JEO1NBQU07UUFDTCxPQUFPLENBQUMsQ0FBQztLQUNWO0FBQ0gsQ0FBQztBQU5ELDBCQU1DO0FBRUQsMkNBQTJDO0FBQzNDLFNBQWdCLEtBQUssQ0FBQyxFQUFVO0lBQzlCLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekQsQ0FBQztBQUZELHNCQUVDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIi9Vc2Vycy9zam9zaGkvdGVzdC9oZWltZGFsbC1saXRlL3NyYy91dGlsaXRpZXMvYXN5bmNfdXRpbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBQcm92aWRlcyBhc3luYyB3cmFwcGVycyBvdmVyIHZhcmlvdXMgY29tbW9uIGZ1bmN0aW9ucy90YXNrcyAqL1xuXG4vKiogUHJvdmlkZXMgdGhlIHJlc3VsdGluZyB0ZXh0IG9mIHJlYWRpbmcgYSBmaWxlIGFzIGEgcHJvbWlzZSAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRfZmlsZV9hc3luYyhmaWxlOiBGaWxlKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHtcbiAgICAgIHJlYWRlci5hYm9ydCgpO1xuICAgICAgcmVqZWN0KG5ldyBET01FeGNlcHRpb24oXCJQcm9ibGVtIHBhcnNpbmcgaW5wdXQgZmlsZS5cIikpO1xuICAgIH07XG5cbiAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xuICAgICAgaWYgKHJlYWRlci5yZXN1bHQgIT09IG51bGwgJiYgcmVhZGVyLnJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdC50b1N0cmluZygpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKFwiUHJvYmxlbSBwYXJzaW5nIGlucHV0IGZpbGUuXCIpKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuICB9KTtcbn1cblxuLyoqIENoZWNrcyB0aGF0IGEgdmFsdWUgaXMgbm90IG51bGwgb3IgdW5kZWZpbmVkIGF0IGEgc2luZ3VsYXIgcG9pbnQuXG4gKiBQcm92aWRlcyBlYXN5IHRyYWNraW5nIG9mIHdoZXJlIGRhdGEgY29uc3RyYWludHMgYXJlbid0IHNhdGlzZmllZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZWQ8VD4oeDogVCB8IG51bGwgfCB1bmRlZmluZWQpOiBUIHtcbiAgaWYgKHggPT09IG51bGwgfHwgeCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVmFsdWUgbXVzdCBub3QgYmUgbnVsbC91bmRlZmluZWRcIik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHg7XG4gIH1cbn1cblxuLyoqIFNsZWVwcyBmb3IgYSBnaXZlbiAjIG9mIG1pbGxpc2Vjb25kcyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuIl0sInZlcnNpb24iOjN9
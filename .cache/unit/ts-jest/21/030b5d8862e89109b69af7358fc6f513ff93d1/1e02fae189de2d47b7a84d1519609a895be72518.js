"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sts_1 = tslib_1.__importDefault(require("aws-sdk/clients/sts"));
const s3_1 = tslib_1.__importDefault(require("aws-sdk/clients/s3"));
exports.AUTH_DURATION = 8 * 60 * 60; // 8 hours
/** Fetches the described S3 file using the given creds.
 * Yields the string contents on success
 * Yields the AWS error on failure
 */
async function fetch_s3_file(creds, file_key, bucket_name) {
    // Fetch it from s3, and promise to submit it to be loaded afterwards
    return new s3_1.default({ ...creds })
        .getObject({
        Key: file_key,
        Bucket: bucket_name
    })
        .promise()
        .then(success => {
        let content = new TextDecoder("utf-8").decode(success.Body);
        return content;
    });
}
exports.fetch_s3_file = fetch_s3_file;
async function list_buckets(creds) {
    return new s3_1.default({ ...creds })
        .listBuckets()
        .promise()
        .then(success => {
        throw "Not implemented";
    }, failure => {
        throw "Not implemented";
    });
    // */
}
exports.list_buckets = list_buckets;
/** Attempts to deduce the virtual mfa device serial code from the provided */
function derive_mfa_serial(user_access_token) {
    if (user_access_token) {
        return user_access_token.replace(":user", ":mfa");
    }
    else {
        return null;
    }
}
exports.derive_mfa_serial = derive_mfa_serial;
/** Attempts to retrieve an aws temporary session using the given information.
 * Yields the session info on success.
 * Yields the AWS error on failure.
 */
async function get_session_token(access_token, secret_key, duration, mfa_info) {
    // Instanciate STS with our base and secret token
    let sts = new sts_1.default({
        accessKeyId: access_token,
        secretAccessKey: secret_key
    });
    // Get the user info
    let wip_info = {};
    await sts
        .getCallerIdentity({})
        .promise()
        .then(success => {
        wip_info.user_account = success.Account;
        wip_info.user_arn = success.Arn;
        wip_info.user_id = success.UserId;
        // Guess at mfa
        wip_info.probable_user_mfa_device = derive_mfa_serial(wip_info.user_arn);
    });
    // It's built - mark as such
    let info = wip_info;
    // Make our request to be the role
    let result;
    if (mfa_info) {
        mfa_info.SerialNumber =
            mfa_info.SerialNumber || info.probable_user_mfa_device; // We cannot get to this stage if
        result = sts
            .getSessionToken({
            DurationSeconds: duration,
            SerialNumber: mfa_info.SerialNumber,
            TokenCode: mfa_info.TokenCode
        })
            .promise();
    }
    else {
        // Not strictly necessary but why not!
        result = sts.getSessionToken().promise();
    }
    // Handle the response. On Success, save the creds. On error, throw that stuff back!
    return await result.then(success => {
        let creds = {
            accessKeyId: success.Credentials.AccessKeyId,
            secretAccessKey: success.Credentials.SecretAccessKey,
            sessionToken: success.Credentials.SessionToken
        };
        return {
            creds,
            info,
            from_mfa: !!mfa_info
        };
    });
}
exports.get_session_token = get_session_token;
/** Generates human readable versions of common AWS error codes.
 * If the code is not recognized, coughs it back up as an error
 */
function transcribe_error(error) {
    // Unpack
    let { code, message } = error;
    // Get what we're supposed to do with it
    switch (code) {
        case "TokenRefreshRequired":
        case "ExpiredToken":
            return "Authorization expired. Please log back in.";
        case "InvalidAccessKeyId":
            return "Provided access key is invalid.";
        case "AccessDenied":
            return `Access denied. This likely means that your account does not have access to the specified bucket, or that it requires MFA authentication.`;
        case "AccountProblem":
            return `Account problem detected: ${message}`;
        case "CredentialsNotSupported":
            return "Provided credentials not supported.";
        case "InvalidBucketName":
            return "Invalid bucket name! Please ensure you spelled it correctly.";
        case "NetworkingError":
            return "Networking error. This may be because the provided bucket name does not exist. Please ensure you have spelled it correctly.";
        case "InvalidBucketState":
            return "Invalid bucket state! Contact your AWS administrator.";
        case "ValidationError":
            return `Further validation required: ${message}`;
        case "SignatureDoesNotMatch":
            return "The provided secret token does not match access token. Please ensure that it is correct.";
        case "InvalidToken":
            return "Your session token has expired. Please log back in and try again.";
        case "InvalidClientTokenId":
            return "The provided access token is invalid. Please ensure that it is correct.";
        default:
            return `Unkown error ${code}. Message: ${message}`;
    }
}
exports.transcribe_error = transcribe_error;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvc3JjL3V0aWxpdGllcy9hd3NfdXRpbC50cyIsIm1hcHBpbmdzIjoiOzs7QUFBQSxzRUFBc0M7QUFDdEMsb0VBQW9DO0FBSXZCLFFBQUEsYUFBYSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsVUFBVTtBQXlCcEQ7OztHQUdHO0FBQ0ksS0FBSyxVQUFVLGFBQWEsQ0FDakMsS0FBZ0IsRUFDaEIsUUFBZ0IsRUFDaEIsV0FBbUI7SUFFbkIscUVBQXFFO0lBQ3JFLE9BQU8sSUFBSSxZQUFFLENBQUMsRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDO1NBQ3hCLFNBQVMsQ0FBQztRQUNULEdBQUcsRUFBRSxRQUFRO1FBQ2IsTUFBTSxFQUFFLFdBQVc7S0FDcEIsQ0FBQztTQUNELE9BQU8sRUFBRTtTQUNULElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNkLElBQUksT0FBTyxHQUFXLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FDbkQsT0FBTyxDQUFDLElBQW1CLENBQzVCLENBQUM7UUFDRixPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFsQkQsc0NBa0JDO0FBRU0sS0FBSyxVQUFVLFlBQVksQ0FBQyxLQUFnQjtJQUNqRCxPQUFPLElBQUksWUFBRSxDQUFDLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQztTQUN4QixXQUFXLEVBQUU7U0FDYixPQUFPLEVBQUU7U0FDVCxJQUFJLENBQ0gsT0FBTyxDQUFDLEVBQUU7UUFDUixNQUFNLGlCQUFpQixDQUFDO0lBQzFCLENBQUMsRUFDRCxPQUFPLENBQUMsRUFBRTtRQUNSLE1BQU0saUJBQWlCLENBQUM7SUFDMUIsQ0FBQyxDQUNGLENBQUM7SUFFSixLQUFLO0FBQ1AsQ0FBQztBQWRELG9DQWNDO0FBUUQsOEVBQThFO0FBQzlFLFNBQWdCLGlCQUFpQixDQUFDLGlCQUF5QjtJQUN6RCxJQUFJLGlCQUFpQixF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QW1CO1lBQ3RCLE9BQU8sOERBQThELENBQUM7UUFDeEUsS0FBSyxpQkFBaUI7WUFDcEIsT0FBTyw2SEFBNkgsQ0FBQztRQUN2SSxLQUFLLG9CQUFvQjtZQUN2QixPQUFPLHVEQUF1RCxDQUFDO1FBQ2pFLEtBQUssaUJBQWlCO1lBQ3BCLE9BQU8sZ0NBQWdDLE9BQU8sRUFBRSxDQUFDO1FBQ25ELEtBQUssdUJBQXVCO1lBQzFCLE9BQU8sMEZBQTBGLENBQUM7UUFDcEcsS0FBSyxjQUFjO1lBQ2pCLE9BQU8sbUVBQW1FLENBQUM7UUFDN0UsS0FBSyxzQkFBc0I7WUFDekIsT0FBTyx5RUFBeUUsQ0FBQztRQUNuRjtZQUNFLE9BQU8sZ0JBQWdCLElBQUksY0FBYyxPQUFPLEVBQUUsQ0FBQztLQUN0RDtBQUNILENBQUM7QUFsQ0QsNENBa0NDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIi9Vc2Vycy9zam9zaGkvdGVzdC9oZWltZGFsbC1saXRlL3NyYy91dGlsaXRpZXMvYXdzX3V0aWwudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNUUyBmcm9tIFwiYXdzLXNkay9jbGllbnRzL3N0c1wiO1xuaW1wb3J0IFMzIGZyb20gXCJhd3Mtc2RrL2NsaWVudHMvczNcIjtcbmltcG9ydCB7IEFXU0Vycm9yIH0gZnJvbSBcImF3cy1zZGsvbGliL2Vycm9yXCI7XG5pbXBvcnQgeyBQcm9taXNlUmVzdWx0IH0gZnJvbSBcImF3cy1zZGsvbGliL3JlcXVlc3RcIjtcblxuZXhwb3J0IGNvbnN0IEFVVEhfRFVSQVRJT04gPSA4ICogNjAgKiA2MDsgLy8gOCBob3Vyc1xuXG4vKiogcmVwcmVzZW50cyB0aGUgYXV0aCBjcmVkZW50aWFscyBmb3IgYXdzIHN0dWZmICovXG5leHBvcnQgaW50ZXJmYWNlIEF1dGhDcmVkcyB7XG4gIGFjY2Vzc0tleUlkOiBzdHJpbmc7XG4gIHNlY3JldEFjY2Vzc0tleTogc3RyaW5nO1xuICBzZXNzaW9uVG9rZW46IHN0cmluZztcbn1cblxuLyoqIHJlcHJlc2VudHMgdGhlIGluZm9ybWF0aW9uIG9mIHRoZSBjdXJyZW50IHVzZWQgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXV0aEluZm8ge1xuICBleHBpcmF0aW9uPzogRGF0ZTtcbiAgdXNlcl9hY2NvdW50OiBzdHJpbmc7XG4gIHVzZXJfYXJuOiBzdHJpbmc7XG4gIHByb2JhYmxlX3VzZXJfbWZhX2RldmljZTogc3RyaW5nIHwgbnVsbDsgLy8gTnVsbCBpbXBsaWVzIGl0IGNvdWxkIG5vdCBiZSBkZWR1Y2VkXG4gIHVzZXJfaWQ6IHN0cmluZztcbn1cblxuLyoqIGJ1bmRsZXMgdGhlIGFib3ZlIHR3byAqL1xuZXhwb3J0IGludGVyZmFjZSBBdXRoIHtcbiAgY3JlZHM6IEF1dGhDcmVkcztcbiAgaW5mbzogQXV0aEluZm87XG4gIGZyb21fbWZhOiBib29sZWFuO1xufVxuXG4vKiogRmV0Y2hlcyB0aGUgZGVzY3JpYmVkIFMzIGZpbGUgdXNpbmcgdGhlIGdpdmVuIGNyZWRzLlxuICogWWllbGRzIHRoZSBzdHJpbmcgY29udGVudHMgb24gc3VjY2Vzc1xuICogWWllbGRzIHRoZSBBV1MgZXJyb3Igb24gZmFpbHVyZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hfczNfZmlsZShcbiAgY3JlZHM6IEF1dGhDcmVkcyxcbiAgZmlsZV9rZXk6IHN0cmluZyxcbiAgYnVja2V0X25hbWU6IHN0cmluZ1xuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgLy8gRmV0Y2ggaXQgZnJvbSBzMywgYW5kIHByb21pc2UgdG8gc3VibWl0IGl0IHRvIGJlIGxvYWRlZCBhZnRlcndhcmRzXG4gIHJldHVybiBuZXcgUzMoeyAuLi5jcmVkcyB9KVxuICAgIC5nZXRPYmplY3Qoe1xuICAgICAgS2V5OiBmaWxlX2tleSxcbiAgICAgIEJ1Y2tldDogYnVja2V0X25hbWVcbiAgICB9KVxuICAgIC5wcm9taXNlKClcbiAgICAudGhlbihzdWNjZXNzID0+IHtcbiAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPSBuZXcgVGV4dERlY29kZXIoXCJ1dGYtOFwiKS5kZWNvZGUoXG4gICAgICAgIHN1Y2Nlc3MuQm9keSEgYXMgVWludDhBcnJheVxuICAgICAgKTtcbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbGlzdF9idWNrZXRzKGNyZWRzOiBBdXRoQ3JlZHMpIHtcbiAgcmV0dXJuIG5ldyBTMyh7IC4uLmNyZWRzIH0pXG4gICAgLmxpc3RCdWNrZXRzKClcbiAgICAucHJvbWlzZSgpXG4gICAgLnRoZW4oXG4gICAgICBzdWNjZXNzID0+IHtcbiAgICAgICAgdGhyb3cgXCJOb3QgaW1wbGVtZW50ZWRcIjtcbiAgICAgIH0sXG4gICAgICBmYWlsdXJlID0+IHtcbiAgICAgICAgdGhyb3cgXCJOb3QgaW1wbGVtZW50ZWRcIjtcbiAgICAgIH1cbiAgICApO1xuXG4gIC8vICovXG59XG5cbi8qKiBSZXByZXNlbnRzIHRoZSBidW5kbGUgb2YgcGFyYW1ldGVycyByZXF1aXJlZCBmb3IgY3JlYXRpbmcgYSBzZXNzaW9uIGtleSB1c2luZyBNRkEgKi9cbmV4cG9ydCBpbnRlcmZhY2UgTUZBX0luZm8ge1xuICBTZXJpYWxOdW1iZXI6IHN0cmluZyB8IG51bGw7IC8vIElmIG51bGwsIHVzZSBkZWR1Y2VkIHRva2VuXG4gIFRva2VuQ29kZTogc3RyaW5nO1xufVxuXG4vKiogQXR0ZW1wdHMgdG8gZGVkdWNlIHRoZSB2aXJ0dWFsIG1mYSBkZXZpY2Ugc2VyaWFsIGNvZGUgZnJvbSB0aGUgcHJvdmlkZWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVfbWZhX3NlcmlhbCh1c2VyX2FjY2Vzc190b2tlbjogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICh1c2VyX2FjY2Vzc190b2tlbikge1xuICAgIHJldHVybiB1c2VyX2FjY2Vzc190b2tlbi5yZXBsYWNlKFwiOnVzZXJcIiwgXCI6bWZhXCIpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKiBBdHRlbXB0cyB0byByZXRyaWV2ZSBhbiBhd3MgdGVtcG9yYXJ5IHNlc3Npb24gdXNpbmcgdGhlIGdpdmVuIGluZm9ybWF0aW9uLlxuICogWWllbGRzIHRoZSBzZXNzaW9uIGluZm8gb24gc3VjY2Vzcy5cbiAqIFlpZWxkcyB0aGUgQVdTIGVycm9yIG9uIGZhaWx1cmUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRfc2Vzc2lvbl90b2tlbihcbiAgYWNjZXNzX3Rva2VuOiBzdHJpbmcsXG4gIHNlY3JldF9rZXk6IHN0cmluZyxcbiAgZHVyYXRpb246IG51bWJlcixcbiAgbWZhX2luZm8/OiBNRkFfSW5mb1xuKTogUHJvbWlzZTxBdXRoPiB7XG4gIC8vIEluc3RhbmNpYXRlIFNUUyB3aXRoIG91ciBiYXNlIGFuZCBzZWNyZXQgdG9rZW5cbiAgbGV0IHN0cyA9IG5ldyBTVFMoe1xuICAgIGFjY2Vzc0tleUlkOiBhY2Nlc3NfdG9rZW4sXG4gICAgc2VjcmV0QWNjZXNzS2V5OiBzZWNyZXRfa2V5XG4gIH0pO1xuXG4gIC8vIEdldCB0aGUgdXNlciBpbmZvXG4gIGxldCB3aXBfaW5mbzogUGFydGlhbDxBdXRoSW5mbz4gPSB7fTtcbiAgYXdhaXQgc3RzXG4gICAgLmdldENhbGxlcklkZW50aXR5KHt9KVxuICAgIC5wcm9taXNlKClcbiAgICAudGhlbihzdWNjZXNzID0+IHtcbiAgICAgIHdpcF9pbmZvLnVzZXJfYWNjb3VudCA9IHN1Y2Nlc3MuQWNjb3VudCE7XG4gICAgICB3aXBfaW5mby51c2VyX2FybiA9IHN1Y2Nlc3MuQXJuITtcbiAgICAgIHdpcF9pbmZvLnVzZXJfaWQgPSBzdWNjZXNzLlVzZXJJZDtcbiAgICAgIC8vIEd1ZXNzIGF0IG1mYVxuICAgICAgd2lwX2luZm8ucHJvYmFibGVfdXNlcl9tZmFfZGV2aWNlID0gZGVyaXZlX21mYV9zZXJpYWwod2lwX2luZm8udXNlcl9hcm4hKTtcbiAgICB9KTtcblxuICAvLyBJdCdzIGJ1aWx0IC0gbWFyayBhcyBzdWNoXG4gIGxldCBpbmZvID0gd2lwX2luZm8gYXMgQXV0aEluZm87XG5cbiAgLy8gTWFrZSBvdXIgcmVxdWVzdCB0byBiZSB0aGUgcm9sZVxuICBsZXQgcmVzdWx0OiBQcm9taXNlPFByb21pc2VSZXN1bHQ8U1RTLkdldFNlc3Npb25Ub2tlblJlc3BvbnNlLCBBV1NFcnJvcj4+O1xuICBpZiAobWZhX2luZm8pIHtcbiAgICBtZmFfaW5mby5TZXJpYWxOdW1iZXIgPVxuICAgICAgbWZhX2luZm8uU2VyaWFsTnVtYmVyIHx8IGluZm8ucHJvYmFibGVfdXNlcl9tZmFfZGV2aWNlITsgLy8gV2UgY2Fubm90IGdldCB0byB0aGlzIHN0YWdlIGlmXG4gICAgcmVzdWx0ID0gc3RzXG4gICAgICAuZ2V0U2Vzc2lvblRva2VuKHtcbiAgICAgICAgRHVyYXRpb25TZWNvbmRzOiBkdXJhdGlvbixcbiAgICAgICAgU2VyaWFsTnVtYmVyOiBtZmFfaW5mby5TZXJpYWxOdW1iZXIsXG4gICAgICAgIFRva2VuQ29kZTogbWZhX2luZm8uVG9rZW5Db2RlXG4gICAgICB9KVxuICAgICAgLnByb21pc2UoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBOb3Qgc3RyaWN0bHkgbmVjZXNzYXJ5IGJ1dCB3aHkgbm90IVxuICAgIHJlc3VsdCA9IHN0cy5nZXRTZXNzaW9uVG9rZW4oKS5wcm9taXNlKCk7XG4gIH1cblxuICAvLyBIYW5kbGUgdGhlIHJlc3BvbnNlLiBPbiBTdWNjZXNzLCBzYXZlIHRoZSBjcmVkcy4gT24gZXJyb3IsIHRocm93IHRoYXQgc3R1ZmYgYmFjayFcbiAgcmV0dXJuIGF3YWl0IHJlc3VsdC50aGVuKHN1Y2Nlc3MgPT4ge1xuICAgIGxldCBjcmVkczogQXV0aENyZWRzID0ge1xuICAgICAgYWNjZXNzS2V5SWQ6IHN1Y2Nlc3MuQ3JlZGVudGlhbHMhLkFjY2Vzc0tleUlkLFxuICAgICAgc2VjcmV0QWNjZXNzS2V5OiBzdWNjZXNzLkNyZWRlbnRpYWxzIS5TZWNyZXRBY2Nlc3NLZXksXG4gICAgICBzZXNzaW9uVG9rZW46IHN1Y2Nlc3MuQ3JlZGVudGlhbHMhLlNlc3Npb25Ub2tlblxuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgIGNyZWRzLFxuICAgICAgaW5mbyxcbiAgICAgIGZyb21fbWZhOiAhIW1mYV9pbmZvXG4gICAgfTtcbiAgfSk7XG59XG5cbi8qKiBHZW5lcmF0ZXMgaHVtYW4gcmVhZGFibGUgdmVyc2lvbnMgb2YgY29tbW9uIEFXUyBlcnJvciBjb2Rlcy5cbiAqIElmIHRoZSBjb2RlIGlzIG5vdCByZWNvZ25pemVkLCBjb3VnaHMgaXQgYmFjayB1cCBhcyBhbiBlcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNjcmliZV9lcnJvcihlcnJvcjogQVdTRXJyb3IpOiBzdHJpbmcge1xuICAvLyBVbnBhY2tcbiAgbGV0IHsgY29kZSwgbWVzc2FnZSB9ID0gZXJyb3I7XG5cbiAgLy8gR2V0IHdoYXQgd2UncmUgc3VwcG9zZWQgdG8gZG8gd2l0aCBpdFxuICBzd2l0Y2ggKGNvZGUpIHtcbiAgICBjYXNlIFwiVG9rZW5SZWZyZXNoUmVxdWlyZWRcIjpcbiAgICBjYXNlIFwiRXhwaXJlZFRva2VuXCI6XG4gICAgICByZXR1cm4gXCJBdXRob3JpemF0aW9uIGV4cGlyZWQuIFBsZWFzZSBsb2cgYmFjayBpbi5cIjtcbiAgICBjYXNlIFwiSW52YWxpZEFjY2Vzc0tleUlkXCI6XG4gICAgICByZXR1cm4gXCJQcm92aWRlZCBhY2Nlc3Mga2V5IGlzIGludmFsaWQuXCI7XG4gICAgY2FzZSBcIkFjY2Vzc0RlbmllZFwiOlxuICAgICAgcmV0dXJuIGBBY2Nlc3MgZGVuaWVkLiBUaGlzIGxpa2VseSBtZWFucyB0aGF0IHlvdXIgYWNjb3VudCBkb2VzIG5vdCBoYXZlIGFjY2VzcyB0byB0aGUgc3BlY2lmaWVkIGJ1Y2tldCwgb3IgdGhhdCBpdCByZXF1aXJlcyBNRkEgYXV0aGVudGljYXRpb24uYDtcbiAgICBjYXNlIFwiQWNjb3VudFByb2JsZW1cIjpcbiAgICAgIHJldHVybiBgQWNjb3VudCBwcm9ibGVtIGRldGVjdGVkOiAke21lc3NhZ2V9YDtcbiAgICBjYXNlIFwiQ3JlZGVudGlhbHNOb3RTdXBwb3J0ZWRcIjpcbiAgICAgIHJldHVybiBcIlByb3ZpZGVkIGNyZWRlbnRpYWxzIG5vdCBzdXBwb3J0ZWQuXCI7XG4gICAgY2FzZSBcIkludmFsaWRCdWNrZXROYW1lXCI6XG4gICAgICByZXR1cm4gXCJJbnZhbGlkIGJ1Y2tldCBuYW1lISBQbGVhc2UgZW5zdXJlIHlvdSBzcGVsbGVkIGl0IGNvcnJlY3RseS5cIjtcbiAgICBjYXNlIFwiTmV0d29ya2luZ0Vycm9yXCI6XG4gICAgICByZXR1cm4gXCJOZXR3b3JraW5nIGVycm9yLiBUaGlzIG1heSBiZSBiZWNhdXNlIHRoZSBwcm92aWRlZCBidWNrZXQgbmFtZSBkb2VzIG5vdCBleGlzdC4gUGxlYXNlIGVuc3VyZSB5b3UgaGF2ZSBzcGVsbGVkIGl0IGNvcnJlY3RseS5cIjtcbiAgICBjYXNlIFwiSW52YWxpZEJ1Y2tldFN0YXRlXCI6XG4gICAgICByZXR1cm4gXCJJbnZhbGlkIGJ1Y2tldCBzdGF0ZSEgQ29udGFjdCB5b3VyIEFXUyBhZG1pbmlzdHJhdG9yLlwiO1xuICAgIGNhc2UgXCJWYWxpZGF0aW9uRXJyb3JcIjpcbiAgICAgIHJldHVybiBgRnVydGhlciB2YWxpZGF0aW9uIHJlcXVpcmVkOiAke21lc3NhZ2V9YDtcbiAgICBjYXNlIFwiU2lnbmF0dXJlRG9lc05vdE1hdGNoXCI6XG4gICAgICByZXR1cm4gXCJUaGUgcHJvdmlkZWQgc2VjcmV0IHRva2VuIGRvZXMgbm90IG1hdGNoIGFjY2VzcyB0b2tlbi4gUGxlYXNlIGVuc3VyZSB0aGF0IGl0IGlzIGNvcnJlY3QuXCI7XG4gICAgY2FzZSBcIkludmFsaWRUb2tlblwiOlxuICAgICAgcmV0dXJuIFwiWW91ciBzZXNzaW9uIHRva2VuIGhhcyBleHBpcmVkLiBQbGVhc2UgbG9nIGJhY2sgaW4gYW5kIHRyeSBhZ2Fpbi5cIjtcbiAgICBjYXNlIFwiSW52YWxpZENsaWVudFRva2VuSWRcIjpcbiAgICAgIHJldHVybiBcIlRoZSBwcm92aWRlZCBhY2Nlc3MgdG9rZW4gaXMgaW52YWxpZC4gUGxlYXNlIGVuc3VyZSB0aGF0IGl0IGlzIGNvcnJlY3QuXCI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBgVW5rb3duIGVycm9yICR7Y29kZX0uIE1lc3NhZ2U6ICR7bWVzc2FnZX1gO1xuICB9XG59XG4iXSwidmVyc2lvbiI6M30=
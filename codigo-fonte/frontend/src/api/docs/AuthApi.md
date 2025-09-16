# AuthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**login**](#login) | **POST** /api/auth/Login | |
|[**refreshToken**](#refreshtoken) | **POST** /api/auth/RefreshToken | |

# **login**
> UserToken login()


### Example

```typescript
import {
    AuthApi,
    Configuration,
    UserLogin
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let userLogin: UserLogin; // (optional)

const { status, data } = await apiInstance.login(
    userLogin
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userLogin** | **UserLogin**|  | |


### Return type

**UserToken**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **refreshToken**
> refreshToken()


### Example

```typescript
import {
    AuthApi,
    Configuration,
    LoginResponse
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let loginResponse: LoginResponse; // (optional)

const { status, data } = await apiInstance.refreshToken(
    loginResponse
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginResponse** | **LoginResponse**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


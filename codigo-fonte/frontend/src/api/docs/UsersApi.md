# UsersApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createUser**](#createuser) | **POST** /api/users/CreateUser | |
|[**deleteUser**](#deleteuser) | **DELETE** /api/users/{userId} | |
|[**listUser**](#listuser) | **GET** /api/users/ListUser | |
|[**updateUser**](#updateuser) | **PUT** /api/users/{userId} | |

# **createUser**
> CreateUserResponse createUser()


### Example

```typescript
import {
    UsersApi,
    Configuration,
    CreateUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let createUserRequest: CreateUserRequest; // (optional)

const { status, data } = await apiInstance.createUser(
    createUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createUserRequest** | **CreateUserRequest**|  | |


### Return type

**CreateUserResponse**

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

# **deleteUser**
> deleteUser()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteUser(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listUser**
> ListUserViewModel listUser()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let pageNumber: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)
let filters: Array<Filter>; // (optional) (default to undefined)

const { status, data } = await apiInstance.listUser(
    pageNumber,
    pageSize,
    filters
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageNumber** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|
| **filters** | **Array&lt;Filter&gt;** |  | (optional) defaults to undefined|


### Return type

**ListUserViewModel**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUser**
> UpdateUserResponse updateUser()


### Example

```typescript
import {
    UsersApi,
    Configuration,
    UpdateUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userId: number; // (default to undefined)
let updateUserRequest: UpdateUserRequest; // (optional)

const { status, data } = await apiInstance.updateUser(
    userId,
    updateUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserRequest** | **UpdateUserRequest**|  | |
| **userId** | [**number**] |  | defaults to undefined|


### Return type

**UpdateUserResponse**

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


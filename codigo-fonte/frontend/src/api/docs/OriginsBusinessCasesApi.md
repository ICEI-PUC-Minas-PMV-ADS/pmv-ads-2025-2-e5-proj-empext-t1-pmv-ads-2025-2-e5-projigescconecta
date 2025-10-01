# OriginsBusinessCasesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createOriginBusinessCase**](#createoriginbusinesscase) | **POST** /api/origins-business-cases/CreateOriginBusinessCase | |
|[**deleteOriginBusinessCase**](#deleteoriginbusinesscase) | **DELETE** /api/origins-business-cases/{originBusinessCaseId} | |
|[**getOriginBusinessCase**](#getoriginbusinesscase) | **GET** /api/origins-business-cases/{originBusinessCaseId} | |
|[**listOriginBusinessCase**](#listoriginbusinesscase) | **POST** /api/origins-business-cases/ListOriginBusinessCase | |
|[**updateOriginBusinessCase**](#updateoriginbusinesscase) | **PUT** /api/origins-business-cases/{originBusinessCaseId} | |

# **createOriginBusinessCase**
> CreateOriginBusinessCaseResponse createOriginBusinessCase()


### Example

```typescript
import {
    OriginsBusinessCasesApi,
    Configuration,
    CreateOriginBusinessCaseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OriginsBusinessCasesApi(configuration);

let createOriginBusinessCaseRequest: CreateOriginBusinessCaseRequest; // (optional)

const { status, data } = await apiInstance.createOriginBusinessCase(
    createOriginBusinessCaseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createOriginBusinessCaseRequest** | **CreateOriginBusinessCaseRequest**|  | |


### Return type

**CreateOriginBusinessCaseResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteOriginBusinessCase**
> deleteOriginBusinessCase()


### Example

```typescript
import {
    OriginsBusinessCasesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OriginsBusinessCasesApi(configuration);

let originBusinessCaseId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteOriginBusinessCase(
    originBusinessCaseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **originBusinessCaseId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOriginBusinessCase**
> GetOriginBusinessCaseResponse getOriginBusinessCase()


### Example

```typescript
import {
    OriginsBusinessCasesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OriginsBusinessCasesApi(configuration);

let originBusinessCaseId: number; // (default to undefined)

const { status, data } = await apiInstance.getOriginBusinessCase(
    originBusinessCaseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **originBusinessCaseId** | [**number**] |  | defaults to undefined|


### Return type

**GetOriginBusinessCaseResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listOriginBusinessCase**
> ListOriginBusinessCaseViewModel listOriginBusinessCase()


### Example

```typescript
import {
    OriginsBusinessCasesApi,
    Configuration,
    ListOriginBusinessCaseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OriginsBusinessCasesApi(configuration);

let listOriginBusinessCaseRequest: ListOriginBusinessCaseRequest; // (optional)

const { status, data } = await apiInstance.listOriginBusinessCase(
    listOriginBusinessCaseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **listOriginBusinessCaseRequest** | **ListOriginBusinessCaseRequest**|  | |


### Return type

**ListOriginBusinessCaseViewModel**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateOriginBusinessCase**
> UpdateOriginBusinessCaseResponse updateOriginBusinessCase()


### Example

```typescript
import {
    OriginsBusinessCasesApi,
    Configuration,
    UpdateOriginBusinessCaseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OriginsBusinessCasesApi(configuration);

let originBusinessCaseId: number; // (default to undefined)
let updateOriginBusinessCaseRequest: UpdateOriginBusinessCaseRequest; // (optional)

const { status, data } = await apiInstance.updateOriginBusinessCase(
    originBusinessCaseId,
    updateOriginBusinessCaseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateOriginBusinessCaseRequest** | **UpdateOriginBusinessCaseRequest**|  | |
| **originBusinessCaseId** | [**number**] |  | defaults to undefined|


### Return type

**UpdateOriginBusinessCaseResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


# BusinessCasesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createBusinessCase**](#createbusinesscase) | **POST** /api/businesscase/CreateBusinessCase | |
|[**deleteBusinessCase**](#deletebusinesscase) | **DELETE** /api/businesscase/{businessCaseId} | |
|[**getBusinessCase**](#getbusinesscase) | **GET** /api/businesscases/{businessCaseId} | |
|[**listBusinessCase**](#listbusinesscase) | **POST** /api/businesscase/ListBusinessCase | |
|[**updateBusinessCase**](#updatebusinesscase) | **PUT** /api/businesscases/{businessCaseId} | |

# **createBusinessCase**
> CreateBusinessCaseResponse createBusinessCase()


### Example

```typescript
import {
    BusinessCasesApi,
    Configuration,
    CreateBusinessCaseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BusinessCasesApi(configuration);

let createBusinessCaseRequest: CreateBusinessCaseRequest; // (optional)

const { status, data } = await apiInstance.createBusinessCase(
    createBusinessCaseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createBusinessCaseRequest** | **CreateBusinessCaseRequest**|  | |


### Return type

**CreateBusinessCaseResponse**

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

# **deleteBusinessCase**
> deleteBusinessCase()


### Example

```typescript
import {
    BusinessCasesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BusinessCasesApi(configuration);

let businessCaseId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteBusinessCase(
    businessCaseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **businessCaseId** | [**number**] |  | defaults to undefined|


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

# **getBusinessCase**
> GetBusinessCaseResponse getBusinessCase()


### Example

```typescript
import {
    BusinessCasesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BusinessCasesApi(configuration);

let businessCaseId: number; // (default to undefined)

const { status, data } = await apiInstance.getBusinessCase(
    businessCaseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **businessCaseId** | [**number**] |  | defaults to undefined|


### Return type

**GetBusinessCaseResponse**

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

# **listBusinessCase**
> ListBusinessCaseViewModel listBusinessCase()


### Example

```typescript
import {
    BusinessCasesApi,
    Configuration,
    ListBusinessCaseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BusinessCasesApi(configuration);

let listBusinessCaseRequest: ListBusinessCaseRequest; // (optional)

const { status, data } = await apiInstance.listBusinessCase(
    listBusinessCaseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **listBusinessCaseRequest** | **ListBusinessCaseRequest**|  | |


### Return type

**ListBusinessCaseViewModel**

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

# **updateBusinessCase**
> UpdateBusinessCaseResponse updateBusinessCase()


### Example

```typescript
import {
    BusinessCasesApi,
    Configuration,
    UpdateBusinessCaseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BusinessCasesApi(configuration);

let businessCaseId: number; // (default to undefined)
let updateBusinessCaseRequest: UpdateBusinessCaseRequest; // (optional)

const { status, data } = await apiInstance.updateBusinessCase(
    businessCaseId,
    updateBusinessCaseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateBusinessCaseRequest** | **UpdateBusinessCaseRequest**|  | |
| **businessCaseId** | [**number**] |  | defaults to undefined|


### Return type

**UpdateBusinessCaseResponse**

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


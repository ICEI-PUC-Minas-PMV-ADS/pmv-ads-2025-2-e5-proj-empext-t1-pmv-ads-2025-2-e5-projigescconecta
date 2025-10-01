# OscsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createOsc**](#createosc) | **POST** /api/osc/CreateOsc | |
|[**deleteOsc**](#deleteosc) | **DELETE** /api/osc/{oscId} | |
|[**getOsc**](#getosc) | **GET** /api/oscs/{oscId} | |
|[**listOsc**](#listosc) | **POST** /api/osc/ListOsc | |
|[**updateOsc**](#updateosc) | **PUT** /api/oscs/{oscId} | |

# **createOsc**
> CreateOscResponse createOsc()


### Example

```typescript
import {
    OscsApi,
    Configuration,
    CreateOscRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OscsApi(configuration);

let createOscRequest: CreateOscRequest; // (optional)

const { status, data } = await apiInstance.createOsc(
    createOscRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createOscRequest** | **CreateOscRequest**|  | |


### Return type

**CreateOscResponse**

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

# **deleteOsc**
> deleteOsc()


### Example

```typescript
import {
    OscsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OscsApi(configuration);

let oscId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteOsc(
    oscId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **oscId** | [**number**] |  | defaults to undefined|


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

# **getOsc**
> GetOscResponse getOsc()


### Example

```typescript
import {
    OscsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OscsApi(configuration);

let oscId: number; // (default to undefined)

const { status, data } = await apiInstance.getOsc(
    oscId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **oscId** | [**number**] |  | defaults to undefined|


### Return type

**GetOscResponse**

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

# **listOsc**
> ListOscViewModel listOsc()


### Example

```typescript
import {
    OscsApi,
    Configuration,
    ListOscRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OscsApi(configuration);

let listOscRequest: ListOscRequest; // (optional)

const { status, data } = await apiInstance.listOsc(
    listOscRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **listOscRequest** | **ListOscRequest**|  | |


### Return type

**ListOscViewModel**

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

# **updateOsc**
> UpdateOscResponse updateOsc()


### Example

```typescript
import {
    OscsApi,
    Configuration,
    UpdateOscRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OscsApi(configuration);

let oscId: number; // (default to undefined)
let updateOscRequest: UpdateOscRequest; // (optional)

const { status, data } = await apiInstance.updateOsc(
    oscId,
    updateOscRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateOscRequest** | **UpdateOscRequest**|  | |
| **oscId** | [**number**] |  | defaults to undefined|


### Return type

**UpdateOscResponse**

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


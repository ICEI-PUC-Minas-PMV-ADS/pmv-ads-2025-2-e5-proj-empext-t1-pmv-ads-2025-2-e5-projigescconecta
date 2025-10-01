# BeneficiariesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createBeneficiary**](#createbeneficiary) | **POST** /api/beneficiary/CreateBeneficiary | |
|[**deleteBeneficiary**](#deletebeneficiary) | **DELETE** /api/beneficiary/{beneficiaryId} | |
|[**getBeneficiary**](#getbeneficiary) | **GET** /api/beneficiaries/{beneficiaryId} | |
|[**listBeneficiary**](#listbeneficiary) | **POST** /api/beneficiary/ListBeneficiary | |
|[**updateBeneficiary**](#updatebeneficiary) | **PUT** /api/beneficiaries/{beneficiaryId} | |

# **createBeneficiary**
> CreateBeneficiaryResponse createBeneficiary()


### Example

```typescript
import {
    BeneficiariesApi,
    Configuration,
    CreateBeneficiaryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BeneficiariesApi(configuration);

let createBeneficiaryRequest: CreateBeneficiaryRequest; // (optional)

const { status, data } = await apiInstance.createBeneficiary(
    createBeneficiaryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createBeneficiaryRequest** | **CreateBeneficiaryRequest**|  | |


### Return type

**CreateBeneficiaryResponse**

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

# **deleteBeneficiary**
> deleteBeneficiary()


### Example

```typescript
import {
    BeneficiariesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BeneficiariesApi(configuration);

let beneficiaryId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteBeneficiary(
    beneficiaryId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **beneficiaryId** | [**number**] |  | defaults to undefined|


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

# **getBeneficiary**
> GetBeneficiaryResponse getBeneficiary()


### Example

```typescript
import {
    BeneficiariesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BeneficiariesApi(configuration);

let beneficiaryId: number; // (default to undefined)

const { status, data } = await apiInstance.getBeneficiary(
    beneficiaryId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **beneficiaryId** | [**number**] |  | defaults to undefined|


### Return type

**GetBeneficiaryResponse**

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

# **listBeneficiary**
> ListBeneficiaryViewModel listBeneficiary()


### Example

```typescript
import {
    BeneficiariesApi,
    Configuration,
    ListBeneficiaryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BeneficiariesApi(configuration);

let listBeneficiaryRequest: ListBeneficiaryRequest; // (optional)

const { status, data } = await apiInstance.listBeneficiary(
    listBeneficiaryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **listBeneficiaryRequest** | **ListBeneficiaryRequest**|  | |


### Return type

**ListBeneficiaryViewModel**

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

# **updateBeneficiary**
> UpdateBeneficiaryResponse updateBeneficiary()


### Example

```typescript
import {
    BeneficiariesApi,
    Configuration,
    UpdateBeneficiaryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BeneficiariesApi(configuration);

let beneficiaryId: number; // (default to undefined)
let updateBeneficiaryRequest: UpdateBeneficiaryRequest; // (optional)

const { status, data } = await apiInstance.updateBeneficiary(
    beneficiaryId,
    updateBeneficiaryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateBeneficiaryRequest** | **UpdateBeneficiaryRequest**|  | |
| **beneficiaryId** | [**number**] |  | defaults to undefined|


### Return type

**UpdateBeneficiaryResponse**

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


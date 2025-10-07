# CoursesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createCourse**](#createcourse) | **POST** /api/courses | |
|[**deleteCourse**](#deletecourse) | **DELETE** /api/courses/{courseId} | |
|[**editCourse**](#editcourse) | **PUT** /api/courses/{courseId} | |
|[**getCourseById**](#getcoursebyid) | **GET** /api/courses/{id} | |
|[**listCourse**](#listcourse) | **POST** /api/courses/search | |

# **createCourse**
> CreateCourseResponse createCourse()


### Example

```typescript
import {
    CoursesApi,
    Configuration,
    CreateCourseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let createCourseRequest: CreateCourseRequest; // (optional)

const { status, data } = await apiInstance.createCourse(
    createCourseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCourseRequest** | **CreateCourseRequest**|  | |


### Return type

**CreateCourseResponse**

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

# **deleteCourse**
> DeleteCourseResponse deleteCourse()


### Example

```typescript
import {
    CoursesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let courseId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteCourse(
    courseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**number**] |  | defaults to undefined|


### Return type

**DeleteCourseResponse**

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

# **editCourse**
> EditCourseResponse editCourse()


### Example

```typescript
import {
    CoursesApi,
    Configuration,
    EditCourseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let courseId: number; // (default to undefined)
let editCourseRequest: EditCourseRequest; // (optional)

const { status, data } = await apiInstance.editCourse(
    courseId,
    editCourseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **editCourseRequest** | **EditCourseRequest**|  | |
| **courseId** | [**number**] |  | defaults to undefined|


### Return type

**EditCourseResponse**

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

# **getCourseById**
> GetCourseByIdViewModel getCourseById()


### Example

```typescript
import {
    CoursesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getCourseById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**GetCourseByIdViewModel**

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

# **listCourse**
> ListCourseViewModel listCourse()


### Example

```typescript
import {
    CoursesApi,
    Configuration,
    ListCourseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let listCourseRequest: ListCourseRequest; // (optional)

const { status, data } = await apiInstance.listCourse(
    listCourseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **listCourseRequest** | **ListCourseRequest**|  | |


### Return type

**ListCourseViewModel**

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


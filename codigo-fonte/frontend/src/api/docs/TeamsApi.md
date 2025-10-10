# TeamsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createTeam**](#createteam) | **POST** /api/teams/CreateTeam | |
|[**deleteTeam**](#deleteteam) | **DELETE** /api/teams/{teamId} | |
|[**editTeam**](#editteam) | **PUT** /api/teams/{teamId} | |
|[**getTeamById**](#getteambyid) | **GET** /api/teams/{teamId} | |
|[**listTeam**](#listteam) | **POST** /api/teams/search | |

# **createTeam**
> CreateTeamResponse createTeam()


### Example

```typescript
import {
    TeamsApi,
    Configuration,
    CreateTeamRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let createTeamRequest: CreateTeamRequest; // (optional)

const { status, data } = await apiInstance.createTeam(
    createTeamRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createTeamRequest** | **CreateTeamRequest**|  | |


### Return type

**CreateTeamResponse**

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

# **deleteTeam**
> DeleteTeamResponse deleteTeam()


### Example

```typescript
import {
    TeamsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let teamId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteTeam(
    teamId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**number**] |  | defaults to undefined|


### Return type

**DeleteTeamResponse**

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

# **editTeam**
> EditTeamResponse editTeam()


### Example

```typescript
import {
    TeamsApi,
    Configuration,
    EditTeamRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let teamId: number; // (default to undefined)
let editTeamRequest: EditTeamRequest; // (optional)

const { status, data } = await apiInstance.editTeam(
    teamId,
    editTeamRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **editTeamRequest** | **EditTeamRequest**|  | |
| **teamId** | [**number**] |  | defaults to undefined|


### Return type

**EditTeamResponse**

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

# **getTeamById**
> GetTeamByIdResponse getTeamById()


### Example

```typescript
import {
    TeamsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let teamId: number; // (default to undefined)

const { status, data } = await apiInstance.getTeamById(
    teamId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**number**] |  | defaults to undefined|


### Return type

**GetTeamByIdResponse**

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

# **listTeam**
> ListTeamViewModel listTeam()


### Example

```typescript
import {
    TeamsApi,
    Configuration,
    ListTeamRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let listTeamRequest: ListTeamRequest; // (optional)

const { status, data } = await apiInstance.listTeam(
    listTeamRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **listTeamRequest** | **ListTeamRequest**|  | |


### Return type

**ListTeamViewModel**

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


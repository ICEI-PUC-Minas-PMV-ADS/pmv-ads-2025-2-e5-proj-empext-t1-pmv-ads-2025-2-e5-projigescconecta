# GetOscResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**oscId** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**corporateName** | **string** |  | [optional] [default to undefined]
**objective** | **string** |  | [optional] [default to undefined]
**address** | **string** |  | [optional] [default to undefined]
**zipCode** | **string** |  | [optional] [default to undefined]
**oscPrimaryDocumment** | **string** |  | [optional] [default to undefined]
**beneficiaries** | [**Array&lt;GetOscBeneficiaryResponse&gt;**](GetOscBeneficiaryResponse.md) |  | [optional] [default to undefined]
**originsBusinessCases** | [**Array&lt;GetOscOriginBusinessCaseResponse&gt;**](GetOscOriginBusinessCaseResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { GetOscResponse } from './api';

const instance: GetOscResponse = {
    oscId,
    name,
    corporateName,
    objective,
    address,
    zipCode,
    oscPrimaryDocumment,
    beneficiaries,
    originsBusinessCases,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

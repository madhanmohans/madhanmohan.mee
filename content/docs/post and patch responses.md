```
// single post success
[
    {
        "applicationId": 1694,
        "candidateId": "e235fb12-c134-4959-9bbd-3cb4ff793100"
    }
]

// single post failure
{
  "message": "Application for candidateId already exists for this job",
  "errors": [
    {
      "errorField": "Id",
      "errorType": "AlreadyExists",
      "errorCode": 409001,
      "message": "Duplicate Value Found, Field value Already Exists."
    }
  ]
}

// multiple post successes

[
    {
        "applicationId": 1695,
        "candidateId": "6e70140d-3d85-4182-9160-d08548d8f24f"
    },
    {
        "applicationId": 1696,
        "candidateId": "b51b818a-3275-4f50-998b-bf3d44055072"
    }
]

// multiple post failures

[
  {
    "status": {
      "id": "6e70140d-3d85-4182-9160-d08548d8f24f",
      "message": "Application for candidateId already exists for this job",
      "errors": [
        {
          "errorField": "Id",
          "errorType": "InvalidId",
          "errorCode": "409001",
          "message": "Application for candidateId already exists for this job"
        }
      ]
    }
  },
  {
    "status": {
      "id": "b51b818a-3275-4f50-998b-bf3d44055072",
      "message": "Application for candidateId already exists for this job",
      "errors": [
        {
          "errorField": "Id",
          "errorType": "InvalidId",
          "errorCode": "409001",
          "message": "Application for candidateId already exists for this job"
        }
      ]
    }
  }
]

// failure and success combo

[
  {
    "status": {
      "id": "6e70140d-3d85-4182-9160-d08548d8f24f",
      "message": "Application for candidateId already exists for this job",
      "errors": [
        {
          "errorField": "Id",
          "errorType": "InvalidId",
          "errorCode": "409001",
          "message": "Application for candidateId already exists for this job"
        }
      ]
    }
  },
  {
    "applicationId": 1697,
    "candidateId": "eb8aaa3f-f0ae-4ce6-9029-31f639c5e6df"
  }
]

// multiple patch successes
	[{"success":[1574,1575]},{"errors":[]}]  
// single patch success
[{"success":[1574]},{"errors":[]}]  

// single patch failure
[  
	{  
		"errors": [  
			{  
				"id": 1608,  
				"message": "Can not update to status- Screening, subtatus- Approved for Interview. Current status is Screening,substatus is In Pre-Screening",  
				"errorCode": 400006,  
				"errorType": "WrongStatusMapping",  
				"errorMessage": "Invalid operation"  
			}  
		]  
	}  
]

// multiple patch failures

[
  {
    "errors": [
      {
        "id": 1690,
        "message": "Can not update to status- Shortlist, subtatus- Approved for Interview. Current status is Interview,substatus is Approved for Interview",
        "errorCode": 400006,
        "errorType": "WrongStatusMapping",
        "errorMessage": "Invalid operation"
      },
      {
        "id": 1694,
        "message": "Can not update to status- Shortlist, subtatus- Approved for Interview. Current status is Offer,substatus is In Offer Stage",
        "errorCode": 400006,
        "errorType": "WrongStatusMapping",
        "errorMessage": "Invalid operation"
      }
    ]
  }
]

// success and failure patch combo

[
  {
    "success": [
      1690
    ]
  },
  {
    "errors": [
      {
        "id": 1694,
        "message": "Can not update to status- Interview, subtatus- In Offer Stage. Current status is Offer,substatus is In Offer Stage",
        "errorCode": 400006,
        "errorType": "WrongStatusMapping",
        "errorMessage": "Invalid operation"
      }
    ]
  }
]


I want to store the "message" value and toast it. remove partial update toast and show multiple toasts, if there are multiple objects in responses. retain the success message as it is.
```
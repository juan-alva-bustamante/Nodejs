import { Request, Response, Router } from "express";

import { ICommonResponse } from "../../interfaces/ICommonResponse";

export class InfraSystem {
  public router: Router;

  constructor() {
    const router = Router();
    router.get("/get-solis", InfraSystem.getSolis);
    router.post("/aprobe-solis", InfraSystem.aprobeSoli);
    this.router = router;
  }

  private static async getSolis(request: Request, response: Response) {
    try {
      console.log(`* * * * *`);
      const responseData = await fetch(
        "https://api.sysinfraops.com/operation/authorizers/224/requests?offset=0&limit=10&sort_by=id",
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9,es-US;q=0.8,es;q=0.7,la;q=0.6",
            authorization:
              "Bearer eyJraWQiOiJVSGNVek9nMnQ4eFFvdHNKcXRDRld3QTFUVVVXaERFN3RyTU4zUjIyTDJFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmMDEzYjYwNC04YmNkLTRhN2QtOWQyMi1jYTgwNTIxNmZkZTQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfQVBYNFlRN2taIiwiY29nbml0bzp1c2VybmFtZSI6IjEwNjM2NDgiLCJvcmlnaW5fanRpIjoiNDBhNzNjNDAtYmJmOS00MTgwLWFiYzgtMDM2M2JlZTVhMjNiIiwiYXVkIjoiNWIzMmU1MW1zN2dxdXVzODNraWltZzU3NzUiLCJldmVudF9pZCI6IjRhN2QxNzY3LWNmNWEtNDgzMS1iODllLWZjNzgwMjZlYTQwOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQ3NDE3OTE2LCJleHAiOjE3NDc1MDQzMTYsImlhdCI6MTc0NzQxNzkxNiwianRpIjoiNTY5MzEwNjUtOThlNS00Y2ExLTkxYTMtN2Y0YWY5M2ZiNmFkIiwiZW1haWwiOiJqdWFuLmFsdmFAZWxla3RyYS5jb20ubXgifQ.Fqgk_3k1q2pmVffQlQosEERaiMkeJIM5LHpPpMITZnoVtcrP0MumXhLLbnkv0qWgyhjBBpOds4HPVl5yA5pZmFyl9DgjbKF8kOWacjTuuEUf1l3d34rJrN06TPLRaKlHxforoSDhnOhTt1iYG97LbMJTWkVRGq0O-BJyQ5xR7H9KWzSCDvh6D1SsdOM6oOOd3r2yNHcKVMXGx8SJ8zTh58KtXA7swe2hyOTXUcb9bkxwHoSHrbEpLeu2_eX8yOnQWKcnenVPifnlg9r5d0xj5i70qPmf00-pLxlvEv4GwZ0fDxUVQew5TvOv0Wqi2Tc5WFMCcbxbnRmntphdtW6GXQ",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-user-id": "224",
            Referer: "https://admin.sysinfraops.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
          body: null,
          method: "GET",
        }
      );

      console.log(`Response data `, responseData);
      const data =
        responseData !== undefined ? await responseData.json() : responseData;

      return response.status(200).json({
        status: 200,
        success: true,
        message: `Exito`,
        data: { data },
      } as ICommonResponse);
    } catch (err: any) {
      return response.status(504).json({
        status: 504,
        success: false,
        message: "Error al crear reporte",
        data: err.toString(),
      } as ICommonResponse);
    }
  }

  private static async aprobeSoli(request: Request, response: Response) {
    try {
      const idSoli: string = request.body.id;
      console.log(`* * * * *`);
      console.log(`Soli a aprobar `, idSoli);
      const responseData = await fetch(
        `https://api.sysinfraops.com/operation/authorizers/224/requests/${idSoli}`,
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9,es-US;q=0.8,es;q=0.7,la;q=0.6",
            authorization:
              "Bearer eyJraWQiOiJVSGNVek9nMnQ4eFFvdHNKcXRDRld3QTFUVVVXaERFN3RyTU4zUjIyTDJFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmMDEzYjYwNC04YmNkLTRhN2QtOWQyMi1jYTgwNTIxNmZkZTQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfQVBYNFlRN2taIiwiY29nbml0bzp1c2VybmFtZSI6IjEwNjM2NDgiLCJvcmlnaW5fanRpIjoiNDBhNzNjNDAtYmJmOS00MTgwLWFiYzgtMDM2M2JlZTVhMjNiIiwiYXVkIjoiNWIzMmU1MW1zN2dxdXVzODNraWltZzU3NzUiLCJldmVudF9pZCI6IjRhN2QxNzY3LWNmNWEtNDgzMS1iODllLWZjNzgwMjZlYTQwOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQ3NDE3OTE2LCJleHAiOjE3NDc1MDQzMTYsImlhdCI6MTc0NzQxNzkxNiwianRpIjoiNTY5MzEwNjUtOThlNS00Y2ExLTkxYTMtN2Y0YWY5M2ZiNmFkIiwiZW1haWwiOiJqdWFuLmFsdmFAZWxla3RyYS5jb20ubXgifQ.Fqgk_3k1q2pmVffQlQosEERaiMkeJIM5LHpPpMITZnoVtcrP0MumXhLLbnkv0qWgyhjBBpOds4HPVl5yA5pZmFyl9DgjbKF8kOWacjTuuEUf1l3d34rJrN06TPLRaKlHxforoSDhnOhTt1iYG97LbMJTWkVRGq0O-BJyQ5xR7H9KWzSCDvh6D1SsdOM6oOOd3r2yNHcKVMXGx8SJ8zTh58KtXA7swe2hyOTXUcb9bkxwHoSHrbEpLeu2_eX8yOnQWKcnenVPifnlg9r5d0xj5i70qPmf00-pLxlvEv4GwZ0fDxUVQew5TvOv0Wqi2Tc5WFMCcbxbnRmntphdtW6GXQ",
            "content-type": "application/json",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-user-id": "224",
            Referer: "https://admin.sysinfraops.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
          body: '{"status_id":5}',
          method: "POST",
        }
      );
      const data = await responseData.json();

      return response.status(200).json({
        status: 200,
        success: true,
        message: `Exito`,
        data: { data },
      } as ICommonResponse);
    } catch (err: any) {
      return response.status(504).json({
        status: 504,
        success: false,
        message: "Error al crear reporte",
        data: err.toString(),
      } as ICommonResponse);
    }
  }
}

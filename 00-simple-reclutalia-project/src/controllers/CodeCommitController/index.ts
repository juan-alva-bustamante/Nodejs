import { Request, Response, Router } from "express";
const AWS = require("aws-sdk");
const fs = require("fs");
const { Parser } = require("json2csv");

import { ICommonResponse } from "../../interfaces/ICommonResponse";

export class CodeCommitController {
  public router: Router;
  // Configurar las credenciales de AWS
  private static codecommit: any = null;

  constructor() {
    const router = Router();
    router.get("/repositories", CodeCommitController.listRepositories);
    router.post(
      "/repositories-details",
      CodeCommitController.detailRepositories
    );
    this.router = router;
    CodeCommitController.codecommit = new AWS.CodeCommit({
      accessKeyId: process.env.accessKeyId, // Reemplaza con tu Access Key
      secretAccessKey: process.env.secretAccessKey, // Reemplaza con tu Secret Key
      region: "us-east-1", // Cambia por la región donde están tus repositorios
    });
  }

  // Función para obtener detalles adicionales de un repositorio
  getRepositoryDetails = async (repositoryName: string) => {
    try {
      const data = await CodeCommitController.codecommit
        .getRepository({ repositoryName })
        .promise();
      console.log("Detalles del repositorio:", data.repositoryMetadata);
    } catch (error) {
      console.error("Error al obtener detalles del repositorio:", error);
    }
  };

  private static async listRepositories(request: Request, response: Response) {
    try {
      // Función para obtener los repositorios de CodeCommit
      const data = await CodeCommitController.codecommit
        .listRepositories()
        .promise();

      return response.status(200).json({
        status: 200,
        success: true,
        message: `Exito`,
        data: data,
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

  private static async detailRepositories(
    request: Request,
    response: Response
  ) {
    try {
      // Función para obtener los repositorios de CodeCommit
      const lambdasName: string[] = request.body.lambdas;

      const lambdas: any[] = [];
      // Obtener detalles adicionales de cada repositorio
      for (const repo of lambdasName) {
        try {
          console.log(`* * * * *`);
          const data = await CodeCommitController.codecommit
            .getRepository({ repositoryName: repo })
            .promise();
          console.log(`✔️ DETALLES OBTENIDOS de: ${repo}`);
          lambdas.push({
            ...data.repositoryMetadata,
            repo,
          });
        } catch (err) {
          console.log(`❌ Error al obtener detalles de: ${repo}`);
        }
      }

      // Formatear la fecha a un formato más legible
      const formattedData = lambdas.map((item) => ({
        repositorio: item.repo,
        creationDate: new Date(item.creationDate).toLocaleString("es-MX", {
          timeZone: "UTC",
        }),
        lastModifiedDate: new Date(item.lastModifiedDate).toLocaleString(
          "es-MX",
          {
            timeZone: "UTC",
          }
        ),
        repositoryDescription: item.repositoryDescription,
      }));

      // Configurar los campos para el CSV
      const fields = ["repositorio", "creationDate", "lastModifiedDate"];
      const opts = { fields };

      const parser = new Parser(opts);
      const csv = parser.parse(formattedData);

      fs.writeFileSync(`CSV\\Lambdas_${new Date().getTime()}.csv`, csv);
      console.log(
        `CSV generado con éxito: CSV\\Lambdas_${new Date().getTime()}.csv`
      );

      return response.status(200).json({
        status: 200,
        success: true,
        message: `Exito`,
        data: lambdas,
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

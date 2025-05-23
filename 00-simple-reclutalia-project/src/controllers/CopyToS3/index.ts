import { Request, Response, Router } from "express";
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

import { ICommonResponse } from "../../interfaces/ICommonResponse";

// Configura el SDK de AWS
// Configurar las credenciales de AWS
AWS.config.update({
  region: "us-east-1", // Cambia según tu región
  // También puedes usar AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY como variables de entorno
  accessKeyId: process.env.accessKeyIdS3, // Reemplaza con tu Access Key
  secretAccessKey: process.env.secretAccessKeyS3, // Reemplaza con tu Secret Key
});

export class CopyToS3 {
  public router: Router;

  constructor() {
    const router = Router();
    router.post("/uploadToS3", CopyToS3.copyToS3);
    this.router = router;
  }

  private static async copyToS3(request: Request, response: Response) {
    try {
      console.log(`* * * * *`);
      // Ruta local y destino en S3
      const carpetaLocal = path.join(__dirname, "out");
      const bucketName = "beta.reclutalia.mf.modules";
      const carpetaDestinoEnS3 = "prueba-mf/";
      const archivos = fs.readdirSync(carpetaLocal);
      console.log(`Carpeta a subir... `, carpetaDestinoEnS3);
      console.log(`Arcihvos a subir... `, archivos);
      const s3 = new AWS.S3();

      for (const archivo of archivos) {
        const rutaArchivo = path.join(carpetaLocal, archivo);

        if (fs.statSync(rutaArchivo).isFile()) {
          const contenido = fs.readFileSync(rutaArchivo);
          const tipoMime = mime.lookup(archivo) || "application/octet-stream";

          const params = {
            Bucket: bucketName,
            Key: `${carpetaDestinoEnS3}${archivo}`,
            Body: contenido,
            ContentType: tipoMime,
          };

          await s3.upload(params).promise();
          console.log(`Subido: ${archivo}`);
        }
      }

      return response.status(200).json({
        status: 200,
        success: true,
        message: `Exito`,
        data: "Se subio con exito",
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

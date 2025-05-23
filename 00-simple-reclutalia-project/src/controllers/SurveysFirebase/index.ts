import { Request, Response, Router } from "express";
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  doc,
  collection,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  limit,
  getCountFromServer,
  orderBy,
  startAfter,
} = require("firebase/firestore");
const fs = require("fs").promises; // para usar readFile con Promesas
const path = require("path");

import { ICommonResponse } from "../../interfaces/ICommonResponse";
import { AwsDocumentDB } from "../../persitance/AwsDocumentDB";
import { JobApplicationsModel } from "../../schemas/JobApplications/JobApplicationsModel";

export class SurveysFirebaseController {
  public router: Router;
  private DB: AwsDocumentDB;

  private jobApplicationsModel = JobApplicationsModel;

  constructor() {
    this.DB = new AwsDocumentDB();
    this.DB.validateConnection();

    const router = Router();
    router.get("/delete", SurveysFirebaseController.borrarEntrevistas);
    router.get("/get-surveys", SurveysFirebaseController.obtenerEntrevistas);
    router.get("/delete-json", SurveysFirebaseController.eliminarPorJap);
    this.router = router;
  }

  private static async eliminarPorJap(request: Request, response: Response) {
    try {
      // Función para esperar n milisegundos
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      // Tu configuración web de Firebase (del panel de Firebase)
      const firebaseConfig = {
        apiKey: "AIzaSyBpuek41eBgXblByw_D3e7scxrbPVBiqAg",
        authDomain: "reclutalia-prod.firebaseapp.com",
        projectId: "reclutalia-prod",
        storageBucket: "reclutalia-prod.appspot.com",
        messagingSenderId: "856776289571",
        appId: "1:856776289571:web:58face5f4ce47a77837096",
        measurementId: "G-MS1R86RG2S",
      };

      // Inicializa Firebase App
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getFirestore(firebaseApp);

      const carpetaLocal = path.join(__dirname, "surveys.json");
      const rawData = await fs.readFile(carpetaLocal, "utf8");
      const dataArray: any[] = JSON.parse(rawData);

      let results: any[] = [];

      let contador = 1;
      const total = dataArray.length - 1;
      for (const item of dataArray) {
        const jobApplicationId = item.japId;
        const rh = item?.owners[0]?.employeeNumber;
        const fe = item?.owners[1]?.employeeNumber;
        console.log("  ");
        console.log("******************** ");
        console.log("Procesando japId: ", jobApplicationId);
        console.log("Procesando RH: ", rh);
        console.log("Procesando FE: ", fe);

        const surveyRefget = doc(db, `Surveys/${jobApplicationId}`);
        const docSnap = await getDoc(surveyRefget);

        if (docSnap.exists()) {
          console.log("Documento encontrado solo con japId... ");
          await deleteDoc(doc(db, `Surveys/${jobApplicationId}`));
          console.log("Documento eliminado... ");
        } else {
          const surveyRefgetRH = doc(db, `Surveys/${jobApplicationId}_${rh}`);
          const docSnapRh = await getDoc(surveyRefgetRH);
          if (docSnapRh) {
            console.log("Documento encontrado con el NE del RH... ");
            await deleteDoc(doc(db, `Surveys/${jobApplicationId}_${rh}`));
            console.log("Documento eliminado... ");
          } else {
            const surveyRefgetFE = doc(db, `Surveys/${jobApplicationId}_${fe}`);
            const docSnapFe = await getDoc(surveyRefgetFE);
            if (docSnapFe) {
              console.log("Documento encontrado con el NE del FE... ");
              await deleteDoc(doc(db, `Surveys/${jobApplicationId}_${fe}`));
              console.log("Documento eliminado... ");
            } else {
              console.log("❗Documento NO encontrado en firebase... ");
            }
          }
        }

        console.log(`Procesando ${contador} de ${total}...`);

        // Aquí podrías hacer una llamada a una API, por ejemplo
        await delay(1000); // espera 3 segundos antes de seguir
        contador = contador + 1;
      }

      return response.status(200).json({
        status: 200,
        success: true,
        message: `Exito`,
        data: { results },
      } as ICommonResponse);
    } catch (err) {
      console.error("❌ Error al obetner los registros", err);
    }
  }

  private static async obtenerEntrevistas(
    request: Request,
    response: Response
  ) {
    try {
      // Tu configuración web de Firebase (del panel de Firebase)
      const firebaseConfig = {
        apiKey: "AIzaSyBpuek41eBgXblByw_D3e7scxrbPVBiqAg",
        authDomain: "reclutalia-prod.firebaseapp.com",
        projectId: "reclutalia-prod",
        storageBucket: "reclutalia-prod.appspot.com",
        messagingSenderId: "856776289571",
        appId: "1:856776289571:web:58face5f4ce47a77837096",
        measurementId: "G-MS1R86RG2S",
      };

      // Inicializa Firebase App
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getFirestore(firebaseApp);

      const pageSize = 500;
      let results: any[] = [];
      let lastDoc = null;
      let more = true;

      while (more) {
        console.log(`Obteniendo entrevistas cursor: ${lastDoc}`);
        const q: any = query(
          collection(db, "Surveys"),
          orderBy("id"), // ⚠️ este campo debe existir y ser indexado
          ...(lastDoc ? [startAfter(lastDoc)] : []),
          limit(pageSize)
        );

        const snapshot = await getDocs(q);

        snapshot.docs.forEach((doc: any) => {
          results.push({ id: doc.id });
        });

        if (snapshot.size < pageSize) {
          more = false; // no hay más documentos
        } else {
          lastDoc = snapshot.docs[snapshot.docs.length - 1]; // prepara el cursor
        }
      }

      console.log(`Total documentos traídos: ${results.length}`);

      return response.status(200).json({
        status: 200,
        success: true,
        message: `Exito`,
        data: { results },
      } as ICommonResponse);
    } catch (err) {
      console.error("❌ Error al obetner los registros", err);
    }
  }

  private static async borrarEntrevistas(request: Request, response: Response) {
    try {
      // Tu configuración web de Firebase (del panel de Firebase)
      const firebaseConfig = {
        apiKey: "AIzaSyBpuek41eBgXblByw_D3e7scxrbPVBiqAg",
        authDomain: "reclutalia-prod.firebaseapp.com",
        projectId: "reclutalia-prod",
        storageBucket: "reclutalia-prod.appspot.com",
        messagingSenderId: "856776289571",
        appId: "1:856776289571:web:58face5f4ce47a77837096",
        measurementId: "G-MS1R86RG2S",
      };

      // Inicializa Firebase App
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getFirestore(firebaseApp);

      console.log("Obteniendo coleccion de firebase....");
      const coll = collection(db, "Surveys");
      console.log("Obteniendo total, haciendo count....");
      const snapshotTotal = await getCountFromServer(coll);
      console.log("Cantidad de encuestas:", snapshotTotal.data().count);

      const surveysRef = query(
        collection(db, "Surveys"),
        // orderBy("createdAt", "desc"), // ordena por campo (¡necesario para paginación!)
        limit(1)
      );
      const snapshot = await getDocs(surveysRef);
      const items = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        // ...doc.data(),
      }));

      for (const survey of items) {
        try {
          // console.log("👽 Obteniendo datos de la entrevista: ", survey.id);
          // const response = await fetch(`https://tu-api.com/datos/${survey.id}`);
          // const data = await response.json();
          // aquí puedes hacer lo que necesites con la respuesta
          let japId = survey.id as string;
          if (japId.includes("_")) {
            japId = japId.split("_")[0];
          }
          let filter: any = {
            _id: japId,
          };
          const jobApplication = await JobApplicationsModel.findOne(filter);

          if (jobApplication) {
            console.log(`Se encontro resultado para la entrevista ${japId}`);
            const estatus = jobApplication.status;
            console.log(`Estado de la entrevista ${japId}`, estatus);
          }
        } catch (error) {
          console.error("❌ Error en la API para", error);
        }
      }

      return response.status(200).json({
        status: 200,
        success: true,
        message: `Exito`,
        data: { items },
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

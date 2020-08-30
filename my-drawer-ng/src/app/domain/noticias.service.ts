import { Injectable } from "@angular/core";
import couchbaseModule = require("nativescript-couchbase");
import { getJSON, request } from "tns-core-modules/http";
const sqlite = require("nativescript-sqlite");

@Injectable()
export class NoticiasService {
  api: string = "https://303c446f.ngrok.io";
  database: couchbaseModule.Couchbase;

  constructor() {
    this.database = new couchbaseModule.Couchbase("test-database");

    this.getDb((db) => {
      console.dir(db);
      db.each("select * from logs",
        (err, fila) => console.log("fila: ", fila),
        (err, totales) => console.log("Filas totales: ", totales));
    }, () => console.log("error on getDB"));

    this.database.createView("logs", "1", (document, emitter) => emitter.emit(document._id, document));
    const rows = this.database.executeQuery("logs", {limit : 200});
    console.log("documentos: " + JSON.stringify(rows));
  }

  getDb(fnOk, fnError) {
    return new sqlite("mi_db_logs", (err, db) => {
      if (err) {
        console.error("Error al abrir db!", err);
      } else {
        console.log("Está la db abierta: ", db.isOpen() ? "Si" : "No");
        db.execSQL("CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, texto TEXT)")
          .then((id) => {
              console.log("CREATE TABLE OK");
              fnOk(db);
          }, (error) => {
              console.log("CREATE TABLE ERROR", error);
              fnError(error);
          });
      }
    });
  }

  agregar(s: string) {
    return request({
      url: this.api + "/favs",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      content: JSON.stringify({
          nuevo: s
      })
    });
  }

  favs() {
    return getJSON(this.api + "/favs");
  }

  buscar(s: string) {
    this.getDb((db) => {
      db.execSQL("insert into logs (texto) values (?)", [s],
        (err, id) => console.log("nuevo id: ", id));
    }, () => console.log("error on getDB"));

    const documentId = this.database.createDocument({ texto: s });
    console.log("nuevo id couchbase: ", documentId);

    return getJSON(this.api + "/get?q=" + s);
  }
}

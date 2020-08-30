import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import * as SocialShare from "nativescript-social-share";
import * as Toast from "nativescript-toasts";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { AppState } from "../app.module";
import { Noticia, NuevaNoticiaAction } from "../domain/noticias-state.model";
import { NoticiasService } from "../domain/noticias.service";

@Component({
    selector: "Search",
    moduleId: module.id,
    templateUrl: "./search.component.html"/*,
    providers: [NoticiasService]*/
})
export class SearchComponent implements OnInit {
    resultados: Array<string> = [];
    @ViewChild("layout") layout: ElementRef;

    constructor(
            private noticias: NoticiasService,
            private store: Store<AppState>
        ) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        this.store.select((state) => state.noticias.sugerida)
            .subscribe((data) => {
                const f = data;
                if (f != null) {
                    Toast.show({text: "Sugerimos leer: " + f.titulo, duration: Toast.DURATION.SHORT});
                }
            });
    }

    onPull(e) {
        console.log(e);
        const pullRefresh = e.object;
        setTimeout(() => {
            this.resultados.push("xxxxxxx");
            pullRefresh.refreshing = false;
        }, 2000);
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onItemTap(args): void {
        this.store.dispatch(new NuevaNoticiaAction(new Noticia(args.view.bindingContext)));
    }

    onLongPress(s): void {
        console.log(s);
        SocialShare.shareText(s, "Asunto: compartido desde el curso!");
    }

    buscarAhora(s: string) {
        console.dir("buscarAhora" + s);
        this.noticias.buscar(s).then((r: any) => {
            console.log("resultados buscarAhora: " + JSON.stringify(r));
            this.resultados = r;
        }, (e) => {
            console.log("error buscarAhora " + e);
            Toast.show({text: "Error en la búsqueda", duration: Toast.DURATION.SHORT});
        });
    }
}

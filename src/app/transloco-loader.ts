import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Translation, TranslocoLoader } from "@jsverse/transloco";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    private http = inject(HttpClient);
    isBrowser: boolean;

    constructor() {
        this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    }

    getTranslation(lang: string) {
        const baseUrl = environment.baseUrl[this.isBrowser ? "client" : "server"];
        return this.http.get<Translation>(`${baseUrl}/assets/i18n/${lang}.json`);
    }
}

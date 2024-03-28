import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '../interfaces/country';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { cacheInterface } from '../interfaces/cache-store.interfaces';
import { Region } from '../interfaces/region.type';


@Injectable({
    providedIn: 'root'
})

export class CountriesService {
    private urlApi:string = 'https://restcountries.com/v3.1';

    public cacheStore: cacheInterface = {
        byCapital:{term:'', countries: []},
        byCountries:{term:'', countries: []},
        byRegion:{region:'', countries: []}
    }

    constructor(private httpClient: HttpClient){
        this.loadFromLocalStorage();
    }

    private saveToLocalStorage(){
        localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
    }

    private loadFromLocalStorage(){
        if( !localStorage.getItem('cacheStore') ) return;

        this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
    }

    private getCountriesRequest(url:string):Observable<Country[]>{
        return this.httpClient.get<Country[]>(url)
        .pipe(
            catchError( () => of([])),
            // delay( 2000 )
        );
    }

    searchCapital(term:string) :Observable<Country[]>{
        const url:string = `${this.urlApi}/capital/${term}`;
        return this.getCountriesRequest(url)
        .pipe(
            tap(countries => this.cacheStore.byCapital = { term: term, countries:countries }),
            tap( () => this.saveToLocalStorage()),
        );
    }

    searchCountry(term:string) :Observable<Country[]>{
        const url:string = `${this.urlApi}/name/${term}`;
        return this.getCountriesRequest(url)
        .pipe(
            tap(countries => this.cacheStore.byCountries = { term: term, countries:countries }),
            tap( () => this.saveToLocalStorage()),
        );
    }

    searchRegion(region: Region) :Observable<Country[]>{
        const url:string = `${this.urlApi}/region/${region}`;
        return this.getCountriesRequest(url)
        .pipe(
            tap(countries => this.cacheStore.byRegion = { region: region, countries:countries }),
            tap( () => this.saveToLocalStorage()),
        );
    }

    searchCountryByAlphaCode(code:string):Observable<Country | null>{
        const url:string = `${this.urlApi}/alpha/${code}`;
        return this.httpClient.get<Country[]>(url)
            .pipe(
                map(countries => countries.length > 0 ? countries[0] : null),
                catchError( () => of(null))
            );
    }
}
import { Observable } from 'rxjs'
import { PowerOnApiResponse } from './models/poweron.response';

export class PowerOnResults {
  private actualResults: any[] = [];
  private actualPage: number = 1;
  private actualSearch: string | null = null;

  private totalPages: number = 0;
  private totalResults: number = 0;

  public requestResults(
    observable: Observable<PowerOnApiResponse>, 
    requestSearch: string, 
    requestPage: number, 
    success: (response: PowerOnApiResponse) => void,
    error: () => void
  ): void {
    if ((requestSearch && this.actualSearch != requestSearch) || (this.actualSearch && !requestSearch)) {
      requestPage = 1;
    } else if (this.actualResults.length > 0 && requestPage <= this.actualPage) {
      throw 'Los resultados solicitados ya estan en el listado final';
    }
    observable.subscribe((response: PowerOnApiResponse) => {
      this.configureResults(requestSearch, requestPage, response);
      success(response);
    }, error);    
  }

  public configureResults(requestSearch: string | null, requestPage: number, response: PowerOnApiResponse): void {
    this.actualResults = requestPage > 1 ? this.actualResults.concat(response.data.results) : response.data.results;
    this.actualPage = requestPage;
    this.actualSearch = requestSearch;
    this.totalPages = response.data.totalPages;
    this.totalResults = response.data.totalResults;
  }

  public refreshResults(response: PowerOnApiResponse): void {
    this.resetResults();
    this.configureResults(null, 1, response);
  }
  
  public updateResult(updateItem: any, keyName: any = 'id'): void {
    this.actualResults = this.actualResults.map(item => {
      return item[keyName] != updateItem[keyName] ? item : updateItem;
    });
  }

  public resetResults(): void {
    this.actualPage = 1;
    this.actualResults = [];
    this.actualSearch = null;

    this.totalPages = 0;
    this.totalResults = 0;
  }

  public getResults(): any[] {
    return this.actualResults;
  }

  public getPage(): number {
    return this.actualPage;
  }

  public getSearch(): string | null {
    return this.actualSearch;
  }

  public getTotalResults(): number {
    return this.totalResults;
  }

  public getTotalPages(): number {
    return this.totalPages;
  }

  public hasMoreResults(): boolean {
    return this.actualPage < this.totalPages;
  }

  public getNextPage(): number {
    return this.actualPage < this.totalPages ? (this.actualPage + 1) : this.totalPages;
  }
}

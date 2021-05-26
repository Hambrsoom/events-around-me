import UserInputError from "../error-handlers/user-input.error-handler";
import PageInfo from "../types/pagination/page-info.type";

export class PaginationService {
  public static getElements(
    after: string,
    first: number,
    elementsFromDatabase: any[],
    ): any {
      const totalCount: number = elementsFromDatabase.length;
      let start: number = PaginationService.getStartingPoint(after, elementsFromDatabase);
      let elements: any[] = PaginationService.SliceListOfElements(start, first, elementsFromDatabase);
      const {edges, endCursor} = PaginationService.defineEdges(elements);
      const pageInfo: PageInfo = PaginationService.definePageInfo(start, first, totalCount, endCursor);

      return {
          edges,
          pageInfo,
          totalCount,
      };
  }

  public static getStartingPoint(
    after: string,
    elementsFromDatabase: any[],
    ): number {
      if (after) {
        const index: number = elementsFromDatabase.findIndex((element) => element.id == after);
        if (index === -1) {
          throw new UserInputError(`Failed to find the id with value of after ${after}`);
        }
        return index + 1;
      }
      return 0;
  }

  public static SliceListOfElements(
    start: number,
    first: number,
    elements: any[],
    ) {
      return first === undefined ?
        elements :
        elements.slice(start, start + first);
  }

  public static definePageInfo(
    start: number,
    first: number,
    totalCount: number,
    endCursor: string,
    ): PageInfo {
      const hasNextPage: boolean = start + first < totalCount;
      const pageInfo: PageInfo = endCursor !== undefined ?
      {
        endCursor,
        hasNextPage,
      } :
      {
        hasNextPage,
      };
      return pageInfo;
  }

  public static defineEdges(
    elements: any[],
    ): { edges: any[], endCursor: string} {
      let endCursor: string;
      const edges: any[] = elements.map((event) => {
        endCursor = event.id;
        return ({
          cursor: endCursor,
          node: event,
        });
      });
      return { edges, endCursor };
  }
}

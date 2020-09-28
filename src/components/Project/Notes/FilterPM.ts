import { PagePM } from './NotesPM';
import { BubbleNote, NotesFilter } from '../../../model/domain/BubbleNotes';
import { FilterBtnPM } from './FilterUI';
import { SECTION } from './filter';

export const filterPM = (
  pages: PagePM[],
  fn: (page: BubbleNote) => boolean
): PagePM[] => {
  
  var currentSection:any = null
  var filtered = pages.map((page: PagePM) => {
    var notes = page.notes
      .map((node) => {

      
        if (node.$$ == "Group") {
          var nodes = node.nodes.filter(fn);
          return nodes.length > 0 ? { $$: "Group", nodes } : null;
        } else {
          return fn(node) ? node : null;
        }
      })
      .filter(notNull);

    return notes.length > 0 ? { ...page, notes } : null;
  });
  var out = filtered.filter(notNull) as any;
  return out;
};

const notNull = (v: any) => v != null;

export const hasCol = (filter: NotesFilter, col: string): boolean => {
  return filter && filter.col ? filter.col.indexOf(col) >= 0 : false;
};

export const toFilterPM = (filter?: NotesFilter): FilterBtnPM[] => {
  var blue: boolean = hasCol(filter!, "blue");
  var yellow: boolean = hasCol(filter!, "yellow");
  var green = hasCol(filter!, "green");

  var all = !blue && !yellow && !green;

  return [
    { label: "all", v: all, ref: "all" },
    { label: "sections", v: green, ref: "green" },
    { label: "hilights", v: blue, ref: "blue" },
    { label: "references", v: yellow, ref: "yellow" },
  ];
};
